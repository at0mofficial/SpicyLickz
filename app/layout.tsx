import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Spicy Lickz",
  description: "Spicy Lickz is a online food delivery website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-poppins max-w-[1920px] m-auto">
        <Navbar />
        <Toaster position="top-center" reverseOrder={false} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
