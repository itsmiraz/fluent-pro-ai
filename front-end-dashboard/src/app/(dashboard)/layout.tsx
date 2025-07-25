"use client";
import type React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/top-bar";
import { redirect, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import {
  resetOnboardingData,
  setOnboardingData,
} from "@/redux/feature/onBoarding/onBoardingSlice";


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
 

  const { onboardingData } = useAppSelector((state) => state.onboarding);

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);

    const savedData = localStorage.getItem("fluentai-onboarding");
    if (!onboardingData) {
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (parsed) {
            dispatch(setOnboardingData(parsed));
            setLoading(false);
          } else {
            router.push("/onboarding-flow");
          }
        } catch (error) {
          console.error("Error parsing onboarding data:", error);
          router.push("/onboarding-flow");
        }
      } else {
        router.push("/onboarding-flow");
      }
    } else {
      setLoading(false);
    }
  }, [dispatch, router]);
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
    dispatch(resetOnboardingData());
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
            {loading ? "Loading..." : <>{children}</>}
          </main>
        </div>
      </div>
    </html>
  );
}
