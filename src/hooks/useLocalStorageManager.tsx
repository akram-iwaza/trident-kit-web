import React, { useCallback } from "react";

// Utility function to get data from localStorage
const getFromLocalStorage = <T,>(key: string): T | null => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? (JSON.parse(storedData) as T) : null;
  } catch (error) {
    console.error(
      `Error getting data from localStorage for key "${key}":`,
      error
    );
    return null;
  }
};

// Utility function to add or update data in localStorage
const addToLocalStorage = <T,>(key: string, data: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`Data added to localStorage for key "${key}":`, data);
  } catch (error) {
    console.error(`Error adding data to localStorage for key "${key}":`, error);
  }
};

// Utility function to remove data from localStorage
const removeFromLocalStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
    console.log(`Data removed from localStorage for key "${key}".`);
  } catch (error) {
    console.error(
      `Error removing data from localStorage for key "${key}":`,
      error
    );
  }
};

const useLocalStorageManager = <T extends { id: number }>() => {
  const manageLocalStorage = useCallback(
    (
      action: "get" | "add" | "edit" | "delete" | "remove",
      storageKey: string,
      data?: T | number[] // Either task data or list of task IDs to delete
    ) => {
      switch (action) {
        case "get":
          return getFromLocalStorage<T[]>(storageKey);
        case "add":
          if (data) {
            const tasks = getFromLocalStorage<T[]>(storageKey) || [];
            addToLocalStorage(storageKey, [...tasks, data]);
          } else {
            console.error('Data must be provided for "add" action.');
          }
          break;
        case "edit":
          if (data && (data as T).id !== undefined) {
            const tasks = getFromLocalStorage<T[]>(storageKey) || [];
            const updatedTasks = tasks.map((task) =>
              task.id === (data as T).id ? (data as T) : task
            );
            addToLocalStorage(storageKey, updatedTasks);
          } else {
            console.error(
              'Valid task data must be provided for "edit" action.'
            );
          }
          break;
        case "delete":
          if (Array.isArray(data)) {
            const tasks = getFromLocalStorage<T[]>(storageKey) || [];
            const updatedTasks = tasks.filter(
              (task) => !data.includes(task.id)
            );
            addToLocalStorage(storageKey, updatedTasks);
          } else {
            console.error('Task IDs must be provided for "delete" action.');
          }
          break;
        default:
          console.error("Invalid action provided.");
          break;
      }
    },
    []
  );

  return manageLocalStorage;
};

export default useLocalStorageManager;
