"use server"
import sgMail from "@sendgrid/mail";
import { connectToDB } from "./mongoose";
import User from "./models/user.model";
import { generateVerificationCode } from "./utils";
sgMail.setApiKey(`${process.env.SENDGRID_API_KEY}`);

export async function sendVerificationEmail({
  userEmail,
  userName,
  verificationLink,
}: {
  userEmail: string;
  userName: string;
  verificationLink: string;
}) {
  return new Promise<void>((resolve, reject) => {
    const msg = {
      from: {
        email: "sangwanshivam762001@gmail.com",
        name: "SpicyLickz",
      },
      personalizations: [
        {
          to: [
            {
              email: userEmail,
            },
          ],
          dynamic_template_data: {
            name: userName,
            verificationLink: verificationLink,
          },
        },
      ],
      template_id: "d-7d3e722b355f417c8449b4fd73adafa6",
    };

    (sgMail as any)
      .send(msg)
      .then(() => {
        resolve();
      })
      .catch((error: any) => {
        console.error(error);
        reject(error);
      });
  });
}
export async function resendVerificationEmail(userEmail: string) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await connectToDB();
      const existingUser = await User.findOne({ email: userEmail });
      if (!existingUser) {
        reject("We encountered an error. Please try again later!");
        return;
      }
      const verificationCode = await generateVerificationCode();
      const verificationLink = `http://localhost:3000/activateUser/${verificationCode}`;
      existingUser.verification.code = verificationCode;
      existingUser.verification.createdAt = Date.now();
      try {
        await existingUser.save();
      } catch (err: any) {
        console.error(err);
        reject("Error generating link!");
        return;
      }
      await sendVerificationEmail({
        userEmail: userEmail,
        userName: existingUser.name,
        verificationLink: verificationLink,
      });
      resolve();
    } catch (err: any) {
      reject(err);
    }
  });
}
