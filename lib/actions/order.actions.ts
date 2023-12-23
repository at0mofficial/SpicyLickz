import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import Order from "../models/order.moedl";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDB } from "../mongoose";

export async function saveOrder(total: number): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const session = await getServerSession(authOptions);
      await connectToDB();

      if (session?.user) {
        const id = session.user.id;
        const user = await User.findById(id);
        if (!user) {
          console.error(`User with ID ${id} not found.`);
          return resolve();
        }

        const cartItems = user.cart;
        const totalAmount = total / 100;

        const order = new Order({
          userId: id,
          items: cartItems,
          totalAmount: totalAmount,
        });
        try {
          await order.save();
        } catch (err) {
          reject(new Error("Failed to save order history"));
          return;
        }
        await User.updateOne({ _id: id }, { $set: { cart: [] } });
        revalidatePath("/cart");
        resolve();
      } else {
        console.error("error resetting cart!");
      }
    } catch (err: any) {
      console.error(err);
    }
  });
}
