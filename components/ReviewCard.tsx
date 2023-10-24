import Image from "next/image";
import React from "react";

interface PropsInterface {
  heading: string,
  body: string,
  user: string
}

const ReviewCard = (props: PropsInterface) => {
  return (
    <div className="flex flex-1 p-8 rounded-md shadow-2xl gap-10 items-center min-w-[600px] w-[600px]">
      <div className="flex flex-col gap-2">
        <div className="relative h-[120px] aspect-square">
          <Image
            src="/anim2.jpeg"
            alt="User Image"
            fill
            className="rounded-full object-cover object-center"
          />
        </div>
        <div className="text-dark text-center">
        <p className="text-sm font-semibold">{props.user}</p>
        <p className="text-xs">Customer</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-2 text-dark">
        <h4 className="text-xl w-[80%] leading-[25px] font-semibold">{props.heading}</h4>
        <p className="text-sm font-medium tracking-wide text-gray">{props.body}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
