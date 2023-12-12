"use client";
import { decreaseDBMealQty, deleteItemFromDBCart, increaseDBMealQty } from "@/lib/actions/user.actions";
import { decreaseLocalMealQty, deleteItemFromLocalStorage, increaseLocalMealQty } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface cartCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity: number;
  isUserLoggedIn: boolean;
}
const CartCard = ({
  title,
  description,
  price,
  imageUrl,
  id,
  quantity,
  isUserLoggedIn,
}: cartCardProps) => {
  const path = usePathname();
  const [qty, setQty] = useState<number>(quantity);
  const handleIncrease = () => {
    if(isUserLoggedIn) {
      try {
        increaseDBMealQty(id, path);
        setQty((prevQty) => prevQty + 1);
      } catch (err:any) {
        toast.error(err.message);
      }
    }else{
      increaseLocalMealQty(id, path);
      setQty((prevQty) => prevQty + 1);
    }
  };
  const handleDecrease = () => {
    if(isUserLoggedIn) {
      try {
        decreaseDBMealQty(id, path);
        if(qty>1) {
          setQty((prevQty) => prevQty - 1);
        }
      } catch (err:any) {
        toast.error(err.message);
      }
    }else{
      decreaseLocalMealQty(id, path);
      if(qty>1) {
        setQty((prevQty) => prevQty - 1);
      }
    }
  };
  const handleDelete = () => {
    if(isUserLoggedIn) {
      try {
        deleteItemFromDBCart(id, path);
      } catch (err:any) {
        toast.error(err.message);
      }
    }else{
      deleteItemFromLocalStorage(id, path);
    }
  };
  return (
    <div className="flex md:flex-row flex-row-reverse lg:w-[90%] items-start lg:max-w-[90%] w-full gap-8">
      <div className="md:h-[150px] max-md:mt-2 md:w-[260px] lg:h-[120px] lg:w-[150px] xss:h-[80px] xss:w-[80px] xss:block hidden rounded-sm relative shrink-0">
        <Image
          src={`/${imageUrl}`}
          alt={title}
          fill
          className="object-cover rounded-[4px] shrink-0"
        />
      </div>

      <div className="flex grow flex-col justify-between text-dark">
        <div>
          <h4 className="text-xl pb-1 font-semibold">{title}</h4>
          <p className="text-base text-gray">{description}</p>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-lg whitespace-nowrap font-semibold text-dark">
            <span className="text-primary"> $ </span>
            {(price * quantity).toFixed(2)}
          </span>
          <div className="flex items-center justify-center px-4 gap-2">
            <button
              onClick={handleDecrease}
              className="text-center h-8 w-8 min-w-[32px] bg-[#edebeb] rounded-md"
            >
              -
            </button>
            <span className="min-w-[22px] text-center">{qty}</span>
            <button
              onClick={handleIncrease}
              className="text-center h-8 w-8 min-w-[32px] bg-[#edebeb] rounded-md"
            >
              +
            </button>
            <button onClick={handleDelete}>
              <Image
                src={`/delete_Icon.svg`}
                alt="delete"
                width={16}
                height={16}
                className="ml-4"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
