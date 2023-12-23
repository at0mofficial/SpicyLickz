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
  return new Promise(async (resolve, reject) => {
    try {
      await connectToDB();
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        reject(new Error("Account already registered. Please login."));
        return;
      }
      if (!password) {
        reject(new Error("Password is required"));
        return;
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

      if (!newUser) {
        reject(new Error("Error creating user."));
        return;
      }
      await sendVerificationEmail({
        userEmail: newUser.email,
        userName: newUser.name,
        verificationLink: verificationLink,
      });
      resolve();
    } catch (err: any) {
      console.error(`${err}`);
      reject(new Error(`Error registering user! Please try again later.`));
    }
  });
}
export async function activateUser(token: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      await connectToDB();
      const user = await User.findOne({
        "verification.code": token,
        isVerified: false,
      });
      if (!user || user.verification.code === "undefined") {
        reject(new Error("Invalid Token or user is already varified"));
        return;
      }
      if (
        Date.now() - new Date(user.verification.createdAt).getTime() >
        24 * 60 * 60 * 1000
      ) {
        reject(new Error("Link Expired!"));
        return;
      }
      user.isVerified = true;
      user.verification.code = undefined;
      try {
        await user.save();
      } catch (err: any) {
        reject(new Error(err));
        return;
      }
      resolve();
    } catch (err: any) {
      reject(err);
    }
  });
}

export async function resendVerificationLink(token: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      await connectToDB();
      const user = await User.findOne({
        "verification.code": token,
        isVerified: false,
      });
      if (!user || user.verification.code === "undefined") {
        reject(new Error("Invalid request!"));
        return;
      }
      if (
        Date.now() - new Date(user.verification.createdAt).getTime() >
        24 * 60 * 60 * 1000
      ) {
        const newVerificationCode = await generateVerificationCode();
        const verificationLink = `http://localhost:3000/activateUser/${newVerificationCode}`;

        user.verification.code = newVerificationCode;
        user.verification.createdAt = Date.now();
        try {
          await user.save();
        } catch (err: any) {
          console.error(err);
          reject("Error generating link!");
          return;
        }
        await sendVerificationEmail({
          userEmail: user.email,
          userName: user.name,
          verificationLink: verificationLink,
        });
        resolve();
      }
    } catch (err: any) {
      reject(err);
    }
  });
}

export async function fetchUserAddress(): Promise<UserAddress> {
  return new Promise(async (resolve, reject) => {
    try {
      const session = await getServerSession(authOptions);
      const userId = session?.user.id;
      await connectToDB();
      const user = await User.findById(userId);

      if (!user) {
        console.error("Error fetching user cart: User not found!");
        reject(new Error("Error getting user Cart!"));
        return;
      }
      const streetAddress = user.address.streetAddress;
      const aptNo = user.address.aptNo;
      const city = user.address.city;
      const zipCode = user.address.zipCode;

      resolve({ streetAddress, city, zipCode, aptNo });
    } catch (err: any) {
      console.error("Error fetching user cart:", err);
      reject(err.message);
    }
  });
}

export async function updateUserAddress(
  newAddress: UserAddress
): Promise<UserAddress> {
  return new Promise(async (resolve, reject) => {
    try {
      const session = await getServerSession(authOptions);
      const userId = session?.user.id;
      await connectToDB();

      const user = await User.findById(userId);
      if (!user) {
        console.error("Error updating user address: User not found!");
        reject(new Error("Error updating user address!"));
        return;
      }

      user.address = {
        streetAddress: newAddress.streetAddress,
        aptNo: newAddress.aptNo,
        city: newAddress.city,
        zipCode: newAddress.zipCode,
      };

      try {
        await user.save();
      } catch (err: any) {
        reject(new Error(err));
        return;
      }

      console.log("User address updated successfully!");
      resolve(user.address);
    } catch (err: any) {
      console.error("Error updating user address:", err);
      reject("Error updating user address!");
    }
  });
}

export async function fetchCart(): Promise<CartItem[]> {
  return new Promise(async (resolve, reject) => {
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

        resolve(userCart);
      } else {
        const cookieStore = cookies();
        let localCart: { meal: string; quantity: number }[] = [];
        try {
          localCart = JSON.parse(cookieStore.get("cart")?.value ?? "[]");
        } catch (err: any) {
          console.error("Failed to fetch local cart");
        }

        const result: CartItem[] = [];
        for (let i = 0; i < localCart.length; i++) {
          try {
            const meal = await Meal.findById(localCart[i].meal.toString());
            result.push({ meal: meal, quantity: localCart[i].quantity });
          } catch (err: any) {
            console.error(
              `Failed to fetch meal ${localCart[i].meal.toString()}`
            );
          }
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

        resolve(userCart);
      }
    } catch (err: any) {
      console.error(err);
      reject(new Error("Error fetching Cart!"));
    }
  });
}

