import CartCard from "@/components/CartCard";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { fetchUserAddress, fetchUserCart } from "@/lib/actions/user.actions";
import Link from "next/link";
import { redirect } from "next/navigation";

const Cart = async () => {
  interface Meal {
    _id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
  }

  interface CartItem {
    meal: Meal;
    quantity: number;
  }
  const session = await getServerSession(authOptions);
  const isUserLoggedIn: boolean = !!session && !!session.user;
  if(!isUserLoggedIn){
    redirect('/login');
  }
  let userCart: CartItem[] = await fetchUserCart();
  const { streetAddress, city, zipCode, aptNo } = await fetchUserAddress();

  const subTotal: number = userCart.reduce(
    (acc, cartItem) => acc + cartItem.meal.price * cartItem.quantity,
    0
  );

  const taxRate = subTotal > 100 ? 0.05 : 0.1;
  const taxFee = subTotal * taxRate;
  const total = subTotal + taxFee;

  return (
    <main className="flex-col lg:px-16 md:px-12 px-6 pt-8 pb-20">
      <h2 className="text-[28px] pb-4 font-semibold text-dark">My Cart</h2>
      {userCart.length > 0 ? (
        <div className="flex lg:flex-row flex-col">
          <div className="flex flex-col xl:basis-[65%] xl:min-w-[65%] xl:max-w-[65%] lg:basis-[65%] lg:min-w-[65%] lg:max-w-[65%] max-w-full w-full">
            <div className="flex flex-col gap-6 rounded-[4px] w-full lg:w-[95%] lg:max-h-[518px] lg:overflow-auto">
              {userCart &&
                userCart.length > 0 &&
                userCart.map((cartItem: CartItem) => (
                  <CartCard
                    key={cartItem.meal._id}
                    id={cartItem.meal._id.toString()}
                    title={cartItem.meal.title}
                    description={cartItem.meal.description}
                    price={cartItem.meal.price}
                    imageUrl={cartItem.meal.imageUrl}
                    quantity={cartItem.quantity}
                    isUserLoggedIn={isUserLoggedIn}
                  />
                ))}
            </div>
          </div>

          <div className="flex flex-col lg:mt-0 mt-14 grow gap-5">
            {streetAddress && city && zipCode ? (
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-6">
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
                    <p className="font-medium text-dark md:leading-6 leading-5 text-xl">
                      {aptNo}
                      {aptNo && "-"}
                      {streetAddress}
                    </p>
                    <p className="text-lg text-gray font-medium">
                      <span>{city}, </span>ON, {zipCode}
                    </p>
                  </div>
                </div>
                <button className="ml-[-6px] px-8 py-4 text-sm w-fit bg-dark shadow-xl text-[#f1f1f1] rounded-3xl font-semibold">
                  Change Address
                </button>
              </div>
            ) : (
              <Link href={`/userProfile`} className="ml-[-6px] px-8 py-4 text-sm w-fit bg-primary shadow-xl text-[#f1f1f1] rounded-3xl font-semibold">
                Add an address
              </Link>
            )}

            <div className="flex flex-col gap-4 mt-7">
              <h3 className="text-xl font-semibold">Order Info</h3>
              <div>
                <p className="flex justify-between text-sm font-medium text-gray">
                  Subtotal
                  <span className="text-base font-medium">
                    <span className="font-semibold text-primary">$</span>
                    {subTotal.toFixed(2)}
                  </span>
                </p>
                <p className="flex justify-between text-sm font-medium text-gray">
                  Service & Tax Fee
                  <span className="text-base font-medium">
                    <span className="font-semibold text-primary">$</span>
                    {taxFee.toFixed(2)}
                  </span>
                </p>
              </div>
              <p className="flex justify-between text-lg font-semibold mt-[-8px] text-dark">
                Total<span className="">${total.toFixed(2)}</span>
              </p>
            </div>
            <button className="ml-[-6px] px-8 py-4 text-sm w-fit bg-dark shadow-xl text-[#f1f1f1] rounded-3xl font-semibold">
              Place Order
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center h-[400px] justify-center">
          <Image
            src={`/emptyCart.png`}
            alt="empty Cart"
            width={280}
            height={230}
          />
          <span className="text-2xl font-semibold text-[#808080]">
            Nothing in here.
          </span>
          <Link
            href={`/menu`}
            className="mt-4 px-5 py-3 w-fit bg-primary shadow-xl text-[#f1f1f1] rounded-3xl font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      )}
    </main>
  );
};

export default Cart;
