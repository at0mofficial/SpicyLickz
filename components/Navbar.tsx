import Image from "next/image";
import logo from "@/public/logo.png";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="px-5 py-3 max-xs:px-3 w-full bg-white z-50">
      <nav className="flex justify-between items-center text-base text-dark">
        <Link href="/" className="max-xs:scale-[80%]">
          <Image src={logo} alt="logo" height={46} className="" />
        </Link>
        <Link href="/on-the-menu" className="py-[7px] tracking-[2px] [word-spacing:-2px] font-semibold hoverEffect max-sm:ml-[-7%]">ON THE MENU
        </Link>

        <div className="flex gap-2 mr-2">
          <Link href="/login" className="hover:text-primary">Login</Link>
          <span className="hidden md:block">/</span>
          <Link href="/signup" className="hover:text-primary hidden md:block">Signup</Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
