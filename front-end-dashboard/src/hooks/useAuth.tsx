"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name?: string; email: string } | null>(
    null
  );
  const [isSignUp, setIsSignUp] = useState(false);
  const  router =useRouter() 
  const handleAuthSuccess = (userData: { name?: string; email: string }) => {
    setUser(userData);
    setIsAuthenticated(true);
    // Save to localStorage for persistence
    localStorage.setItem("fluentai-auth", JSON.stringify(userData));
  };

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);

    // Mock authentication - replace with real API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

      // Mock successful sign in
      handleAuthSuccess({
        email,
        name: "Miraj", // Mock user name
      });
      router.push('/dashboard')
    } catch (error) {
      console.error("Sign in failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (
    name: string,
    email: string,
    password: string
  ) => {
    setIsLoading(true);

    // Mock authentication - replace with real API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

      // Mock successful sign up
      handleAuthSuccess({
        email,
        name,
      });
      router.push('/dashboard')
    } catch (error) {
      console.error("Sign up failed:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return {
    handleAuthSuccess,
    handleSignIn,
    handleSignUp,
    isLoading
  };
};
