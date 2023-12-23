import CartCard from "@/components/CartCard";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { fetchCart } from "@/lib/actions/user.actions";
import Link from "next/link";
import AddressCard from "@/components/AddressCard";
import PlaceOrder from "@/components/PlaceOrder";

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
  let userCart: CartItem[] = await fetchCart();

  const subTotal: number = userCart.reduce(
    (sub, cartItem) => sub + cartItem.meal.price * cartItem.quantity,
    0
  );

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
                    key={cartItem.meal._id.toString()}
                    id={cartItem.meal._id.toString()}
                    title={cartItem.meal.title}
                    description={cartItem.meal.description}
                    price={cartItem.meal.price}
                    imageUrl={cartItem.meal.imageUrl}
                    quantity={cartItem.quantity}
                  />
                ))}
            </div>
          </div>

          <div className="flex flex-col lg:mt-0 mt-14 grow gap-5">
            {session && session.user && <AddressCard />}
            <div className="flex flex-col gap-4 mt-7">
              <h3 className="text-xl font-semibold">Order Info</h3>
              <p className="flex justify-between text-lg font-semibold mt-[-8px] text-dark">
                Sub Total<span className="">${subTotal.toFixed(2)}</span>
              </p>
              <div>
                <p className="flex justify-between text-sm italic text-gray">
                  *Taxes are calculated at checkout
                </p>
              </div>
            </div>
            <PlaceOrder />
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
            className="mt-4 px-5 py-3 w-fit bg-primary shadow-xl text-[#f1f1f1] rounded-full font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      )}
    </main>
  );
};

export default Cart;
