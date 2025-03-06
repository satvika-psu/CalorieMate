import React, { createContext, useState, useEffect } from "react";

// Create a context
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  // Initialize userEmail state, check localStorage for persisted email
  const [userEmail, setUserEmail] = useState(() => {
    const savedEmail = localStorage.getItem("userEmail");
    return savedEmail || ""; // If no email found, default to an empty string
  });

  // Update localStorage whenever userEmail changes
  useEffect(() => {
    if (userEmail) {
      localStorage.setItem("userEmail", userEmail); // Persist userEmail to localStorage
    } else {
      localStorage.removeItem("userEmail"); // Remove userEmail from localStorage when it's cleared
    }
  }, [userEmail]);

  return (
    <UserContext.Provider value={{ userEmail, setUserEmail }}>
      {children}
    </UserContext.Provider>
  );
};
