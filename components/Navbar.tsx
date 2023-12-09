"use client";
import Image from "next/image";
import logo from "@/public/logo.png";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import UserDisplay from "./UserDisplay";


const Navbar = () => {
  const { data: session, status } = useSession();
    const userImage = session?.user?.imageUrl || "/no-user.jpg"
  return (
    <header className="px-5 py-3 max-xs:px-3 w-full bg-white z-50">
      <nav className="flex justify-between items-center text-base text-dark">
        <Link href="/" className="max-xs:scale-[80%]">
          <Image src={logo} alt="logo" height={46} className="" />
        </Link>
        <Link
          href="/menu"
          className="tracking-[2px] md:ml-16 [word-spacing:-2px] font-semibold hoverEffect"
        >
          MENU
        </Link>
        {session && status === "authenticated" ? (
          <UserDisplay userImage={userImage} />
        ) : (
          <div className="flex gap-2 mr-2">
            <Link href={`/cart`}>
            <Image
                        src={`/cartIcon-Dark.svg`}
                        alt="profile"
                        width={25}
                        height={25}
                        className="mr-2 md:mr-6 aspect-square"
                      />
            </Link>
            <button
              onClick={() => {
                signIn();
              }}
              className="hover:text-primary"
            >
              Login
            </button>
            <span className="hidden md:block">/</span>
            <Link href="/signup" className="hover:text-primary hidden md:block">
              Signup
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
