import MenuCard from "@/components/MenuCard";
import { getMealsByCategory } from "@/lib/actions/meals.actions";

const OnTheMenu = async () => {
  const mealsByCategory = await getMealsByCategory();
  return (
    <div>
      {mealsByCategory.map((item) => (
        <section key={item.category} className="flex flex-col justify-center items-center px-3 lg:px-16 py-16">
          <h2 className="text-[50px] font-extrabold text-dark uppercase">
            {item.category}
          </h2>
          <div className="bg-primary h-[2px] w-[80px]"></div>
          <div className="mt-14 w-full card-wrapper">
            {item.meals.map((meal:any) =>
            (
              <MenuCard
                key={meal._id.toString()}
                id={meal._id.toString()}
                title={meal.title}
                description={meal.description}
                price={meal.price}
                imageUrl={meal.imageUrl}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default OnTheMenu;
