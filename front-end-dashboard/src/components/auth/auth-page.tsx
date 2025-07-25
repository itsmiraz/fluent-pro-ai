"use client"

import { useState } from "react"
// import { SignInForm } from "./sign-in-form"
// import { SignUpForm } from "./sign-up-form"

interface AuthPageProps {
  onAuthSuccess: (userData: { name?: string; email: string }) => void
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
 

  return (
    <div>
      <div>
        {/* {isSignUp ? (
          <SignUpForm onSignUp={handleSignUp} onSwitchToSignIn={() => setIsSignUp(false)} isLoading={isLoading} />
        ) : (
          <SignInForm onSignIn={handleSignIn} onSwitchToSignUp={() => setIsSignUp(true)} isLoading={isLoading} />
        )} */}
      </div>
    </div>
  )
}
