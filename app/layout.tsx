import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { getServerSession } from "next-auth";
import SessionProvider from '@/components/SessionProvider';
import { authOptions } from "./api/auth/[...nextauth]/route";


export const metadata: Metadata = {
  title: "Spicy Lickz",
  description: "Spicy Lickz is a online food delivery website",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className="min-h-screen font-poppins scroll-smooth max-w-[1920px] m-auto">
          <SessionProvider session={session}>
          <Navbar />
          <Toaster position="top-center" reverseOrder={false} />
          {children}
          <Footer />
          </SessionProvider>
      </body>
    </html>
  );
}
