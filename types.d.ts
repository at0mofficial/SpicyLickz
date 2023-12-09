import { Session } from "next-auth";

interface User {
  id: string;
  name: string;
  email: string;
  imageUrl?: string | undefined;
  address?: {
    streetAddress: string;
    city: string;
    zipcode: string;
    AptNo: string;
  };
  cart?: Array<{ meal: string; quantity: number }> | undefined;
}

declare module "next-auth" {
  interface Session {
    user: User;
  }
}
