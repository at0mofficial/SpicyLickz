import React from "react";
import Link from "next/link";

const Hero = () => {
  return (
    
    <section className="flex flex-col justify-center relative min-h-[600px]">
      <video
        autoPlay
        playsInline
        muted
        loop
        src="hero-video.mp4"
        poster="hero-cover.webp"
        className="absolute -z-10 w-full h-full object-cover"
      ></video>
        <div className="py-[100px] px-[50px] max-w-[80%]">
        <h1 className="text-[70px] leading-[84px] text-white font-bold uppercase">
        Want some <span className="text-primary">spice</span> in your life?
      </h1>
      <p className="text-white text-base font-normal mb-7 max-w-[80%]">One of the most spiciest yet delicious recipies from all around the globe with carefully handpicked ingredients right at your doorstep every week.</p>
      <Link href="#top-meals" className="btn-primary px-2">
        Get started
      </Link>
        </div>
      
    </section>
  );
};

export default Hero;
