"use client"

import { useState } from "react"
import { SignInForm } from "./sign-in-form"
import { SignUpForm } from "./sign-up-form"

interface AuthPageProps {
  onAuthSuccess: (userData: { name?: string; email: string }) => void
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true)

    // Mock authentication - replace with real API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call

      // Mock successful sign in
      onAuthSuccess({
        email,
        name: "Miraj", // Mock user name
      })
    } catch (error) {
      console.error("Sign in failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (name: string, email: string, password: string) => {
    setIsLoading(true)

    // Mock authentication - replace with real API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call

      // Mock successful sign up
      onAuthSuccess({
        email,
        name,
      })
    } catch (error) {
      console.error("Sign up failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isSignUp ? (
          <SignUpForm onSignUp={handleSignUp} onSwitchToSignIn={() => setIsSignUp(false)} isLoading={isLoading} />
        ) : (
          <SignInForm onSignIn={handleSignIn} onSwitchToSignUp={() => setIsSignUp(true)} isLoading={isLoading} />
        )}
      </div>
    </div>
  )
}
