"use client"

import { DailyPracticePanel } from "@/app/(dashboard)/dashboard/_components/daily-practice-panel"
import { FluencyOverviewPanel } from "@/app/(dashboard)/dashboard/_components/fluency-overview-panel"
import { SpeakingAssistantPanel } from "@/app/(dashboard)/dashboard/_components/speaking-assistant-panel"
import { LearningProgressPanel } from "@/app/(dashboard)/dashboard/_components/learning-progress-panel"
import { MotivationPanel } from "@/app/(dashboard)/dashboard/_components/motivation-panel"
import { PersonalizedWelcomePanel } from "@/app/(dashboard)/dashboard/_components/personalized-welcome-panel"
import { useAppSelector } from "@/redux/hooks/hooks"
import { TOnboardingData } from "@/redux/feature/onBoarding/onBoardingType"

export function PersonalizedDashboardContent() {
    const { onboardingData } = useAppSelector((state) => state.onboarding);
  console.log(
    onboardingData
  );
  
  return (
    <div className="space-y-4 md:space-y-6 w-full">
      {/* Personalized Welcome */}
      <PersonalizedWelcomePanel onboardingData={onboardingData as TOnboardingData} />

      {/* Top row - Daily Practice and Fluency Overview */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3 w-full">
        <div className="lg:col-span-2 w-full">
          <DailyPracticePanel onboardingData={onboardingData  as TOnboardingData} />
        </div>
        <div className="lg:col-span-1 w-full">
          <FluencyOverviewPanel />
        </div>
      </div>

      {/* Bottom row - Speaking Assistant, Learning Progress, and Motivation */}
      <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
        <div className="w-full">
          <SpeakingAssistantPanel onboardingData={onboardingData  as TOnboardingData} />
        </div>
        <div className="w-full">
          <LearningProgressPanel onboardingData={onboardingData  as TOnboardingData} />
        </div>
        <div className="sm:col-span-2 lg:col-span-1 w-full">
          <MotivationPanel />
        </div>
      </div>
    </div>
  )
}
