"use server";
import { resetCart } from "@/lib/actions/user.actions";
import Stripe from "stripe";

const page = async ({
  params,
}: {
  params: {
    ck_sid: string;
  };
}) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const session = await stripe.checkout.sessions.retrieve(params.ck_sid);
  if (session && session.payment_status === "paid") {
    resetCart();
    return (
      <div className="pb-[120px] pt-[20px]">
      <div className="bg-green-200 p-4 rounded-md">
        <h2 className="text-green-800 font-semibold text-lg">
          Payment Successful!
        </h2>
        <p className="text-green-600">
          Your payment has been processed successfully.
        </p>
      </div>
      </div>
    );
  } else {
    return (
      <div className="pb-[120px] pt-[20px]">
      <div className="bg-red-200 p-4 rounded-md">
        <h2 className="text-red-800 font-semibold text-lg">
          Error processing request
        </h2>
        <p className="text-red-600">Please try again later.</p>
      </div>
      </div>
    );
  }
};

export default page;
