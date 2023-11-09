import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  cookingTime: {
    type: Number,
    required: true,
  },
  servings: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  topMeal: {
    type: Boolean,
    required: true,
  },
});

const Meal = mongoose.models.Meal || mongoose.model("Meal", mealSchema);

export default Meal;
