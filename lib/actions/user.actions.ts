"use server";

import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { sendVerificationEmail } from "../sendGridMail";
import { generateVerificationCode, hashPassword } from "../utils";

export async function registerUser({
  email,
  password,
  fullName
}: {
  email: string;
  password: string;
  fullName: string;
}) {
  try {
    await connectToDB();
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      throw new Error("User already exists. Please login.");
    }
    const hashedPassword = await hashPassword(password);
    const verificationCode = await generateVerificationCode();
    const verificationLink =`http://localhost:3000/activateUser/${verificationCode}`;

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
      verificationLink: verificationLink
    });

  } catch (err: any) {
    throw new Error(`Error registering user: ${err.message}`);
  }
}

export async function loginUser() {
  //if user does not exist ask to register Shivam@762001
  //else check if user is varified
  //if not varified "click here to varify email and send email to varify"
  //if user is varified, compare passwords and let them login, display user information
  //before login check if there is any local Car
  // if local cart has items, merge the carts and then redirect user back to previous url
}
