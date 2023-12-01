import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/mongoose";
import { comparePassword } from "@/lib/utils";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Login",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "example@email.com",
        },
        password: {
          label: "password",
          type: "password",
          placeholder: "abcd@123",
        },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        try {
          await connectToDB();
          if (!email || !password) {
            return null;
          }
          const user = await User.findOne({ email: email });
          if (!user) {
            throw new Error("User not registered!");
          }
          if (!user.isVerified) {
            throw new Error(
              "Email not verified!"
            );
          }

          const isPasswordValid = await comparePassword(
            password,
            user.password
          );
          if (!isPasswordValid) {
            throw new Error("Invalid email or password!");
          }
          const userInfo = {
            id: user._id,
            name: user.name,
            email: user.email,
            imageUrl: user.imageUrl,
            address: user.address,
            cart: user.cart,
          };
          return userInfo;
        } catch (err: any) {
          console.error(err);
          throw new Error(err.message);
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session, user: {
          ...session.user,
          id: token.id,
          imageUrl: token.imageUrl,
          address: token.address,
          cart: token.cart,
        }
      }
    },
    jwt: ({ token, user }) => {
      const u = user as unknown as any;
      if(user){
        return {
          ...token,
          id: u.id,
          imageUrl: u.imageUrl,
          address: u.address,
          cart: u.cart,
        };
        
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