export async function addMealToCart(mealId: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
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

        try {
          await user.save();
        } catch (err: any) {
          reject(new Error(err));
          return;
        }
      } else {
        const cookieStore = cookies();
        let localCart: { meal: string; quantity: number }[] = [];
        try {
          localCart = JSON.parse(cookieStore.get("cart")?.value ?? "[]");
        } catch (err: any) {
          console.log("ERROR: Failed to fetch local cart");
        }

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

      console.log("Meal added to the database cart successfully!");
      revalidatePath("/cart");
      resolve();
    } catch (err: any) {
      console.error(err);
      reject(new Error("Error!"));
    }
  });
}

export async function decreaseMealQty(mealId: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
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
            try {
              await user.save();
            } catch (err: any) {
              reject(new Error(err));
              return;
            }
          }
        }
      } else {
        const cookieStore = cookies();
        let localCart: { meal: string; quantity: number }[] = [];
        try {
          localCart = JSON.parse(cookieStore.get("cart")?.value ?? "[]");
        } catch (err: any) {
          console.log("ERROR: Failed to fetch local cart");
        }

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

      console.log("Decreased meal Qty!");
      revalidatePath("/cart");
      resolve();
    } catch (err: any) {
      console.error(err);
      reject(new Error("Error!"));
    }
  });
}

export async function removeMealFromCart(mealId: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
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
          try {
            await user.save();
          } catch (err: any) {
            reject(new Error(err));
            return;
          }
        } else {
          console.error("Item not found in the database cart.");
          reject(new Error("Item not found!"));
        }
      } else {
        const cookieStore = cookies();
        let localCart: { meal: string; quantity: number }[] = [];
        try {
          localCart = JSON.parse(cookieStore.get("cart")?.value ?? "[]");
        } catch (err: any) {
          console.log("ERROR: Failed to fetch local cart");
        }

        localCart = localCart.filter(
          (item: { meal: string; quantity: number }) =>
            item.meal.toString() !== mealId
        );
        cookieStore.set("cart", JSON.stringify(localCart), {
          maxAge: 3600 * 24 * 90,
        });
      }

      console.log("Item Removed!");
      revalidatePath("/cart");
      resolve();
    } catch (err: any) {
      console.error(err);
      reject(new Error("Error!"));
    }
  });
}

export async function mergeCarts(id: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      await connectToDB();
      const user = await User.findById(id);

      if (!user) {
        console.error("Error merging carts: User not found!");
        return;
      }

      const cookieStore = cookies();
      let localCart: { meal: string; quantity: number }[] = [];
      try {
        localCart = JSON.parse(cookieStore.get("cart")?.value ?? "[]");
      } catch (err: any) {
        console.log("ERROR: Failed to fetch local cart");
      }

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
      try {
        await user.save();
      } catch (err: any) {
        reject(new Error(err));
        return;
      }
      revalidatePath("/cart");
      console.log("Carts merged successfully!");
      resolve();
    } catch (err: any) {
      console.error(err);
      console.error(
        "Merge carts encountered an error, but the user login will proceed."
      );
    }
  });
}
export async function resetCart(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const session = await getServerSession(authOptions);
      await connectToDB();

      if (session?.user) {
        const userId = session?.user.id;
        await User.updateOne({ _id: userId }, { $set: { cart: [] } });
        revalidatePath("/cart");
        resolve();
      } else {
        console.error("error resetting cart!");
      }
    } catch (err: any) {
      console.error(err);
    }
  });
}
export async function checkout(): Promise<string> {
  return new Promise(async (resolve, reject) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("Missing secret key!");
      reject(new Error("Internal Error!"));
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
        reject(new Error("Empty Cart!"));
        return;
      }

      const lineItems: LineItem[] = userCart.map((cartItem) => {
        const matchingPaymentItem = payment_id.find(
          (paymentItem) => paymentItem.title === cartItem.meal.title
        );

        if (!matchingPaymentItem) {
          console.error(`No payment_id found for meal: ${cartItem.meal.title}`);
          reject(new Error("Server Error!"));
          return { price: "", quantity: cartItem.quantity };
        }

        return {
          price: matchingPaymentItem.p_id,
          quantity: cartItem.quantity,
        };
      });

      if (lineItems.some((item) => item.price === "")) {
        console.error("Payment_id missing!");
        reject(new Error("Server Error!"));
        return;
      }

      const params: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ["card"],
        customer_email: `${session.user.email}`,
        mode: "payment",
        line_items: lineItems,
        success_url: `http://localhost:3000/payment_success/{CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:3000/payment_failed/{CHECKOUT_SESSION_ID}`,
      };
      const checkoutSession: Stripe.Checkout.Session =
        await stripe.checkout.sessions.create(params);
      if (checkoutSession && checkoutSession.url) {
        resolve(checkoutSession.url);
      } else {
        reject(new Error("Server Error!"));
      }
    } catch (err: any) {
      console.error(err);
      reject(err.message);
    }
  });
}
