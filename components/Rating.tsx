"use client";
import Image from "next/image";
import React from "react";

const Rating = ({ rating }: { rating: number }) => {
  const filledStars = rating;
  const emptyStars = 5 - rating;

  return (
    <div className="flex">
      {Array(filledStars)
        .fill(0)
        .map((star, index) => (
          <Image
            src="/star_filled.svg"
            alt="filled Star"
            key={index}
            width={30}
            height={30}
          />
        ))}
      {Array(emptyStars)
        .fill(0)
        .map((star, index) => (
          <Image
            src="/star_empty.svg"
            alt="filled Star"
            key={index}
            width={30}
            height={30}
          />
        ))}
    </div>
  );
};

export default Rating;
