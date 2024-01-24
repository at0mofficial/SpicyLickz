import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import Order from "../models/order.moedl";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDB } from "../mongoose";

export async function saveOrder(total: number): Promise<void> {
  try {
    const session = await getServerSession(authOptions);
    await connectToDB();

    if (session?.user) {
      const id = session.user.id;
      const user = await User.findById(id);
      if (!user) {
        throw new Error(`Unorthorised!`);
      }

      const cartItems = user.cart;
      const totalAmount = total / 100;

      const order = new Order({
        userId: id,
        items: cartItems,
        totalAmount: totalAmount,
      });
      await order.save();
      await User.updateOne({ _id: id }, { $set: { cart: [] } });
      revalidatePath("/cart");
    } else {
      throw new Error(`Unorthorised!`);
    }
  } catch (err: any) {
    console.error(err);
  }
}
