import { Session } from "next-auth";

interface User {
  id: string;
  name: string;
  email: string;
  imageUrl?: string | undefined;
}

declare module "next-auth" {
  interface Session {
    user: User;
  }
}
