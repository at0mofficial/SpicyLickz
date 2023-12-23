"use server";
import { saveOrder } from "@/lib/actions/order.actions";
import Stripe from "stripe";

// Initialize a server-side variable to track whether the order has been saved
let orderSaved = false;

const page = async ({
  params,
  request,
}: {
  params: {
    ck_sid: string;
  };
  request: any; // Adjust the type based on your framework
}) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const session = await stripe.checkout.sessions.retrieve(params.ck_sid);


  if (session && session.payment_status === "paid" && session.status === "complete" && !orderSaved) {
    await saveOrder(session.amount_total as number);
    orderSaved = true;

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
  } else if (orderSaved) {
    return (
      <div className="pb-[120px] pt-[20px]">
        <div className="bg-green-200 p-4 rounded-md">
          <h2 className="text-green-800 font-semibold text-lg">
            Payment Successful!
          </h2>
          <p className="text-green-600">
            Your payment was processed successfully.
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
