import React from "react";
import MenuCard from "./MenuCard";
import { getTopMeals } from "@/lib/actions/meals.actions";

const TopPicks = async () => {
  const topPicks = await getTopMeals();
  if(topPicks){
    return (
      <section  className="flex flex-col justify-center items-center px-2 py-16">
        <h2 id='top-meals' className="text-[50px] font-extrabold text-dark uppercase">
          Top Picks
        </h2>
        <div className="bg-primary h-[2px] w-[80px]"></div>
        <div className="mt-14 w-full card-wrapper">
          {topPicks.map((meal: any) => (
            <MenuCard
              key={meal._id}
              id={meal._id.toString()}
              title={meal.title}
              description={meal.description}
              price={`${meal.price}`}
              imageUrl={meal.imageUrl}
            />
            
          ))}
        </div>
      </section>
    );
  }
  else {
    return <section  className="flex flex-col justify-center items-center px-2 py-16">
    <h2 id='top-meals' className="text-[30px] font-semibold text-dark">
      No Meals Found!
    </h2>
  </section>
  }
};

export default TopPicks;
