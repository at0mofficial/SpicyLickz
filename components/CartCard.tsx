import Image from "next/image";
import React from "react";

interface cartCardProps {
  id: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
}
const CartCard = ({ title, description, price, imageUrl }: cartCardProps) => {
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
            {price}
          </span>
          <div className="flex items-center justify-center px-4 gap-2">
          <button className="text-center h-8 w-8 min-w-[32px] bg-[#edebeb] rounded-md">+</button>
            <span className="min-w-[22px] text-center">5</span>
            <button className="text-center h-8 w-8 min-w-[32px] bg-[#edebeb] rounded-md">-</button>
            <Image src={`/delete_Icon.svg`} alt="delete" width={16} height={16} className="ml-4" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartCard;
