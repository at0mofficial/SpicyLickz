"use server";

import Meal from "../models/meal.model";
import { connectToDB } from "../mongoose";
import { meals } from "@/constants";

export async function uploadAllMeals() {
  const allMeals = meals;

  try {
    connectToDB();
    allMeals.forEach(async (meal) => {
      const existingMeal = await Meal.findOne({ title: meal.title });
      if (!existingMeal) {
        const newMeal = new Meal(meal);
        await newMeal.save();
        console.log(`Uploaded: ${meal.title}`);
      } else {
        existingMeal.title = meal.title;
        existingMeal.ingredients = meal.ingredients;
        existingMeal.description = meal.description;
        existingMeal.category = meal.category;
        existingMeal.price = meal.price;
        existingMeal.cookingTime = meal.cookingTime;
        existingMeal.servings = meal.servings;
        existingMeal.imageUrl = meal.imageUrl;
        existingMeal.topMeal = meal.topMeal;
        await existingMeal.save();
        console.log(`Updated: ${meal.title}`);
      }
    });
    console.log(`All meals uploaded`);
  } catch (err: any) {
    throw new Error(`Failded to upload all meals: ${err.message}`);
  }
}

export async function getTopMeals() {
  try {
    connectToDB();
    const topMeals = await Meal.find({ topMeal: true });
    return topMeals;
  } catch (err: any) {
    throw new Error(`Failded to fetch top meals: ${err.message}`);
  }
}

export async function getMealsByCategory() {
  try {
    connectToDB();

    const mealsByCategory = await Meal.aggregate([
      {
        $group: {
          _id: "$category",
          meals: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field
          category: "$_id",
          meals: 1,
        },
      },
    ]);
    const categoryOrder = ["Specials", "Breakfast", "Lunch", "Dinner"];
    const orderedMealsByCategory = categoryOrder.map((category) =>
      mealsByCategory.find((categoryData) => (
        categoryData.category === category
      ))
    ).filter((categoryData) => categoryData !== undefined);
    return orderedMealsByCategory;
  } catch (err: any) {
    throw new Error(`Failed to get meals by category: ${err.message}`);
  }
}
