import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/mongoose";
import { comparePassword } from "@/lib/utils";
import NextAuth, {
  NextAuthOptions,
  Profile,
  Account,
  User as NextAuthUser,
} from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

interface ExtendedProfile extends Profile {
  picture?: string;
}

const GOOGLE_CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error("OAuth client ID or client secret is not defined");
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
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
            throw new Error("Email not verified!");
          }
          if(!user.password) {
            throw new Error("Login with Google!");
          }
          const isPasswordValid = await comparePassword(
            password,
            user.password
          );
          if (!isPasswordValid) {
            throw new Error("Invalid email or password!");
          }

          //merrge carts
          const userInfo = {
            id: user._id,
            name: user.name,
            email: user.email,
            image: user.imageUrl,
          };
          return userInfo;
        } catch (err: any) {
          console.error(err);
          throw new Error(err.message);
        }
      },
    }),
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      // console.log("<-----Session Session----->", session);
      // console.log("<-----Session Token----->", token);
      session.user.id = token.id;
      return session;
    },
    jwt: ({ token, user }) => {
      // console.log("<-----JWT User----->", user);
      // console.log("<-----JWT Token----->", token);
      if (user) {
        return {
          ...token,
          id: user.id,
        };
      }
      return token;
    },
    async signIn({
      user,
      account,
      profile,
    }:{
      user: NextAuthUser | AdapterUser;
      account: Account | null;
      profile?: ExtendedProfile | undefined;
    }){
      // console.log("<-----(params)----->", user);
      // console.log("<-----(params.profile)----->", profile);
      if (account?.provider === "google") {
        try {
          await connectToDB();
          if (!profile?.email || !user) {
            throw new Error("No Profile");
          }
          const existingUser = await User.findOne({
            email: profile.email,
          });
          if (existingUser) {
            const updatedUser = await User.findOneAndUpdate(
              { email: profile.email },
              { name: profile.name },
              { new: true }
            );
            if (!user) {
              throw new Error("Error updating user");
            }
            user.id = updatedUser._id;
            return true;
          } else {
            const newUser = await User.create({
              name: profile.name,
              email: profile.email,
              imageUrl: profile.picture,
              isVerified: true,
            });
            if (!user) {
              throw new Error("Error creating user");
            }
            user.id = newUser._id;
            return true;
          }
        } catch (err: any) {
          console.log(err);
          throw new Error("Error signing in!");
        }
      }
      if (account?.provider === "credentials") {
        if (user) {
          return true;
        }else{
          return false
        }
      }
      else {
        return false;
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
