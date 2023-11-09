import feature1 from "@/public/feature1.jpg";
import feature2 from "@/public/feature2.jpg";
import feature3 from "@/public/feature3.jpg";
import youtube from "@/public/youtube_logo.svg";
import slack from "@/public/slack_logo.svg";
import instagram from "@/public/instagram_logo.svg";
import x from "@/public/x_logo.svg";
import person1 from "@/public/person1.jpg";
import person2 from "@/public/person2.jpg";
import person3 from "@/public/person3.jpg";
import person4 from "@/public/person4.jpg";
import person5 from "@/public/person5.jpg";

export const featureItems = [
  {
    imgUrl: feature1,
    title: "We bring you Recipies from all around the globe.",
    desc: "We put all of our heart and soul into bringing you the best spicy meals this world has to offer to satisfy you chilly loving tastebuds through unique menus every week so that you'll never run out of options.",
  },
  {
    imgUrl: feature2,
    title: "Only the spiciest delicacies to lit you tastebuds on FIRE.",
    desc: "Every meal you recieve is handpicked from different parts of the world and is checked by our experts to ensure the every bite packs a fiery punch of flavours in you mouth.",
  },
  {
    imgUrl: feature3,
    title: "Fresh & Quality checked raw materials only.",
    desc: "A good meal always starts with fresh and quality raw materials. We provide you with healthy and quality checked raw materials to make sure you're getting the best out of every meal.",
  },
];

export const footerLinks = [
  {
    title: "Navigation",
    links: [
      { name: "Home", url: "/" },
      { name: "On The Menu", url: "/on-the-menu" },
    ],
  },
  {
    title: "Other Links",
    links: [
      { name: "FAQs", url: "/faqs" },
      { name: "Our Ingredients", url: "/ingredients-lists" },
      { name: "Gift Cards", url: "/gift-cards" },
    ],
  },
  {
    title: "Term & Conditions",
    links: [
      { name: "Press", url: "/press" },
      { name: "Terms of Use", url: "/terms-of-use" },
      { name: "Purchase Terms & Conditions", url: "/purchase-terms" },
    ],
  },
];

export const socialMedia = [
  { name: "YouTube", icon: youtube },
  { name: "Slack", icon: slack },
  { name: "Instagram", icon: instagram },
  { name: "X", icon: x },
];

export const dummyReviews = [
  {
    userName: "User 1",
    reviewTitle: "Great Experience",
    rating: 5,
    imgUrl: person1,
    reviewDescription:
      "Had a wonderful experience at this place. Highly recommended.",
  },
  {
    userName: "User 2",
    reviewTitle: "Good Service",
    rating: 4,
    imgUrl: person2,
    reviewDescription:
      "The service was excellent, and the staff was very friendly.",
  },
  {
    userName: "User 3",
    reviewTitle: "Average",
    rating: 3,
    imgUrl: person3,
    reviewDescription: "The experience was just okay. It could be better.",
  },
  {
    userName: "User 4",
    reviewTitle: "Not Recommended",
    rating: 1,
    imgUrl: person4,
    reviewDescription: "I would not recommend this place. Bad experience.",
  },
  {
    userName: "User 5",
    reviewTitle: "Excellent Food",
    rating: 5,
    imgUrl: person5,
    reviewDescription: "The food here is amazing. Will definitely come back.",
  },
];

