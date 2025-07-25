"use client";
import React, { useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name?: string; email: string } | null>(
    null
  );

  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      {" "}
      <main className="w-full max-w-md"> {children}</main>
    </div>
  );
};

export default Layout;
