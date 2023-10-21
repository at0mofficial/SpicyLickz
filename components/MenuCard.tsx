import Image from "next/image";
import React from "react";

const MenuCard = () => {
  return (
    <div className="flex flex-col w-full rounded-lg shadow-xl">
      <div className="relative aspect-[16/9] max-sm:aspect-[4/3] w-full">
      <button className="absolute z-10 right-3 top-3 px-5 py-2.5 bg-dark hidden xs:block text-xs font-medium text-white rounded-[4px]">
          Add to Cart
        </button>
        <Image
          src={`/Grilled_Shrimp.jpg`}
          alt={"Card.title"}
          fill
          className="object-cover object-center rounded-t-lg"
        />
      </div>
      <div className="flex flex-col gap-3 p-[14px]">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-semibold text-dark">Grilled Shrimp</h3>
            <p className="text-xs font-medium pl-[2px] text-gray">
              With chopped parsley
            </p>
          </div>
          <span className="text-xl font-semibold text-dark">
            <span className="text-primary"> $ </span>24.99
          </span>
        </div>
        <button className="px-5 py-2.5 xs:hidden bg-dark text-base font-semibold text-white rounded-[4px]">
          Add to Cart
        </button>
        
      </div>
    </div>
  );
};

export default MenuCard;
