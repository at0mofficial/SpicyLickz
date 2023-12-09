"use client";
import { mergeLocalAndDBCart } from "@/lib/actions/user.actions";
import { resendVerificationEmail } from "@/lib/sendGridMail";
import { testEmail } from "@/lib/utils";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

const Login = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailBorder, setEmailBorder] = useState("border-[#cccccc]");
  const [passwordBorder, setPasswordBorder] = useState("border-[#cccccc]");
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
          const localStorageCartString = localStorage.getItem("cart");
          if (localStorageCartString) {
            await mergeLocalAndDBCart(localStorageCartString);
            localStorage.removeItem("cart");
          }
          if (callbackUrl && callbackUrl !== "/signup") {
            router.push(callbackUrl);
          } else {
            router.push("/menu");
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
    try {
      await resendVerificationEmail(email);
      toast.success("Email sent!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };
    return (
      <section className="flex justify-center mt-[60px] mb-[100px]">
        <div className="flex flex-col items-center justify-start gap-[60px] lg:w-[800px] lg:rounded-md lg:shadow-2xl w-full md:px-[40px] lg:px-[100px] md:pt-[60px] md:pb-[100px]">
          <div className="flex flex-col items-center gap-3 justify-center">
          <Image src="login_logo.svg" alt="Login Logo" width={130} height={130} />
              <h3 className="text-2xl text-center text-dark uppercase font-semibold">
                Login
              </h3>
          </div>
  
          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-4 text-left px-5 md:px-14 w-full"
          >
            <div className="flex flex-col text-left">
              <label htmlFor="email" className="font-medium px-2 text-dark">
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
                className={`${emailBorder} placeholder:text-sm placeholder:font-normal bg-[#f1f1f1] text-gray outline-none px-5 py-2 w-[95%] max-w-[95%] rounded-xl border`}
              />
              {emailError && (
                <span className="text-red-500 text-sm mt-1 w-[95%] max-w-[95%]">
                  {emailError}
                </span>
              )}
            </div>
            <div className="flex flex-col text-left">
              <label htmlFor="password" className="font-medium px-2 text-dark">
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
                className={`${passwordBorder} placeholder:text-sm placeholder:font-normal bg-[#f1f1f1] text-gray outline-none px-5 py-2 w-[95%] max-w-[95%] rounded-xl border`}
              />
              {passwordError && (
                <span className="text-red-500 text-sm mt-1 w-[95%] max-w-[95%]">
                  {passwordError}
                </span>
              )}
            </div>
  
            <button
              type="submit"
              disabled={!isFormValid}
              className={`ml-[-4px] px-8 py-4 text-sm w-fit shadow-xl text-[#f1f1f1] rounded-3xl font-semibold ${
                isFormValid
                  ? "bg-dark"
                  : "bg-gray"
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
