"use server";

import { getServerSession } from "next-auth";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { sendVerificationEmail } from "../sendGridMail";
import { generateVerificationCode, hashPassword } from "../utils";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Meal from "../models/meal.model";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import Stripe from "stripe";
import { redirect } from "next/navigation";
import { payment_id } from "@/constants";

interface Meal {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface CartItem {
  meal: Meal;
  quantity: number;
}
interface UserAddress {
  streetAddress: string;
  aptNo: string;
  city: string;
  zipCode: string;
}
type LineItem = {
  price: string;
  quantity: number;
};

export async function registerUser({
  email,
  password,
  fullName,
}: {
  email: string;
  password: string;
  fullName: string;
}): Promise<void> {
  try {
    await connectToDB();
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      throw new Error("Account already registered. Please login.");
    }
    if (!password) {
      throw new Error("Password is required");
    }
    const hashedPassword = await hashPassword(password);
    const verificationCode = await generateVerificationCode();
    const verificationLink = `http://localhost:3000/activateUser/${verificationCode}`;

    const newUser = await User.create({
      name: fullName,
      email: email,
      password: hashedPassword,
      verification: {
        code: verificationCode,
      },
    });

    await sendVerificationEmail({
      userEmail: newUser.email,
      userName: newUser.name,
      verificationLink: verificationLink,
    });
  } catch (err: any) {
    throw new Error(`Error registering user! Please try again later.`);
  }
}
export async function activateUser(token: string): Promise<void> {
  try {
    await connectToDB();
    const user = await User.findOne({
      "verification.code": token,
      isVerified: false,
    });
    if (!user || user.verification.code === "undefined") {
      throw new Error("Invalid Token or user is already varified");
    }
    if (
      Date.now() - new Date(user.verification.createdAt).getTime() >
      24 * 60 * 60 * 1000
    ) {
      throw new Error("Link Expired!");
    }
    user.isVerified = true;
    user.verification.code = undefined;
    await user.save();
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function resendVerificationLink(token: string): Promise<void> {
  try {
    await connectToDB();
    const user = await User.findOne({
      "verification.code": token,
      isVerified: false,
    });
    if (!user || user.verification.code === "undefined") {
      throw new Error("Invalid request!");
    }
    if (
      Date.now() - new Date(user.verification.createdAt).getTime() >
      24 * 60 * 60 * 1000
    ) {
      const newVerificationCode = await generateVerificationCode();
      const verificationLink = `http://localhost:3000/activateUser/${newVerificationCode}`;

      user.verification.code = newVerificationCode;
      user.verification.createdAt = Date.now();
      await user.save();
      await sendVerificationEmail({
        userEmail: user.email,
        userName: user.name,
        verificationLink: verificationLink,
      });
    }
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function fetchUserAddress(): Promise<UserAddress> {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;
    await connectToDB();
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("Error getting user Address!");
    }
    const streetAddress = user.address.streetAddress;
    const aptNo = user.address.aptNo;
    const city = user.address.city;
    const zipCode = user.address.zipCode;

    return { streetAddress, city, zipCode, aptNo };
  } catch (err: any) {
    throw new Error(err.message);
  }
}

export async function updateUserAddress(
  newAddress: UserAddress
): Promise<UserAddress> {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;
    await connectToDB();

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Error updating user address!");
    }

    user.address = {
      streetAddress: newAddress.streetAddress,
      aptNo: newAddress.aptNo,
      city: newAddress.city,
      zipCode: newAddress.zipCode,
    };
    await user.save();

    console.log("User address updated successfully!");
    return user.address;
  } catch (err: any) {
    throw new Error("Error updating user address!");
  }
}

export async function fetchCart(): Promise<CartItem[]> {
  try {
    const session = await getServerSession(authOptions);
    await connectToDB();

    if (session?.user) {
      const userId = session?.user.id;
      const user = await User.findById(userId).populate({
        path: "cart.meal",
        model: Meal,
        select: ["_id", "title", "description", "price", "imageUrl"],
      });
      const userCart = user.cart.map((cartItem: any) => ({
        meal: {
          _id: cartItem.meal._id.toString(),
          title: cartItem.meal.title,
          description: cartItem.meal.description,
          price: cartItem.meal.price,
          imageUrl: cartItem.meal.imageUrl,
        },
        quantity: cartItem.quantity,
      }));

      return userCart;
    } else {
      const cookieStore = cookies();
      let localCart: { meal: string; quantity: number }[] = [];
      localCart = JSON.parse(cookieStore.get("cart")?.value ?? "[]");

      const result: CartItem[] = [];
      for (let i = 0; i < localCart.length; i++) {
        const meal = await Meal.findById(localCart[i].meal.toString());
        result.push({ meal: meal, quantity: localCart[i].quantity });
      }
      const userCart = result.map((cartItem: any) => ({
        meal: {
          _id: cartItem.meal._id.toString(),
          title: cartItem.meal.title,
          description: cartItem.meal.description,
          price: cartItem.meal.price,
          imageUrl: cartItem.meal.imageUrl,
        },
        quantity: cartItem.quantity,
      }));

      return userCart;
    }
  } catch (err: any) {
    throw new Error("Error fetching Cart!");
  }
}

