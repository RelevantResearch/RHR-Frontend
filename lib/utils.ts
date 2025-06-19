import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// utils/localStorage.js

// Save data to localStorage
// export const setToLocalStorage = (key: string, value: string) => {
//   try {
//     const serializedValue = JSON.stringify(value);
//     localStorage.setItem(key, serializedValue);
//   } catch (err) {
//     console.error("Error setting localStorage", err);
//   }
// };
export const setToLocalStorage = (key: string, value: any) => {
  try {
    const serializedValue =
      typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (err) {
    console.error("Error setting localStorage", err);
  }
};

export const getFromLocalStorage = (key: string) => {
  try {
    const value = localStorage.getItem(key);
    // console.log("value:", value)

    if (!value) return null;

    try {
      // Try parsing as JSON
      return JSON.parse(value);
    } catch {
      // If it's not JSON, return the raw string (like JWT)
      return value;
    }

  } catch (err) {
    console.error("Error getting localStorage", err);
    return null;
  }
};


// Optional: Remove item
export const removeFromLocalStorage = (key: string) => {
  try {
    localStorage.removeItem('user');
  } catch (err) {
    console.error("Error removing from localStorage", err);
  }
};
