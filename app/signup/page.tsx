'use client'
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(true);

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: any) => {
    setConfirmPassword(e.target.value);
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError("Email cannot be empty");
      setIsFormValid(false);
    } else {
      const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailPattern.test(email.trim())) {
        setEmailError("Please enter a valid email address");
        setIsFormValid(false);
      } else {
        setEmailError("");
      }
    }
  };

  const validatePassword = () => {
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    if (!passwordPattern.test(password)) {
      setPasswordError(
        "Password must be 8-16 characters long and contain at least 1 uppercase letter, 1 lowercase letter, a special character, and a number"
      );
      setIsFormValid(false);
    } else if (confirmPassword !== password) {
      setPasswordError("Passwords do not match");
      setIsFormValid(false);
    } else {
      setPasswordError("");
      setIsFormValid(true);
    }
  };

  const handleSignup = () => {
    validateEmail();
    validatePassword();

    if (isFormValid) {
      const trimmedEmail = email.trim();
      function registerUser() {
        const userData = {
          trimmedEmail,
          password,
        };
      }
    }
  };

  return (
    <section className="flex flex-col justify-center items-center h-full py-[100px] login-background bg-cover bg-fixed bg-center">
      <div className="flex flex-col items-center text-center bg-white text-dark px-8 py-8 md:py-[50px] lg:py-[60px] md:w-[90%] w-[90%] max-w-[800px] gap-14 rounded-lg">
        <div className="flex flex-col">
          <Image src="login_logo.svg" alt="Login Logo" width={90} height={80} />
          <h3 className="uppercase text-xl font-semibold mt-[-4px]">
            Register
          </h3>
        </div>

        <div className="flex flex-col items-start  justify-center grow gap-8">
          <div className="relative flex flex-col text-left">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              value={email}
              onChange={handleEmailChange}
              onBlur={validateEmail}
              className={`${
                emailError ? "border-red-600" : ""
              } placeholder:text-sm placeholder:font-normal bg-transparent font-semibold outline-none max-sm:w-[95%] max-w-[215px] border-b-2`}
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
              placeholder="abcd@123"
              value={password}
              onChange={handlePasswordChange}
              onBlur={validatePassword}
              className={`${
                passwordError ? "border-red-600" : ""
              } placeholder:text-sm placeholder:font-normal bg-transparent font-semibold outline-none max-sm:w-[95%] max-w-[215px] border-b-2`}
            />
            {passwordError && (
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
              placeholder="abcd@123"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={validatePassword}
              className={`${
                passwordError === "Passwords do not match."
                  ? "border-red-600"
                  : ""
              } placeholder:text-sm placeholder:font-normal bg-transparent font-semibold outline-none max-sm:w-[95%] max-w-[215px] border-b-2`}
            />
          </div>
          <button
            onClick={handleSignup}
            disabled={!isFormValid}
            className={`flex gap-1 items-center text-lg font-semibold relative ${isFormValid? "after:content-[''] after:bg-dark after:bottom-[2px] after:h-[2px] after:w-0 after:rounded-full after:absolute after:left-0 hover:after:w-full after:ease-out after:transition-all after:duration-700 button-with-image":""}`}
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
        </div>
        <span className="md:flex-row md:gap-1 items-center flex flex-col text-sm font-semibold">
          Already have an account?
          <Link href={"/login"} className="font-bold hoverEffect2">
            LogIn
          </Link>
        </span>
      </div>
    </section>
  );
};

export default Signup;
