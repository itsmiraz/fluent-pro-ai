"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import { PersonalizedDashboardContent } from "@/components/personalized-dashboard-content"
import { TalkWithAIContent } from "@/components/talk-with-ai-content"
import { VocabularyContent } from "@/components/vocabulary-content"
import { SituationsContent } from "@/components/situations-content"
import { SituationPractice } from "@/components/situation-practice"
import { ProgressStatsContent } from "@/components/progress-stats-content"
import { PronunciationContent } from "@/components/pronunciation-content"
import { VideoLessonsContent } from "@/components/video-lessons-content"
import { VideoPlayerPage } from "@/components/video-player-page"
import { OnboardingFlow, type OnboardingData } from "@/components/onboarding/onboarding-flow"
import { AuthPage } from "@/components/auth/auth-page"

export default function Dashboard() {
  const [activeView, setActiveView] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [practiceScenarioId, setPracticeScenarioId] = useState<number | null>(null)
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ name?: string; email: string } | null>(null)

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
  useEffect(() => {
    // Check for existing authentication
    const savedAuth = localStorage.getItem("fluentai-auth")
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth)
        setUser(parsed)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error parsing auth data:", error)
      }
    }

    const savedData = localStorage.getItem("fluentai-onboarding")
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setOnboardingData(parsed)
        setShowOnboarding(false)
      } catch (error) {
        console.error("Error parsing onboarding data:", error)
      }
    }
  }, [])

  const handleOnboardingComplete = (data: OnboardingData) => {
    setOnboardingData(data)
    setShowOnboarding(false)
    // Save to localStorage for persistence
    localStorage.setItem("fluentai-onboarding", JSON.stringify(data))
  }

  const handleStartPractice = (scenarioId: number) => {
    setPracticeScenarioId(scenarioId)
  }

  const handleBackToSituations = () => {
    setPracticeScenarioId(null)
  }

  const handleVideoSelect = (videoId: number) => {
    setSelectedVideoId(videoId)
  }

  const handleBackToVideoLessons = () => {
    setSelectedVideoId(null)
  }

  const handleToggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen)
    } else {
      setSidebarCollapsed(!sidebarCollapsed)
    }
  }

  const handleMobileClose = () => {
    setMobileMenuOpen(false)
  }

  const handleAuthSuccess = (userData: { name?: string; email: string }) => {
    setUser(userData)
    setIsAuthenticated(true)
    // Save to localStorage for persistence
    localStorage.setItem("fluentai-auth", JSON.stringify(userData))
  }

  const handleSignOut = () => {
    setUser(null)
    setIsAuthenticated(false)
    setOnboardingData(null)
    setShowOnboarding(true)
    // Clear localStorage
    localStorage.removeItem("fluentai-auth")
    localStorage.removeItem("fluentai-onboarding")
  }

  // Show authentication if not authenticated
  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />
  }

  // Show onboarding if no data exists
  if (showOnboarding || !onboardingData) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />
  }

  const renderContent = () => {
    // If we're in practice mode, show the practice component
    if (practiceScenarioId) {
      return <SituationPractice scenarioId={practiceScenarioId} onBack={handleBackToSituations} />
    }

    // If we're watching a video, show the video player
    if (selectedVideoId) {
      return (
        <VideoPlayerPage
          videoId={selectedVideoId}
          onBack={handleBackToVideoLessons}
          onVideoSelect={handleVideoSelect}
        />
      )
    }

    switch (activeView) {
      case "practice-room":
        return <TalkWithAIContent onboardingData={onboardingData} />
      case "pronunciation":
        return <PronunciationContent />
      case "vocabulary":
        return <VocabularyContent />
      case "situations":
        return <SituationsContent onStartPractice={handleStartPractice} />
      case "video-lessons":
        return <VideoLessonsContent onVideoSelect={handleVideoSelect} />
      case "ielts-mode":
        return (
          <div className="flex items-center justify-center min-h-[300px] md:min-h-[400px]">
            <div className="text-center px-4">
              <h2 className="text-xl md:text-2xl font-bold mb-2">IELTS Mode</h2>
              <p className="text-sm md:text-base text-muted-foreground">Coming Soon!</p>
            </div>
          </div>
        )
      case "progress-stats":
        return <ProgressStatsContent />
      case "settings":
        return (
          <div className="flex items-center justify-center min-h-[300px] md:min-h-[400px]">
            <div className="text-center px-4">
              <h2 className="text-xl md:text-2xl font-bold mb-2">Settings</h2>
              <p className="text-sm md:text-base text-muted-foreground">Coming Soon!</p>
            </div>
          </div>
        )
      default:
        return <PersonalizedDashboardContent onboardingData={onboardingData} />
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <AppSidebar
        activeView={practiceScenarioId ? "situations" : selectedVideoId ? "video-lessons" : activeView}
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
        <main className="flex-1 p-3 md:p-4 lg:p-6 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  )
}
