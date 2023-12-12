"use server";

import { getServerSession } from "next-auth";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { sendVerificationEmail } from "../sendGridMail";
import { generateVerificationCode, hashPassword } from "../utils";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Meal from "../models/meal.model";
import { revalidatePath } from "next/cache";

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

      resolve({streetAddress, city, zipCode, aptNo});
    } catch (err: any) {
      console.error("Error fetching user cart:", err);
      reject(err.message);
    }
  });
}
export async function fetchUserCart(): Promise<CartItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const session = await getServerSession(authOptions);
      const userId = session?.user.id;
      await connectToDB();
      const user = await User.findById(userId).populate({
        path: "cart.meal",
        model: Meal,
        select: ["_id", "title", "description", "price", "imageUrl"],
      });

      if (!user) {
        console.error("Error fetching user cart: User not found!");
        reject(new Error("Error getting user Cart!"));
        return;
      }

      resolve(user.cart);
    } catch (err: any) {
      console.error("Error fetching user cart:", err);
      reject(err.message);
    }
  });
}

export async function addMealToDBCart(mealId: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const session = await getServerSession(authOptions);
      const userId = session?.user.id;
      await connectToDB();
      const user = await User.findById(userId);

      if (!user) {
        console.error("Error adding meal to cart: User not found!");
        reject(new Error("Error!"));
        return;
      }

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
      console.log("Meal added to the database cart successfully!");
      revalidatePath("/cart");
      resolve();
    } catch (err: any) {
      console.error(err);
      reject(new Error("Error!"));
    }
  });
}

export async function increaseDBMealQty(
  mealId: string,
  path: string
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const session = await getServerSession(authOptions);
      const userId = session?.user.id;
      await connectToDB();
      const user = await User.findById(userId);

      if (!user) {
        console.error("Error changing Qty: User not found!");
        reject(new Error("Error!"));
        return;
      }

      const existingCartItemIndex = user.cart.findIndex(
        (item: { meal: string; quantity: number }) =>
          item.meal.toString() === mealId
      );

      if (existingCartItemIndex !== -1) {
        user.cart[existingCartItemIndex].quantity += 1;
        try {
          await user.save();
        } catch (err: any) {
          reject(new Error(err));
          return;
        }
        console.log("Increased meal Qty!");
        revalidatePath(path);
        resolve();
        return;
      } else {
        console.error("Meal not found in the database cart.");
        reject(new Error("Meal not found!"));
      }
    } catch (err: any) {
      console.error(err);
      throw new Error(err.message);
    }
  });
}
export async function decreaseDBMealQty(
  mealId: string,
  path: string
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const session = await getServerSession(authOptions);
      const userId = session?.user.id;
      await connectToDB();
      const user = await User.findById(userId);

      if (!user) {
        console.error("Error changing Qty: User not found!");
        reject(new Error("Error!"));
        return;
      }

      const existingCartItemIndex = user.cart.findIndex(
        (item: { meal: string; quantity: number }) =>
          item.meal.toString() === mealId
      );

      if (existingCartItemIndex !== -1) {
        const currentQuantity = user.cart[existingCartItemIndex].quantity;
        if (currentQuantity > 1) {
          user.cart[existingCartItemIndex].quantity -= 1;
          try {
            await user.save();
          } catch (err: any) {
            reject(new Error(err));
            return;
          }
          console.log("Decreased meal Qty!");
          revalidatePath(path);
          resolve();
          return;
        } else {
          user.cart.splice(existingCartItemIndex, 1);
          try {
            await user.save();
          } catch (err: any) {
            reject(new Error(err));
            return;
          }
          console.log("Item Removed!");
          revalidatePath(path);
          resolve();
          return;
        }
      } else {
        console.error("Meal not found in the database cart.");
        reject(new Error("Meal not found!"));
      }
    } catch (err: any) {
      console.error(err);
      throw new Error(err.message);
    }
  });
}

export async function deleteItemFromDBCart(
  mealId: string,
  path: string
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const session = await getServerSession(authOptions);
      const userId = session?.user.id;
      await connectToDB();
      const user = await User.findById(userId);

      if (!user) {
        console.error("Error deleting item from cart: User not found!");
        reject(new Error("Error!"));
        return;
      }

      const existingCartItemIndex = user.cart.findIndex(
        (item: { meal: string; quantity: number }) =>
          item.meal.toString() === mealId
      );

      if (existingCartItemIndex !== -1) {
        user.cart.splice(existingCartItemIndex, 1); // Remove the item from the cart array
        try {
          await user.save();
        } catch (err: any) {
          reject(new Error(err));
          return;
        }
        console.log("Item removed from the database cart successfully!");
        revalidatePath(path);
        resolve();
      } else {
        console.error("Item not found in the database cart.");
        reject(new Error("Item not found!"));
      }
    } catch (err: any) {
      console.error(err);
      reject(new Error("Error!"));
    }
  });
}

export async function mergeLocalAndDBCart(
  localStorageCartString: string
): Promise<void> {
  const session = await getServerSession(authOptions);
  console.log(session);
  if (!session || !session.user) return;
  const userEmail = session.user.email as string;
  return new Promise(async (resolve, reject) => {
    try {
      await connectToDB();
      const user = await User.findOne({ email: userEmail });

      if (!user) {
        console.error("Error merging carts: User not found!");
        return;
      }

      const localCart = JSON.parse(localStorageCartString);

      localCart.forEach((localCartItem: { meal: string; quantity: number }) => {
        const existingCartItemIndex = user.cart.findIndex(
          (dbCartItem: { meal: string; quantity: number }) =>
            dbCartItem.meal === localCartItem.meal
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

export async function updateUserAddress(newAddress: UserAddress): Promise<void> {
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
      revalidatePath('/userProfile');
      resolve();
    } catch (err: any) {
      console.error("Error updating user address:", err);
      reject('Error updating user address!');
    }
  });
}
