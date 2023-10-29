"use client";
import Image from "next/image";
import ReviewCard from "./ReviewCard";
import { useEffect } from "react";
import { dummyReviews } from "@/constants";

const Testimonials = () => {
  useEffect(() => {
    const carousel = document.querySelector("#carousel") as HTMLDivElement;
    const wrapper = document.querySelector("#wrapper");
    const leftButton = document.querySelector("#left");
    const rightButton = document.querySelector("#right");
    const cardWidth = (
      document.querySelector(".custom-review-card") as HTMLDivElement
    ).offsetWidth;

    let isDragging = false;
    let startX: number, startScrollLeft: number, timeOutId: NodeJS.Timeout;
    let cardsPerView = Math.round(carousel.offsetWidth / cardWidth);

    if (carousel) {
      const carouselChildren = Array.from(carousel?.children);
      carouselChildren
        .slice(-cardsPerView)
        .reverse()
        .forEach((card) => {
          const cardElement = document.createElement("div");
          cardElement.innerHTML = card.outerHTML;
          carousel.insertAdjacentElement("afterbegin", cardElement);
        });

      carouselChildren.slice(0, cardsPerView).forEach((card) => {
        const cardElement = document.createElement("div");
        cardElement.innerHTML = card.outerHTML;
        carousel.insertAdjacentElement("beforeend", cardElement);
      });
    }

    if (leftButton && rightButton) {
      leftButton.addEventListener("click", () => {
        if (carousel) {
          carousel.scrollLeft -= cardWidth + 24;
        }
      });
      rightButton.addEventListener("click", () => {
        if (carousel) {
          carousel.scrollLeft += cardWidth + 24;
        }
      });
    }

    if (carousel) {
      const startDragging = (e: any) => {
        isDragging = true;
        carousel.classList.add("dragging");
        startX = e.pageX;
        startScrollLeft = carousel.scrollLeft;
      };
      const stopDragging = () => {
        isDragging = false;
        carousel.classList.remove("dragging");
      };
      const autoPlay = () => {
        if (window.innerWidth < 800) return;
        timeOutId = setTimeout(() => {
          (carousel.scrollLeft += cardWidth), 2500;
        });
      };
      autoPlay();
      const dragging = (e: any) => {
        if (!isDragging) return;
        carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
      };

      const infiniteScroll = (e: any) => {
        if (carousel.scrollLeft === 0) {
          carousel.classList.add("scroll-auto");
          carousel.scrollLeft = carousel.scrollWidth - 2 * carousel.offsetWidth;
          carousel.classList.remove("scroll-auto");
        } else if (
          Math.ceil(carousel.scrollLeft) ===
          carousel.scrollWidth - carousel.offsetWidth
        ) {
          carousel.classList.add("scroll-auto");
          carousel.scrollLeft = carousel.offsetWidth;
          carousel.classList.remove("scroll-auto");
        }
        // clearTimeout(timeOutId);
        // if (!wrapper?.matches(":hover")) autoPlay();
      };

      carousel.addEventListener("mousemove", dragging);
      carousel.addEventListener("mousedown", startDragging);
      carousel.addEventListener("mouseup", stopDragging);
      carousel.addEventListener("scroll", infiniteScroll);
      // wrapper?.addEventListener("mouseenter", () => {
      //   clearTimeout(timeOutId);
      // });
      // wrapper?.addEventListener("mouseleave", autoPlay);
    }
  }, []);

  return (
    <>
      <section className="py-[100px] px-[30px] ">
        <div id="wrapper">
          <div className="relative">
            <div className="absolute z-10 rounded-full shadow-[2px_5px_10px_0px_rgba(36,36,36,0.5)] left-[-20px] top-[50%] translate-y-[-50%]">
              <div
                id="left"
                className="relative lg:w-[60px] w-[40px] aspect-square"
              >
                <Image
                  src="chevron_left.svg"
                  alt="previous"
                  fill
                  className="bg-secondary rounded-full lg:p-4 p-3"
                />
              </div>
            </div>
            <div
              id="carousel"
              className="grid grid-flow-col gap-6 xl:auto-cols-[calc((100%/3)-12px)] md:auto-cols-[calc((100%/2)-9px)] auto-cols-[100%] overflow-x-auto snap-x snap-mandatory no-scrollbar py-10"
            >
              {dummyReviews.map((review, index) => (
                <ReviewCard
                  userName={review.userName}
                  reviewTitle={review.reviewTitle}
                  rating={review.rating}
                  key={index}
                  imgUrl={review.imgUrl}
                  reviewDescription={review.reviewDescription}
                />
              ))}
            </div>
            <div className="absolute z-10 rounded-full shadow-[2px_5px_10px_0px_rgba(36,36,36,0.5)] right-[-20px] top-[50%] translate-y-[-50%]">
              <div
                id="right"
                className="relative lg:w-[60px] w-[40px] rounded-full shadow-xl aspect-square"
              >
                <Image
                  src="chevron_right.svg"
                  alt="previous"
                  fill
                  className="bg-secondary rounded-full lg:p-4 p-3"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Testimonials;
