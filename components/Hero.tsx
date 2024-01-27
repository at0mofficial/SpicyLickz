import React from "react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="flex items-center relative lg:h-screen min-h-[565px] md:min-h-[700px]">
      <video
        autoPlay
        playsInline
        muted
        loop
        poster="hero-cover.webp"
        className="absolute -z-10 w-full h-full object-cover"
      >
        <source
          src="vidDesk.mp4"
          type="video/mp4"
          media="screen and (min-width: 600px)"
        ></source>
        <source src="vidMobile.mp4" type="video/mp4"></source>
      </video>
      <div className="lg:mt-[100px] md:mt-[85px] mt-[60px] md:px-[70px] py-[65px] px-[40px] lg:max-w-[80%]">
        <h1 className="lg:text-[70px] md:text-[64px] text-[48px] md:leading-[84px] leading-[60px] text-white font-bold uppercase">
          Want some <span className="text-primary">spice</span> in your life?
        </h1>
        <p className="text-white mt-4 text-base font-normal mb-7 md:max-w-[80%]">
          One of the most spiciest yet delicious recipies from all around the
          globe with carefully handpicked ingredients right at your doorstep
          every week.
        </p>
        <Link href="#top-meals" className="btn-primary inline-block">
          Get started
        </Link>
      </div>
    </section>
  );
};

export default Hero;
