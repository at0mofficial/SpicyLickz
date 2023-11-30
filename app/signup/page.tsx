"use client";
import { registerUser } from "@/lib/actions/user.actions";
import { testEmail, testFullName, testPassword } from "@/lib/utils";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [fullNameError, setFullNameError] = useState("empty");
  const [emailError, setEmailError] = useState("empty");
  const [passwordError, setPasswordError] = useState("empty");
  const [confirmPasswordError, setConfirmPasswordError] = useState("empty");
  
  const [fullNameBorder, setFullNameBorder] = useState("border-dark");
  const [emailBorder, setEmailBorder] = useState("border-dark");
  const [passwordBorder, setPasswordBorder] = useState("border-dark");
  const [confirmPasswordBorder, setConfirmPasswordBorder] =
  useState("border-dark");
  
  const [isRegisterd, setIsRegistered] = useState(false);

  const isFormValid = !(
    emailError ||
    passwordError ||
    confirmPasswordError ||
    fullNameError
  );

  const handleFullNameChange = (e: any) => {
    setFullName(e.target.value);
    if (!e.target.value.trim()) {
      setFullNameBorder("border-red-500");
    } else if (!testFullName(e.target.value)) {
      setFullNameBorder("border-red-500");
    } else if (e.target.value.length < 3 || e.target.value.length > 25) {
      setFullNameBorder("border-red-500");
    } else {
      setFullNameBorder("border-green-500");
      setEmailError("");
    }
  };
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
    if (!testPassword(e.target.value)) {
      setPasswordBorder("border-red-500");
    } else {
      setPasswordBorder("border-green-500");
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e: any) => {
    setConfirmPassword(e.target.value);
    if (password.length > 0 && passwordError.length == 0) {
      if (e.target.value !== password) {
        setConfirmPasswordBorder("border-red-500");
      } else {
        setConfirmPasswordBorder("border-green-500");
        setConfirmPasswordError("");
      }
    }
  };

  const validateFullName = () => {
    if (!fullName.trim()) {
      setFullNameError("Name cannot be empty");
      setFullNameBorder("border-red-500");
    } else if (!testFullName(fullName)) {
      setFullNameError("Special characters not allowed!");
      setFullNameBorder("border-red-500");
    } else if (fullName.length < 3) {
      setFullNameError("Name should be at least 3 characters!");
      setFullNameBorder("border-red-500");
    } else if (fullName.length > 25) {
      setFullNameError("Max 25 characters allowed!");
      setFullNameBorder("border-red-500");
    } else {
      setFullNameBorder("border-green-500");
      setFullNameError("");
    }
  };
  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError("Email cannot be empty");
      setEmailBorder("border-red-500");
    } else {
      if (!testEmail(email)) {
        setEmailError("Please enter a valid email address");
        setEmailBorder("border-red-500");
      } else {
        setEmailError("");
        setEmailBorder("border-green-500");
      }
    }
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError("Password cannot be empty");
      setPasswordBorder("border-red-500");
    } else if (!testPassword(password)) {
      setPasswordError(
        "Password must be 8-16 characters long and contain at least 1 uppercase letter, 1 lowercase letter, a special character, and a number"
      );
      setPasswordBorder("border-red-500");
    } else {
      setPasswordError("");
      setPasswordBorder("border-green-500");
    }
  };

  const validateConfirmPassword = () => {
    if (password.length > 0 && passwordError.length == 0) {
      if (confirmPassword !== password) {
        setConfirmPasswordError("Passwords do not match");
        setConfirmPasswordBorder("border-red-500");
      } else {
        setConfirmPasswordError("");
        setConfirmPasswordBorder("border-green-500");
      }
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    validateFullName();
    validateEmail();
    validatePassword();
    validateConfirmPassword();
    const trimmedEmail = email.trim();
    const cleanedFullName = fullName.trim().replace(/\s+/g, " ");

    if (isFormValid) {
      try {
       await registerUser({
          email: trimmedEmail,
          password: password,
          fullName: cleanedFullName,
        });
        setIsRegistered(true);
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  };
  if(isRegisterd){
    return (
      <div className="flex-col justify-center items-center lg:text-center text-dark lg:p-[100px] px-10 py-[80px]">
        <h2 className="mb-12 text-4xl font-semibold text-primary">Registration Successful!</h2>
        <p className="text-xl mb-8">
          Thank you for registering! An email verification has been sent to your email address.
          Please check your spam folder if you don't see the email in your inbox.
          Verify your email before logging in.
        </p>
        <Link href='/login'
          className="uppercase tracking-[1px] px-5 py-2.5 mt-1 border-2 border-primary transition-all ease-in-out duration-100 hover:bg-primary text-dark hover:text-white font-semibold text-lg"
        >
          Go to Log in page
        </Link>
    </div>)
  }
  else{
    return (
      <section className="flex flex-col justify-center items-center h-full py-[100px] login-background bg-cover bg-fixed bg-center">
        <main className="flex flex-col items-center text-center bg-white text-dark px-8 py-8 md:py-[50px] lg:py-[60px] md:w-[90%] w-[90%] max-w-[800px] gap-14 rounded-lg">
          <div className="flex flex-col items-center justify-center gap-2">
            <Image src="login_logo.svg" alt="Login Logo" width={90} height={80} />
            <h3 className="uppercase text-xl font-semibold mt-[-4px]">
              Create an Account
            </h3>
          </div>
  
          <form
            onSubmit={handleSignup}
            className="flex flex-col items-start  justify-center grow gap-8"
          >
            <div className="relative flex flex-col text-left">
              <label htmlFor="name" className="font-semibold">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="example@email.com"
                value={fullName}
                onChange={handleFullNameChange}
                onBlur={validateFullName}
                className={`${fullNameBorder} placeholder:text-sm placeholder:font-normal bg-transparent font-semibold outline-none max-sm:w-[95%] max-w-[215px] border-b-2`}
              />
              {fullNameError && fullNameError !== "empty" && (
                <span className="text-red-500 text-sm mt-1 max-sm:w-[95%] max-w-[215px]">
                  {fullNameError}
                </span>
              )}
            </div>
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
              {emailError && emailError !== "empty" && (
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
                onBlur={() => {
                  validatePassword();
                  if (confirmPassword.length > 0) {
                    validateConfirmPassword();
                  }
                }}
                className={`${passwordBorder} placeholder:text-sm placeholder:font-normal bg-transparent font-semibold outline-none max-sm:w-[95%] max-w-[215px] border-b-2`}
              />
              {passwordError && passwordError !== "empty" && (
                <span className="text-red-500 text-sm mt-1 max-sm:w-[95%] max-w-[215px]">
                  {passwordError}
                </span>
              )}
            </div>
            <div className="flex flex-col text-left">
              <label htmlFor="confirmpassword" className="font-semibold">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmpassword"
                id="confirmpassword"
                placeholder="abcd@123"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                onBlur={validateConfirmPassword}
                className={`${confirmPasswordBorder} placeholder:text-sm placeholder:font-normal bg-transparent font-semibold outline-none max-sm:w-[95%] max-w-[215px] border-b-2`}
              />
              {confirmPasswordError && confirmPasswordError !== "empty" && (
                <span className="text-red-500 text-sm mt-1 max-sm:w-[95%] max-w-[215px]">
                  {confirmPasswordError}
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
              Register
              <Image
                src="/arrow_right.svg"
                alt="login"
                width={12}
                height={12}
                className="hidden-image hidden transition-all duration-1000"
              />
            </button>
          </form>
          <span className="md:flex-row md:gap-1 items-center flex flex-col text-sm font-semibold">
            Already have an account?
            <button onClick={()=>{signIn()}} className="font-bold hoverEffect2">
              LogIn
            </button>
          </span>
        </main>
      </section>
    );
  }

};

export default Signup;
