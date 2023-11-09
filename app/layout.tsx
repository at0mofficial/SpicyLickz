import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import Footer from "@/components/Footer";

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
        {children}
        <Footer />
      </body>
    </html>
  );
}
