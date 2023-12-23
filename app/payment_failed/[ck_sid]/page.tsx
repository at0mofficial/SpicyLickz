"use server";
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
  if (session.status === "open") {
    await stripe.checkout.sessions.expire(params.ck_sid);
  }
    return (
      <div className="pb-[120px] pt-[20px]">
      <div className="bg-red-200 p-4 rounded-md">
        <h2 className="text-red-800 font-semibold text-lg">
          Payment Cancelled
        </h2>
        <p className="text-red-600">Oops! It seems like the payment was not completed.</p>
      </div>
      </div>
    );
};

export default page;
