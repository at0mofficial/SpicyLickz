import { fetchUserAddress } from "@/lib/actions/user.actions";
import Image from "next/image";
import Link from "next/link";

const AddressCard = async () => {
  const { streetAddress, city, zipCode, aptNo } = await fetchUserAddress();
  return (
    <>
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
          <Link href={'/userProfile'} className="ml-[-6px] px-8 py-4 text-sm w-fit bg-dark shadow-xl text-[#f1f1f1] rounded-full font-semibold">
            Change Address
          </Link>
        </div>
      ) : (
        <Link
          href={`/userProfile`}
          className="ml-[-6px] px-8 py-4 text-sm w-fit bg-primary shadow-xl text-[#f1f1f1] rounded-full font-semibold"
        >
          Add an address
        </Link>
      )}
    </>
  );
};

export default AddressCard;
