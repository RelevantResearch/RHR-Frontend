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
// // };
// export const setToLocalStorage = (key: string, value: any) => {
//   try {
//     const serializedValue =
//       typeof value === "string" ? value : JSON.stringify(value);
//     localStorage.setItem(key, serializedValue);
//   } catch (err) {
//     console.error("Error setting localStorage", err);
//   }
// };


// // Get data from localStorage
// export const getFromLocalStorage = (key: string) => {
//   try {
//     const value = localStorage.getItem(key);
//     return value ? JSON.parse(value) : null;
//   } catch (err) {
//     console.error("Error getting localStorage", err);
//     return null;
//   }
// };

// // Optional: Remove item
// export const removeFromLocalStorage = (key: string) => {
//   try {
//     localStorage.removeItem(key);
//   } catch (err) {
//     console.error("Error removing from localStorage", err);
//   }
// };
// utils.ts or utils/localStorage.ts

export const setToLocalStorage = (key: string, value: any) => {
  try {
    const serializedValue =
      typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (err) {
    console.error("Error setting localStorage:", err);
  }
};

export const getFromLocalStorage = (key: string) => {
  try {
    const value = localStorage.getItem(key);
    if (!value) return null;

    // Only parse if value is likely JSON
    if (value.startsWith("{") || value.startsWith("[")) {
      return JSON.parse(value);
    }

    // Return raw string (like token)
    return value;
  } catch (err) {
    console.error("Error getting localStorage:", err);
    return null;
  }
};

export const removeFromLocalStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error("Error removing from localStorage:", err);
  }
};
