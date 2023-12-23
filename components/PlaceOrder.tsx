"use client";

import { checkout, fetchUserAddress } from "@/lib/actions/user.actions";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const PlaceOrder = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleClick = async () => {
    try {
      const address = await fetchUserAddress();
      if (!address.streetAddress || !address.city || !address.zipCode) {
        toast.error("Add an address!");
      }else {
        try {
         const pay_url = await checkout();
         router.push(pay_url);
        } catch (err:any) {
          toast.error(err.message);
        }
      }
    } catch (error) {
      toast.error("Error placing order!");
    }
  };
  return (
    <>
      {session && status === "authenticated" ? (
        <button
          onClick={handleClick}
          className="ml-[-6px] px-8 py-4 text-sm w-fit bg-dark shadow-xl text-[#f1f1f1] rounded-full font-semibold"
        >
          Place Order
        </button>
      ) : (
        <button
          onClick={() => {
            signIn();
          }}
          className="ml-[-6px] px-8 py-4 text-sm w-fit bg-dark shadow-xl text-[#f1f1f1] rounded-full font-semibold"
        >
          Login to place order
        </button>
      )}
    </>
  );
};

export default PlaceOrder;
