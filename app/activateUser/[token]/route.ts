import User from "@/lib/models/user.model";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  let sucess = false;
  try {
    const token = params.token;
    const user = await User.findOne({
      "verification.code": token,
      isVerified: false,
    });
    if (!user || user.verification.code === "undefined") {
      throw new Error("Invalid Token or user is already varified");
    }
    if (Date.now() - user.verification.createdAt > 24 * 60 * 60 * 1000) {
      throw new Error(
        "Verification link has expired. Click here to resend the verification email."
      );
    }

    user.isVerified = true;
    user.verification.code = "undefined";
    await user.save();
    sucess = true;
  } catch (error: any) {
    throw new Error(`Error Varifing User: ${error}`);
  } finally {
    if (sucess) {
      redirect("/login");
    }
  }
}
