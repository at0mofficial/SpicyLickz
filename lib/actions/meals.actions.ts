"use server";

import Meal from "../models/meal.model";
import { connectToDB } from "../mongoose";
import { meals } from "@/constants";
interface Meal {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  // Add other properties as needed
}
interface MealsByCategory {
  category: string;
  meals: Meal[];
}

export async function uploadAllMeals(): Promise<void> {
  return new Promise(async (resolve, reject) => {
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
      resolve();
    } catch (err: any) {
      console.error(`${err}`);
      reject(new Error(`Failded to upload all meals!`));
    }
  });
}

export async function getTopMeals(): Promise<Meal[]> {
  return new Promise(async (resolve, reject) => {
    try {
      connectToDB();
      const topMeals = await Meal.find({ topMeal: true });
      resolve(topMeals);
    } catch (err: any) {
      console.error(`${err}`);
      reject(new Error(`Failded to fetch top meals!`));
    }
  });
}

export async function getMealsByCategory(): Promise<MealsByCategory[]> {
  return new Promise(async (resolve, reject) => {
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
      const orderedMealsByCategory = categoryOrder
        .map((category) =>
          mealsByCategory.find(
            (categoryData) => categoryData.category === category
          )
        )
        .filter((categoryData) => categoryData !== undefined);
      resolve(orderedMealsByCategory);
    } catch (err: any) {
      console.error(`${err}`);
      reject(new Error(`Failed to get meals by category!`));
    }
  });
}
