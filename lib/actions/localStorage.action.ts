'use client'
import { revalidatePath } from "next/cache";

interface Meal {
    _id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
  }
  
  interface CartItem {
    meal: Meal;
    quantity: number;
  }
  export function fetchLocalStorageCart():CartItem[] {
      try {
        const localStorageCartString = localStorage.getItem("cart");
        const localStorageCart = localStorageCartString
        ? JSON.parse(localStorageCartString)
        : [];
      return localStorageCart;
      } catch (err: any) {
        console.error("Error fetching local storage cart:", err);
        throw new Error("Error getting local storage cart!");
      };
  }
  
  export function addMealToLocalStorage(mealId: string): void {
    try {
      const localStorageCartString = localStorage.getItem("cart");
      let localStorageCart = localStorageCartString
        ? JSON.parse(localStorageCartString)
        : [];
  
      const existingCartItemIndex = localStorageCart.findIndex(
        (item: { meal: string; quantity: number }) => item.meal === mealId
      );
  
      if (existingCartItemIndex !== -1) {
        localStorageCart[existingCartItemIndex].quantity += 1;
      } else {
        localStorageCart.push({ meal: mealId, quantity: 1 });
      }
  
      localStorage.setItem("cart", JSON.stringify(localStorageCart));
      console.log("Meal added to the local storage cart successfully!");
    } catch (err) {
      console.error(err);
      throw new Error("Error!");
    }
  }
  export function deleteItemFromLocalStorage(mealId: string, path: string): void {
    try {
      const localStorageCartString = localStorage.getItem("cart");
      let localStorageCart = localStorageCartString
        ? JSON.parse(localStorageCartString)
        : [];
  
      const existingCartItemIndex = localStorageCart.findIndex(
        (item: { meal: string; quantity: number }) => item.meal === mealId
      );
  
      if (existingCartItemIndex !== -1) {
        localStorageCart.splice(existingCartItemIndex, 1); // Remove the item from the cart array
        localStorage.setItem("cart", JSON.stringify(localStorageCart));
        console.log("Item removed from the local storage cart successfully!");
        revalidatePath(path);
      } else {
        console.error("Item not found in the local storage cart.");
        throw new Error("Item not found!");
      }
    } catch (err) {
      console.error(err);
      throw new Error("Error!");
    }
  }
  
  export function increaseLocalMealQty(mealId: string, path: string): void {
    try {
      const localStorageCartString = localStorage.getItem("cart");
      let localStorageCart = localStorageCartString
        ? JSON.parse(localStorageCartString)
        : [];
  
      const existingCartItemIndex = localStorageCart.findIndex(
        (item: { meal: string; quantity: number }) => item.meal === mealId
      );
  
      if (existingCartItemIndex !== -1) {
        localStorageCart[existingCartItemIndex].quantity += 1;
        localStorage.setItem("cart", JSON.stringify(localStorageCart));
        console.log("Increased meal Qty!");
        revalidatePath(path);
      } else {
        console.log("Meal not found in the local storage cart.");
        throw new Error("Meal not found!");
      }
    } catch (err) {
      console.error(err);
      throw new Error("Error!");
    }
  }
  
  export function decreaseLocalMealQty(mealId: string, path: string): void {
    try {
      const localStorageCartString = localStorage.getItem("cart");
      let localStorageCart = localStorageCartString
        ? JSON.parse(localStorageCartString)
        : [];
  
      const existingCartItemIndex = localStorageCart.findIndex(
        (item: { meal: string; quantity: number }) => item.meal === mealId
      );
  
      if (existingCartItemIndex !== -1) {
        const currentQuantity = localStorageCart[existingCartItemIndex].quantity;
  
        if (currentQuantity > 1) {
          localStorageCart[existingCartItemIndex].quantity -= 1;
          localStorage.setItem("cart", JSON.stringify(localStorageCart));
          console.log("Decreased meal Qty!");
          revalidatePath(path);
        } else {
          localStorageCart.splice(existingCartItemIndex, 1);
          localStorage.setItem("cart", JSON.stringify(localStorageCart));
          console.log("Item Removed!");
          revalidatePath(path);
        }
      } else {
        console.error("Meal not found in the local storage cart.");
        throw new Error("Meal not found!");
      }
    } catch (err) {
      console.error(err);
      throw new Error("Failed!");
    }
  }