export const meals = [
  {
    title: "Sautéed Ground Pork over Jasmine Rice",
    ingredients:
      "Toasted Peanuts & Quick-Pickled Cucumber SaladToasted Peanuts & Quick-Pickled Cucumber Salad",
    description: "Gingery pork, crunchy cucumbers, and toasty peanuts",
    category: "Lunch",
    price: 19.99,
    cookingTime: 25,
    servings: 2,
    imageUrl: "Sautéed_Ground_Pork_over_Jasmine_Rice.jpg",
    topMeal: false,
  },
  {
    title: "French Toast",
    ingredients: "Bread slices, eggs, milk, cinnamon, syrup",
    description: "Crispy French toast with a hint of cinnamon and syrup",
    category: "Breakfast",
    price: 5.99,
    cookingTime: 15,
    servings: 2,
    imageUrl: "French_Toast.jpg",
    topMeal: true,
  },
  {
    title: "Grilled Shrimp",
    ingredients:
      "Garlic Cloves, Italian Seasoning, Dijon mustard & Lemon Juice",
    description: "With chopped parsley",
    category: "Dinner",
    price: 23.99,
    cookingTime: 35,
    servings: 1,
    imageUrl: "Grilled_Shrimp.jpg",
    topMeal: false,
  },
  {
    title: "Chilly Chicken",
    ingredients: "Chicken, Bell Peppers, Garlic, Chilli and Soya Sauce",
    description: "With roasted chilly and veggies",
    category: "Lunch",
    price: 19.99,
    cookingTime: 25,
    servings: 2,
    imageUrl: "Chilly_Chicken.jpg",
    topMeal: true,
  },
  {
    title: "Spicy Spaghetti",
    ingredients:
      "Pasta, Olive Oil, Cherry Tomatoes, Chilli Peppers, Herbs and Spices",
    description: "Italian cuisine",
    category: "Lunch",
    price: 20.99,
    cookingTime: 15,
    servings: 3,
    imageUrl: "Spicy_Spaghetti.jpg",
    topMeal: false,
  },
  {
    title: "Black Bean Tostadas",
    ingredients: "Corn Salsa, Avocado Ranch, Pickled Red Onions",
    description: "With avocado and corn salsa",
    category: "Lunch",
    price: 19.99,
    cookingTime: 25,
    servings: 2,
    imageUrl: "Black_Bean_Tostadas.jpg",
    topMeal: false,
  },
  {
    title: "Arroz Con Pollo",
    ingredients:
      "Freshly ground black pepper, ground cumin, onion, bell peppers, garlic cloves",
    description: "low-sodium chicken, with diced onions and cilantro",
    category: "Dinner",
    price: 15.99,
    cookingTime: 15,
    servings: 2,
    imageUrl: "Arroz_Con_Pollo.jpg",
    topMeal: false,
  },
  {
    title: "Chicken Alfredo",
    ingredients:
      "Fettuccine pasta, chicken breast, Alfredo sauce, garlic, Parmesan cheese",
    description: "Creamy Alfredo pasta with grilled chicken",
    category: "Dinner",
    price: 17.99,
    cookingTime: 30,
    servings: 2,
    imageUrl: "Chicken_Alfredo.jpg",
    topMeal: true,
  },
  {
    title: "Mango Salsa Salmon",
    ingredients: "Salmon fillet, mango salsa, lime juice, cilantro",
    description: "Grilled salmon with fresh mango salsa",
    category: "Dinner",
    price: 22.99,
    cookingTime: 20,
    servings: 2,
    imageUrl: "Mango_Salsa_Salmon.jpg",
    topMeal: true,
  },
  {
    title: "Caprese Salad",
    ingredients: "Tomatoes, fresh mozzarella, basil leaves, balsamic glaze",
    description: "Classic Italian salad with a balsamic twist",
    category: "Lunch",
    price: 14.99,
    cookingTime: 10,
    servings: 2,
    imageUrl: "Caprese_Salad.jpg",
    topMeal: false,
  },
  {
    title: "Vegetable Stir-Fry",
    ingredients: "Assorted vegetables, tofu, soy sauce, ginger, garlic",
    description: "Healthy and delicious vegetable stir-fry",
    category: "Lunch",
    price: 16.99,
    cookingTime: 20,
    servings: 3,
    imageUrl: "Vegetable_Stir-Fry.jpg",
    topMeal: false,
  },
  {
    title: "Beef Tacos",
    ingredients:
      "Ground beef, taco seasoning, tortillas, lettuce, cheese, salsa",
    description: "Tasty and spicy beef tacos",
    category: "Dinner",
    price: 15.99,
    cookingTime: 25,
    servings: 3,
    imageUrl: "Beef_Tacos.jpg",
    topMeal: false,
  },
  {
    title: "Penne alla Vodka",
    ingredients:
      "Penne pasta, vodka sauce, heavy cream, Parmesan cheese, red pepper flakes",
    description: "Creamy and slightly spicy penne pasta",
    category: "Dinner",
    price: 18.99,
    cookingTime: 35,
    servings: 2,
    imageUrl: "Penne_alla_Vodka.jpg",
    topMeal: false,
  },
  {
    title: "Lobster Bisque",
    ingredients: "Lobster meat, heavy cream, butter, sherry, garlic, thyme",
    description: "Rich and creamy lobster bisque",
    category: "Specials",
    price: 25.99,
    cookingTime: 40,
    servings: 2,
    imageUrl: "Lobster_Bisque.jpg",
    topMeal: true,
  },
  {
    title: "Mushroom Risotto",
    ingredients:
      "Arborio rice, mushrooms, shallots, white wine, Parmesan cheese",
    description: "Creamy mushroom risotto with a hint of white wine",
    category: "Specials",
    price: 19.99,
    cookingTime: 40,
    servings: 2,
    imageUrl: "Mushroom_Risotto.jpg",
    topMeal: true,
  },
  {
    title: "Eggplant Parmesan",
    ingredients: "Sliced eggplant, marinara sauce, mozzarella cheese, basil",
    description:
      "Delicious layers of eggplant with marinara sauce and melted mozzarella cheese",
    category: "Specials",
    price: 20.99,
    cookingTime: 45,
    servings: 2,
    imageUrl: "Eggplant_Parmesan.jpg",
    topMeal: false,
  },
  {
    title: "Breakfast Burrito",
    ingredients: "Eggs, sausage, cheese, bell peppers, tortilla",
    description: "Scrambled eggs, sausage, and cheese wrapped in a tortilla",
    category: "Breakfast",
    price: 6.99,
    cookingTime: 20,
    servings: 1,
    imageUrl: "Breakfast_Burrito.jpg",
    topMeal: false,
  },
  {
    title: "Pancakes and Bacon",
    ingredients: "Pancake mix, bacon strips, maple syrup",
    description: "Fluffy pancakes with crispy bacon and maple syrup",
    category: "Breakfast",
    price: 8.99,
    cookingTime: 25,
    servings: 2,
    imageUrl: "Pancakes_and_Bacon.jpg",
    topMeal: false,
  },
  {
    title: "Veggie Omelette",
    ingredients: "Eggs, bell peppers, onions, tomatoes, cheese",
    description: "Omelette filled with fresh vegetables and cheese",
    category: "Breakfast",
    price: 7.99,
    cookingTime: 15,
    servings: 1,
    imageUrl: "Veggie_Omelette.jpg",
    topMeal: false,
  },
  {
    title: "Greek Yogurt Parfait",
    ingredients: "Greek yogurt, granola, mixed berries, honey",
    description:
      "Creamy Greek yogurt with crunchy granola, fresh berries, and honey",
    category: "Breakfast",
    price: 4.99,
    cookingTime: 5,
    servings: 1,
    imageUrl: "Greek_Yogurt_Parfait.jpg",
    topMeal: false,
  },
];
