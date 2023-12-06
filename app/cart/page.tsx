import CartCard from "@/components/CartCard";
import { getTopMeals } from "@/lib/actions/meals.actions";
import Image from "next/image";

const Cart = async () => {
  const topPicks = await getTopMeals();
  return (
    <main className="flex-col lg:px-16 md:px-12 px-6 pt-8 pb-20">
      <h2 className="text-[28px] pb-4 font-semibold text-dark">My Cart</h2>
      <div className="flex lg:flex-row flex-col">
        <div className="flex flex-col xl:basis-[65%] xl:min-w-[65%] xl:max-w-[65%] lg:basis-[65%] lg:min-w-[65%] lg:max-w-[65%] max-w-full w-full">
          <div className="flex flex-col gap-6 rounded-[4px] w-full lg:w-[95%] lg:max-h-[518px] lg:overflow-auto">
            {topPicks.map((meal: any) => (
              <CartCard
                key={meal._id}
                id={meal._id.toString()}
                title={meal.title}
                description={meal.description}
                price={`${meal.price}`}
                imageUrl={meal.imageUrl}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:mt-0 mt-10 grow gap-5">
          <div className="flex flex-col gap-5">
            <div className="flex gap-6">
              <div className="bg-[#f1f1f1] w-fit h-fit max-h-fit shrink-0 max-w-fit p-5 rounded-lg">
                <Image
                  src={`/locationPing.svg`}
                  alt="address"
                  width={24}
                  height={24}
                  className="aspect-square shrink-0"
                />
              </div>
              <div className="flex flex-col justify-center items-start ">
                <p className="font-medium text-dark text-lg">
                  Unit 294, 165 Chreokee Blvd. 
                </p>
                <p className="text-lg text-gray font-medium">
                  <span>North York, </span>ON
                </p>
                <p className="text-lg text-gray font-medium">
                  <span>M2J 4T7</span>
                </p>
              </div>
            </div>
            <button className="ml-[-6px] px-8 py-4 text-sm w-fit bg-dark shadow-lg text-[#f1f1f1] rounded-3xl font-semibold">
              Change Address
            </button>
          </div>
          <div className="flex flex-col gap-4 mt-7">
            <h3 className="text-xl font-semibold">Order Info</h3>
            <div>
              <p className="flex justify-between text-sm font-medium text-gray">
                Subtotal
                <span className="text-base font-medium">
                  <span className="font-semibold text-primary">$</span>199.00
                </span>
              </p>
              <p className="flex justify-between text-sm font-medium text-gray">
                Service & Tax Fee
                <span className="text-base font-medium">
                  <span className="font-semibold text-primary">$</span>10.00
                </span>
              </p>
            </div>
            <p className="flex justify-between text-lg font-semibold mt-[-8px] text-dark">
              Total<span className="">$209.00</span>
            </p>
          </div>
          <button className="ml-[-6px] px-8 py-4 text-sm w-fit bg-dark shadow-lg text-[#f1f1f1] rounded-3xl font-semibold">
              Place Order
            </button>
        </div>
      </div>
    </main>
  );
};

export default Cart;
