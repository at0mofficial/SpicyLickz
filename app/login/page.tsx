"use client";
import { resendVerificationEmail } from "@/lib/sendGridMail";
import { testEmail } from "@/lib/utils";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailBorder, setEmailBorder] = useState("border-dark");
  const [passwordBorder, setPasswordBorder] = useState("border-dark");
  const isFormValid = !(emailError || passwordError);
  const [loginError, setLoginError] = useState("");

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
    if (!testEmail(e.target.value)) {
      setEmailBorder("border-red-500");
    } else {
      setEmailBorder("border-green-500");
      setEmailError("");
    }
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
    if (!e.target.value) {
      setPasswordBorder("border-red-500");
    } else {
      setPasswordBorder("border-green-500");
      setPasswordError("");
    }
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError("Email cannot be empty");
      setEmailBorder("border-red-500");
    } else if (!testEmail(email.trim())) {
      setEmailError("Email format should be valid!");
      setEmailBorder("border-red-500");
    } else {
      setEmailBorder("border-green-500");
      setEmailError("");
    }
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError("Password cannot be empty");
      setPasswordBorder("border-red-500");
    } else {
      setPasswordBorder("border-green-500");
      setPasswordError("");
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    validateEmail();
    validatePassword();

    if (isFormValid) {
      try {
        const res = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (!res?.error) {
          if (callbackUrl && callbackUrl !== "/signup") {
            router.push(callbackUrl);
          } else {
            router.push("/on-the-menu");
          }
        } else {
          if (res?.error === "Email not verified!") {
            setLoginError(res.error);
          } else {
            toast.error(res.error);
          }
        }
      } catch (err: any) {
        console.error(err);
      }
    }
  };

  const handleEmailVerification = async () => {
    try{
      await resendVerificationEmail(email);
      toast.success('Email sent!');
    }catch(err:any){
      toast.error(err.message);
    }
  };
  return (
    <section className="flex flex-col justify-center items-center h-full py-[100px] login-background bg-cover bg-fixed bg-center">
      <div className="flex flex-col items-center text-center bg-white text-dark px-8 py-8 md:py-[50px] lg:py-[60px] md:w-[90%] w-[90%] max-w-[800px] gap-14 rounded-lg">
        <div className="flex flex-col items-center justify-center gap-2">
          <Image src="login_logo.svg" alt="Login Logo" width={90} height={80} />
          <h3 className="uppercase text-xl font-semibold mt-[-4px]">
            User LogIn
          </h3>
        </div>

        <form
          onSubmit={handleLogin}
          className="flex flex-col items-start justify-center grow gap-8"
        >
          <div className="relative flex flex-col text-left">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="example@email.com"
              value={email}
              onChange={handleEmailChange}
              onBlur={validateEmail}
              className={`${emailBorder} placeholder:text-sm placeholder:font-normal bg-transparent font-semibold outline-none max-sm:w-[95%] max-w-[215px] border-b-2`}
            />
            {emailError && (
              <span className="text-red-500 text-sm mt-1 max-sm:w-[95%] max-w-[215px]">
                {emailError}
              </span>
            )}
          </div>
          <div className="flex flex-col text-left">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="abcd@123"
              value={password}
              onChange={handlePasswordChange}
              onBlur={validatePassword}
              className={`${passwordBorder} placeholder:text-sm placeholder:font-normal bg-transparent font-semibold outline-none max-sm:w-[95%] max-w-[215px] border-b-2`}
            />
            {passwordError && (
              <span className="text-red-500 text-sm mt-1 max-sm:w-[95%] max-w-[215px]">
                {passwordError}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`flex gap-1 items-center text-lg font-semibold relative ${
              isFormValid
                ? "after:content-[''] after:bg-dark after:bottom-[2px] after:h-[2px] after:w-0 after:rounded-full after:absolute after:left-0 hover:after:w-full after:ease-out after:transition-all after:duration-700 button-with-image"
                : ""
            }`}
          >
            Login
            <Image
              src="/arrow_right.svg"
              alt="login"
              width={12}
              height={12}
              className="hidden-image hidden transition-all duration-1000"
            />
          </button>
        </form>
        {loginError === "Email not verified!" ? (
          <div className="flex flex-col md:gap-1 items-center justify-center">
            <span className="text-red-500 text-sm font-semibold">
              Email not Verified!
            </span>
            <span className="md:flex-row md:gap-1 items-center flex flex-col text-sm font-medium">
              Didn't receive a verification link?
              <div>
                <button
                  onClick={handleEmailVerification}
                  className="font-semibold hoverEffect2"
                >
                  Click here
                </button>{" "}
                to resend.
              </div>
            </span>
          </div>
        ) : (
          <span className="md:flex-row md:gap-1 items-center flex flex-col text-sm font-semibold">
            Already have account?
            <Link href={"/signup"} className="font-bold hoverEffect2">
              SignUp
            </Link>
          </span>
        )}
      </div>
    </section>
  );
};

export default Login;
