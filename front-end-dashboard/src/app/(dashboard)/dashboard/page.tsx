"use client"

import { useState, useEffect } from "react"
import { PersonalizedDashboardContent } from "@/components/personalized-dashboard-content"
import { OnboardingFlow, type OnboardingData } from "@/components/onboarding/onboarding-flow"
import { AuthPage } from "@/components/auth/auth-page"

export default function Dashboard() {
  // const [activeView, setActiveView] = useState("dashboard")
  // const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  // const [practiceScenarioId, setPracticeScenarioId] = useState<number | null>(null)
  // const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(true)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Check for existing onboarding data
  

  const handleOnboardingComplete = (data: OnboardingData) => {
    setOnboardingData(data)
    setShowOnboarding(false)
    // Save to localStorage for persistence
    localStorage.setItem("fluentai-onboarding", JSON.stringify(data))
  }

  // const handleStartPractice = (scenarioId: number) => {
  //   setPracticeScenarioId(scenarioId)
  // }

  // const handleBackToSituations = () => {
  //   setPracticeScenarioId(null)
  // }

  // const handleVideoSelect = (videoId: number) => {
  //   setSelectedVideoId(videoId)
  // }

  // const handleBackToVideoLessons = () => {
  //   setSelectedVideoId(null)
  // }

  // const handleToggleSidebar = () => {
  //   if (isMobile) {
  //     setMobileMenuOpen(!mobileMenuOpen)
  //   } else {
  //     setSidebarCollapsed(!sidebarCollapsed)
  //   }
  // }

  // const handleMobileClose = () => {
  //   setMobileMenuOpen(false)
  // }


  // Show authentication if not authenticated
  // if (!isAuthenticated) {
  //   return <AuthPage onAuthSuccess={handleAuthSuccess} />
  // }

  // Show onboarding if no data exists
  if (showOnboarding || !onboardingData) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <PersonalizedDashboardContent onboardingData={onboardingData} />
      </div>
    </div>
  )
}