export async function addMealToCart(mealId: string): Promise<void> {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user) {
      const userId = session?.user.id;
      await connectToDB();
      const user = await User.findById(userId);

      const existingCartItemIndex = user.cart.findIndex(
        (item: { meal: string; quantity: number }) =>
          item.meal.toString() === mealId
      );

      if (existingCartItemIndex !== -1) {
        user.cart[existingCartItemIndex].quantity += 1;
      } else {
        user.cart.push({ meal: mealId, quantity: 1 });
      }
      await user.save();
    } else {
      const cookieStore = cookies();
      let localCart: { meal: string; quantity: number }[] = [];
      localCart = JSON.parse(cookieStore.get("cart")?.value ?? "[]");

      const mealIdx = localCart.findIndex(
        (item: { meal: string; quantity: number }) =>
          item.meal.toString() === mealId
      );
      if (mealIdx !== -1) {
        localCart[mealIdx].quantity += 1;
      } else {
        localCart.push({ meal: mealId, quantity: 1 });
      }
      cookieStore.set("cart", JSON.stringify(localCart), {
        maxAge: 3600 * 24 * 90,
      });
    }
    revalidatePath("/cart");
  } catch (err: any) {
    throw new Error("Error!");
  }
}

export async function decreaseMealQty(mealId: string): Promise<void> {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user) {
      const userId = session?.user.id;
      await connectToDB();
      const user = await User.findById(userId);

      const existingCartItemIndex = user.cart.findIndex(
        (item: { meal: string; quantity: number }) =>
          item.meal.toString() === mealId
      );

      if (existingCartItemIndex !== -1) {
        if (user.cart[existingCartItemIndex].quantity === 1) {
          await removeMealFromCart(mealId);
        } else {
          user.cart[existingCartItemIndex].quantity -= 1;
          await user.save();
        }
      }
    } else {
      const cookieStore = cookies();
      let localCart: { meal: string; quantity: number }[] = [];
      localCart = JSON.parse(cookieStore.get("cart")?.value ?? "[]");

      const mealIdx = localCart.findIndex(
        (item: { meal: string; quantity: number }) =>
          item.meal.toString() === mealId
      );
      if (mealIdx !== -1) {
        if (localCart[mealIdx].quantity === 1) {
          await removeMealFromCart(mealId);
        } else {
          localCart[mealIdx].quantity -= 1;
          cookieStore.set("cart", JSON.stringify(localCart), {
            maxAge: 3600 * 24 * 90,
          });
        }
      }
    }
    revalidatePath("/cart");
  } catch (err: any) {
    console.error(err);
    throw new Error("Error!");
  }
}

export async function removeMealFromCart(mealId: string): Promise<void> {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user) {
      const userId = session?.user.id;
      await connectToDB();
      const user = await User.findById(userId);

      const existingCartItemIndex = user.cart.findIndex(
        (item: { meal: string; quantity: number }) =>
          item.meal.toString() === mealId
      );

      if (existingCartItemIndex !== -1) {
        user.cart.splice(existingCartItemIndex, 1);
        await user.save();
      } else {
        throw new Error("Item not found!");
      }
    } else {
      const cookieStore = cookies();
      let localCart: { meal: string; quantity: number }[] = [];
      localCart = JSON.parse(cookieStore.get("cart")?.value ?? "[]");

      localCart = localCart.filter(
        (item: { meal: string; quantity: number }) =>
          item.meal.toString() !== mealId
      );
      cookieStore.set("cart", JSON.stringify(localCart), {
        maxAge: 3600 * 24 * 90,
      });
    }
    revalidatePath("/cart");
  } catch (err: any) {
    throw new Error("Error!");
  }
}

export async function mergeCarts(id: string): Promise<void> {
  try {
    await connectToDB();
    const user = await User.findById(id);
    if (!user) {
      return;
    }
    const cookieStore = cookies();
    let localCart: { meal: string; quantity: number }[] = [];
    localCart = JSON.parse(cookieStore.get("cart")?.value ?? "[]");
    localCart.forEach((localCartItem) => {
      const existingCartItemIndex = user.cart.findIndex(
        (dbCartItem: { meal: string; quantity: number }) =>
          dbCartItem.meal.toString() === localCartItem.meal.toString()
      );
      if (existingCartItemIndex === -1) {
        user.cart.push({
          meal: localCartItem.meal,
          quantity: localCartItem.quantity,
        });
      }
    });
    await user.save();
    revalidatePath("/cart");
  } catch (err: any) {
    console.error(
      "Merge carts encountered an error, but the user login will proceed."
    );
  }
}
export async function checkout(): Promise<string> {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Internal Error!");
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  try {
    const session = await getServerSession(authOptions);
    await connectToDB();

    if (!session || !session?.user) {
      redirect("/login");
    }
    const userCart = await fetchCart();
    if (userCart.length === 0) {
      throw new Error("Empty Cart!");
    }

    const lineItems: LineItem[] = userCart.map((cartItem) => {
      const matchingPaymentItem = payment_id.find(
        (paymentItem) => paymentItem.title === cartItem.meal.title
      );

      if (!matchingPaymentItem) {
        throw new Error("Server Error!");
      }

      return {
        price: matchingPaymentItem.p_id,
        quantity: cartItem.quantity,
      };
    });

    if (lineItems.some((item) => item.price === "")) {
      throw new Error("Server Error!");
    }

    const params: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      customer_email: `${session.user.email}`,
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.NEXTAUTH_URL}/payment_success/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/payment_failed/{CHECKOUT_SESSION_ID}`,
    };
    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create(params);
    if (checkoutSession && checkoutSession.url) {
      return checkoutSession.url;
    } else {
      throw new Error("Server Error!");
    }
  } catch (err: any) {
    throw new Error(err.message);
  }
}
