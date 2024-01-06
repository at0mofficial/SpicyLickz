import Image, { StaticImageData } from "next/image";
import React from "react";
import Rating from "./Rating";

interface PropsInterface {
  reviewTitle: string;
  reviewDescription: string;
  userName: string;
  rating: number;
  imgUrl: StaticImageData;
}

const ReviewCard = ({
  reviewTitle,
  reviewDescription,
  userName,
  rating,
  imgUrl,
}: PropsInterface) => {
  return (
    <div className="flex flex-col justify-start items-center md:h-[420px] md:pt-12 md:pb-8 h-[380px] snap-start shadow-[15px_15px_20px_0px_rgba(36,36,36,0.3)] rounded-lg pt-4 pb-2 px-12 gap-3 custom-review-card">
      <div className="relative shrink-0 aspect-square w-[160px]">
        <Image
          src={imgUrl}
          alt="User Image"
          draggable="false"
          fill
          sizes="200px"
          className="object-cover border-[3px] border-zinc-400 p-[2px] rounded-full"
        />
      </div>
      <div className="flex flex-col justify-center items-center text-center">
        <div className="uppercase text-base tracking-wide font-semibold">
          {userName}
        </div>
        <Rating rating={rating} />
        <div className="uppercase text-base font-semibold mt-1">{reviewTitle}</div>
        <div className="text-sm font-medium mt-2">{reviewDescription}</div>
      </div>
    </div>
  );
};

export default ReviewCard;
