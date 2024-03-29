"use client";
import { addMealToCart } from "@/lib/actions/user.actions";
import Image from "next/image";
import toast from "react-hot-toast";

interface mealCardProps {
  id: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
}
const MenuCard = ({
  title,
  description,
  price,
  imageUrl,
  id,
}: mealCardProps) => {
  const handleAddToCart = async () => {
    try {
      await addMealToCart(id);
      toast.success("Item Added to cart!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex bg-white flex-col w-full rounded-lg shadow-xl">
      <div className="relative aspect-[16/9] max-sm:aspect-[4/3] w-full">
        <button
          onClick={handleAddToCart}
          className="absolute z-10 right-3 top-3 px-5 py-2.5 bg-dark hover:bg-[#171b1f] hidden xs:block text-xs font-medium text-white rounded-[4px]"
        >
          Add to Cart
        </button>
        <Image
          src={`/${imageUrl}`}
          alt={`${title}`}
          fill
          sizes="(max-width: 639px) 90vw, (max-width: 1023px) 50vw, 33vw"
          className="object-cover object-center rounded-t-lg"
        />
      </div>
      <div className="flex  flex-col gap-3 p-[14px]">
        <div className="flex justify-between items-start">
          <div className="flex max-w-[80%] flex-col gap-1">
            <h3 className="text-xl font-semibold text-dark">{title}</h3>
            <p className="text-xs font-medium pl-[2px] xs:pb-1 text-gray">
              {description}
            </p>
          </div>
          <span className="text-xl whitespace-nowrap font-semibold text-dark">
            <span className="text-primary"> $ </span>
            {price}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          className="px-5 py-2.5 xs:hidden bg-dark hover:bg-[#171b1f] text-base font-semibold text-white rounded-[4px]"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default MenuCard;
