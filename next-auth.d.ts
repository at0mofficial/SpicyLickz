import { DefaultSession, Session } from "next-auth";
import { JWT } from "next-auth/jwt"
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
        id: string;
    } & DefaultSession['user'],
  }
  interface NextAuth {
    signIn(params: {
      user?: User | AdapterUser | undefined;
      account: Account | null;
      profile?: ExtendedProfileWithPicture | undefined; // Update here
      email?: { verificationRequest?: boolean | undefined } | undefined;
      credentials?: Record<string, any> | undefined;
    }): Promise<string | boolean>;
  }

  interface ExtendedProfileWithPicture extends ExtendedProfile {
    // Add the 'picture' property if it exists in your profiles
    picture?: string;
  }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: string;
      } 
  }


