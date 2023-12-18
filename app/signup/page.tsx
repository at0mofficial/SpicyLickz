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

  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [fullNameBorder, setFullNameBorder] = useState("border-none");
  const [emailBorder, setEmailBorder] = useState("border-none");
  const [passwordBorder, setPasswordBorder] = useState("border-none");
  const [confirmPasswordBorder, setConfirmPasswordBorder] =
    useState("border-none");

  const [isRegisterd, setIsRegistered] = useState(false);

  const isFormValid = !(
    emailError ||
    passwordError ||
    confirmPasswordError ||
    fullNameError
  );

  const handleInputChange = (field: string, value: string) => {
    // Update the corresponding state and reset the error for the field
    switch (field) {
      case "fullName":
        setFullName(value);
        if (!value.trim()) {
          setFullNameBorder("border-red-500");
        } else if (!testFullName(value)) {
          setFullNameBorder("border-red-500");
        } else if (value.trim().length < 3 || value.trim().length > 25) {
          setFullNameBorder("border-red-500");
        } else {
          setFullNameBorder("border-green-500");
        }
        break;
      case "email":
        setEmail(value);
        if (!testEmail(value)) {
          setEmailBorder("border-red-500");
        } else {
          setEmailBorder("border-green-500");
        }
        break;
      case "password":
        setPassword(value);
        if (!testPassword(value)) {
          setPasswordBorder("border-red-500");
        } else {
          setPasswordBorder("border-green-500");
        }
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        if (password.length > 0 && passwordError.length == 0) {
          if (value !== password) {
            setConfirmPasswordBorder("border-red-500");
          } else {
            setConfirmPasswordBorder("border-green-500");
          }
        }
        break;
      default:
        break;
    }
  };

  const validateField = (field: string, value: string): Boolean => {
    let result = true;
    switch (field) {
      case "fullName":
        if (!fullName.trim()) {
          setFullNameError("Name cannot be empty");
          setFullNameBorder("border-red-500");
          result = false;
        } else if (!testFullName(fullName)) {
          setFullNameError("Special characters not allowed!");
          setFullNameBorder("border-red-500");
          result = false;
        } else if (fullName.trim().length < 3) {
          setFullNameError("Name should be at least 3 characters!");
          setFullNameBorder("border-red-500");
          result = false;
        } else if (fullName.trim().length > 25) {
          setFullNameError("Max 25 characters allowed!");
          setFullNameBorder("border-red-500");
          result = false;
        } else {
          setFullNameBorder("border-green-500");
          setFullNameError("");
        }
        break;
      case "email":
        if (!email.trim()) {
          setEmailError("Email cannot be empty");
          setEmailBorder("border-red-500");
          result = false;
        } else {
          if (!testEmail(email)) {
            setEmailError("Please enter a valid email address");
            setEmailBorder("border-red-500");
            result = false;
          } else {
            setEmailError("");
            setEmailBorder("border-green-500");
          }
        }
        break;
      case "password":
        if (!password) {
          setPasswordError("Password cannot be empty");
          setPasswordBorder("border-red-500");
          result = false;
        } else if (!testPassword(password)) {
          setPasswordError(
            "Password must be 8-16 characters long and contain at least 1 uppercase letter, 1 lowercase letter, a special character, and a number"
          );
          setPasswordBorder("border-red-500");
          result = false;
        } else {
          setPasswordError("");
          setPasswordBorder("border-green-500");
        }
        break;
      case "confirmPassword":
        if (password.length > 0 && passwordError.length == 0) {
          if (confirmPassword !== password) {
            setConfirmPasswordError("Passwords do not match");
            setConfirmPasswordBorder("border-red-500");
            result = false;
          } else {
            setConfirmPasswordError("");
            setConfirmPasswordBorder("border-green-500");
          }
        }
        break;
      default:
        break;
    }
    return result;
  };

  const handleInputBlur = (field: string, value: string) => {
    validateField(field, value);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const val_fn = validateField("fullName", fullName);
    const val_em = validateField("email", email);
    const val_ps = validateField("password", password);
    const val_cps = validateField("confirmPassword", confirmPassword);
    const trimmedEmail = email.trim();
    const cleanedFullName = fullName.trim().replace(/\s+/g, " ");

    if (val_fn && val_em && val_ps && val_cps) {
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

  if (isRegisterd) {
    return (
      <div className="flex-col justify-center items-center lg:text-center text-dark lg:p-[100px] px-10 py-[80px]">
        <h2 className="mb-12 text-4xl font-semibold text-primary">
          Registration Successful!
        </h2>
        <p className="text-xl mb-8">
          Thank you for registering! An email verification has been sent to your
          email address. Please check your spam folder if you don't see the
          email in your inbox. Verify your email before logging in.
        </p>
        <Link
          href="/login"
          className="uppercase tracking-[1px] px-5 py-2.5 mt-1 border-2 border-primary transition-all ease-in-out duration-100 hover:bg-primary text-dark hover:text-white font-semibold text-lg"
        >
          Go to Log in page
        </Link>
      </div>
    );
  } else {
    return (
      <section className="flex justify-center pt-[60px] pb-[100px]">
        <main className="flex flex-col items-center justify-start gap-[60px] lg:w-[760px] w-full md:px-[40px] lg:px-[100px]">
          <div className="flex flex-col items-center gap-3 justify-center">
            <h3 className="text-2xl text-center text-dark uppercase font-semibold">
              Create an Account
            </h3>
          </div>

          <form
            onSubmit={handleSignup}
            className="flex flex-col gap-4 text-left px-12 md:px-28 w-full"
          >
            <div className="flex flex-col gap-1 text-left">
              <label htmlFor="name" className="font-medium px-2 text-dark">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="example@email.com"
                value={fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                onBlur={() => handleInputBlur("fullName", fullName)}
                className={`${fullNameBorder} placeholder:text-sm placeholder:font-normal bg-[#f1f1f1] text-gray outline-none px-5 py-2 rounded-xl border`}
              />
              {fullNameError && fullNameError !== "empty" && (
                <span className="text-red-500 text-sm mt-1 w-[95%] max-w-[95%]">
                  {fullNameError}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 text-left">
              <label htmlFor="email" className="font-medium px-2 text-dark">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onBlur={() => handleInputBlur("email", email)}
                className={`${emailBorder} placeholder:text-sm placeholder:font-normal bg-[#f1f1f1] text-gray outline-none px-5 py-2 rounded-xl border`}
              />
              {emailError && emailError !== "empty" && (
                <span className="text-red-500 text-sm mt-1 w-[95%] max-w-[95%]">
                  {emailError}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 text-left">
              <label htmlFor="password" className="font-medium px-2 text-dark">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="abcd@123"
                value={password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                onBlur={() => {
                  handleInputBlur("password", password);
                  if (confirmPassword.length > 0) {
                    handleInputBlur("confirmPassword", confirmPassword);
                  }
                }}
                className={`${passwordBorder} placeholder:text-sm placeholder:font-normal bg-[#f1f1f1] text-gray outline-none px-5 py-2 rounded-xl border`}
              />
              {passwordError && passwordError !== "empty" && (
                <span className="text-red-500 text-sm mt-1 w-[95%] max-w-[95%]">
                  {passwordError}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 text-left">
              <label
                htmlFor="confirmPassword"
                className="font-medium px-2 text-dark"
              >
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="abcd@123"
                value={confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                onBlur={() =>
                  handleInputBlur("confirmPassword", confirmPassword)
                }
                className={`${confirmPasswordBorder} placeholder:text-sm placeholder:font-normal bg-[#f1f1f1] text-gray outline-none px-5 py-2 rounded-xl border`}
              />
              {confirmPasswordError && confirmPasswordError !== "empty" && (
                <span className="text-red-500 text-sm mt-1 w-[95%] max-w-[95%]">
                  {confirmPasswordError}
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={!isFormValid}
              className={`px-8 mt-4 py-4 text-sm w-fit shadow-xl text-[#f1f1f1] rounded-full font-semibold ${
                isFormValid ? "bg-dark" : "bg-gray"
              }`}
            >
              Register
            </button>
          </form>
          <span className="md:flex-row md:gap-1 items-center flex flex-col text-sm font-semibold">
            Already have an account?
            <button
              onClick={() => {
                signIn();
              }}
              className="font-bold hoverEffect2"
            >
              LogIn
            </button>
          </span>
        </main>
      </section>
    );
  }
};

export default Signup;
