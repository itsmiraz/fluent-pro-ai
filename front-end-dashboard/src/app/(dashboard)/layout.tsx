"use client";
import type React from "react";
import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";
import { useEffect, useState } from "react";
import { OnboardingData } from "@/components/onboarding/onboarding-flow";
import { TopBar } from "@/components/top-bar";
import { ReduxProvider } from "@/lib/providers";
import { useRouter } from "next/navigation";

// export const metadata: Metadata = {
//   title: "FluentAI - English Learning Dashboard",
//   description: "AI-powered English fluency learning platform",
//     generator: 'v0.dev'
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [practiceScenarioId, setPracticeScenarioId] = useState<number | null>(
    null
  );
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(
    null
  );
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name?: string; email: string } | null>(
    null
  );
  useEffect(() => {
    // Check for existing authentication
    const savedAuth = localStorage.getItem("fluentai-auth");
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        setUser(parsed);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing auth data:", error);
      }
    }

    const savedData = localStorage.getItem("fluentai-onboarding");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setOnboardingData(parsed);
        setShowOnboarding(false);
      } catch (error) {
        console.error("Error parsing onboarding data:", error);
      }
    }
  }, []);
  const handleMobileClose = () => {
    setMobileMenuOpen(false);
  };

  const handleToggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };
  const handleSignOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    setOnboardingData(null);
    setShowOnboarding(true);
    // Clear localStorage
    localStorage.removeItem("fluentai-auth");
    localStorage.removeItem("fluentai-onboarding");
    router.push("/sign-in");
  };

  return (
    <html lang="en">
      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <AppSidebar
          onToggle={() => {}}
          activeView={
            practiceScenarioId
              ? "situations"
              : selectedVideoId
              ? "video-lessons"
              : activeView
          }
          setActiveView={setActiveView}
          collapsed={sidebarCollapsed}
          isMobile={isMobile}
          mobileOpen={mobileMenuOpen}
          onMobileClose={handleMobileClose}
        />
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar
            onToggleSidebar={handleToggleSidebar}
            sidebarCollapsed={sidebarCollapsed}
            isMobile={isMobile}
            onSignOut={handleSignOut}
          />
          <main className="flex-1 p-3 md:p-4 lg:p-6 overflow-auto">
            {" "}
            {children}
          </main>
        </div>
      </div>
    </html>
  );
}
