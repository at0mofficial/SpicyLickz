"use server";

import { getServerSession } from "next-auth";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { sendVerificationEmail } from "../sendGridMail";
import { generateVerificationCode, hashPassword } from "../utils";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
      await user.save();
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

export async function addMealToDBCart(
  userId: string,
  mealId: string
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
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

      await user.save();
      console.log("Meal added to the database cart successfully!");
      resolve();
    } catch (err: any) {
      console.error(err);
      reject(new Error("Add to cart Failed!"));
    }
  });
}

export async function increaseDBMealQty(
  userId: string,
  mealId: string
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
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
        await user.save();
        console.log("Increased meal Qty!");
        resolve();
        return;
      } else {
        console.error("Meal not found in the database cart.");
        reject(new Error("Meal not found!"));
      }
    } catch (err: any) {
      console.error(err);
      throw new Error("Failed!");
    }
  });
}
export async function decreaseDBMealQty(
  userId: string,
  mealId: string
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
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
          await user.save();
          console.log("Decreased meal Qty!");
          resolve();
          return;
        } else {
          user.cart.splice(existingCartItemIndex, 1);
          await user.save();
          console.log("Item Removed!");
          resolve();
          return;
        }
      } else {
        console.error("Meal not found in the database cart.");
        reject(new Error("Meal not found!"));
      }
    } catch (err: any) {
      console.error(err);
      throw new Error("Failed!");
    }
  });
}

export async function mergeLocalAndDBCart(localStorageCartString:string): Promise<void> {
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
      await user.save();
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
