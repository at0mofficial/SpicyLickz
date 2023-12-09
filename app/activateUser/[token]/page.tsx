"use client";
import {
  activateUser,
  resendVerificationLink,
} from "@/lib/actions/user.actions";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

export default function ActivateUser({
  params,
}: {
  params: { token: string };
}) {
  const [isVerified, setIsVerified] = useState(false);
  const [linkExpired, setLinkExpired] = useState(false);
  const [invalidToken, setInvalidToken] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        await activateUser(params.token);
        setIsVerified(true);
      } catch (err: any) {
        if (err.message === "Link Expired!") {
          setLinkExpired(true);
        } else {
          setInvalidToken(true);
        }
      }
    };

    verifyUser();
  }, [params.token]);

  const resendVerificationEmail = async () => {
    try {
      await resendVerificationLink(params.token);
      toast.success("Email Sent!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (isVerified) {
    return (
      <div className="flex-col justify-center items-center lg:text-center text-dark lg:p-[100px] px-10 py-[80px]">
        <h2 className="mb-12 text-4xl font-semibold text-primary">
          Verification Successful!
        </h2>
        <p className="text-xl mb-8">
          Congratulations! Your email has been successfully verified. You can
          now log in to your account.
        </p>
        <Link
          href="/login"
          className="uppercase tracking-[1px] px-5 py-2.5 mt-1 border-2 border-primary transition-all ease-in-out duration-100 hover:bg-primary text-dark hover:text-white font-semibold text-lg"
        >
          Go to Log in page
        </Link>
      </div>
    );
  } else if (linkExpired) {
    return (
      <div className="flex justify-center items-center p-[100px]">
        <div className="text-dark text-center">
          <span className="text-7xl font-semibold text-primary">
            Link Expired!
          </span>
          <h2 className="p-4 text-3xl">Oops! </h2>
          <p className="mb-1 text-lg text-gray-600">
            It looks like the link you are trying to use has already expired.
            Please click on the "Generate Link" button below to create a new
            verification link.
          </p>
          <button
            onClick={resendVerificationEmail}
            className="uppercase tracking-[1px] px-5 py-2.5 mt-1 border-2 border-primary transition-all ease-in-out duration-100 hover:bg-primary text-dark hover:text-white font-semibold text-lg"
          >
            Generate Link
          </button>
        </div>
      </div>
    );
  } else if (invalidToken) {
    return (
      <div className="flex justify-center items-center p-[100px]">
        <div className="text-dark text-center">
          <span className="text-7xl font-semibold text-primary">500</span>
          <h2 className="p-4 text-3xl">
            There was an error processing your request.
          </h2>
          <p className="mb-1 text-lg text-gray-600">
            Invalid Token or user is already varified!
          </p>
          <p className="mb-6 text-lg text-gray-600">
            Try{" "}
            <Link href="/login" className="text-primary underline">
              logging in.
            </Link>
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-center p-[100px]">
        <ClipLoader color="#ff2f00" size={50} speedMultiplier={2} />
      </div>
    );
  }
}
