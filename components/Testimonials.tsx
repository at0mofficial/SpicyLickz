"use client";
import { dummyReviews } from "@/constants";
import { useEffect } from "react";
import Swiper from "swiper";
import ReviewCard from "./ReviewCard";
import Image from "next/image";
import "swiper/css";
import { Autoplay, Navigation } from "swiper/modules";

export default function Testmonials() {
  useEffect(() => {
    new Swiper(".swiper", {
      direction: "horizontal",
      speed: 700,
      loop: true,
      slidesPerView: 1,
      spaceBetween: 0,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      autoplay: {
        delay: 3000,
        pauseOnMouseEnter: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1280: {
          slidesPerView: 3,
        },
      },
      modules: [Navigation, Autoplay],
    });
  }, []);

  return (
    <section className="swiper relative">
      <div className="swiper-wrapper">
        {dummyReviews.map((review, index) => (
          <div className="swiper-slide py-[100px] px-6" key={index}>
            <ReviewCard
              userName={review.userName}
              reviewTitle={review.reviewTitle}
              rating={review.rating}
              imgUrl={review.imgUrl}
              reviewDescription={review.reviewDescription}
            />
          </div>
        ))}
      </div>

      <div className="swiper-button-prev absolute top-1/2 left-5 -translate-y-1/2 z-10 lg:w-[60px] w-[40px] aspect-square">
        <Image
          src="chevron_left.svg"
          alt="previous"
          fill
          className="bg-secondary hover:cursor-pointer rounded-full lg:p-4 p-3"
        />
      </div>

      <div className="swiper-button-next absolute top-1/2 right-5 -translate-y-1/2 z-10 lg:w-[60px] w-[40px] rounded-full shadow-xl aspect-square">
        <Image
          src="chevron_right.svg"
          alt="previous"
          fill
          className="bg-secondary hover:cursor-pointer rounded-full lg:p-4 p-3"
        />
      </div>
    </section>
  );
}
