import React from "react";
import MenuCard from "./MenuCard";

const TopPicks = () => {
  return (
    <section className="flex flex-col justify-center items-center py-14">
      <h2 className="text-[50px] font-extrabold text-dark uppercase">Top Picks</h2>
      <div className="bg-primary h-[2px] w-[80px]"></div>
      <div className="mt-10 w-full card-wrapper">
        <MenuCard />
        <MenuCard />
        <MenuCard />
      </div>
    </section>
  );
};

export default TopPicks;
