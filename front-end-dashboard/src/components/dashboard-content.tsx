"use client"

import { DailyPracticePanel } from "@/components/daily-practice-panel"
import { FluencyOverviewPanel } from "@/components/fluency-overview-panel"
import { SpeakingAssistantPanel } from "@/components/speaking-assistant-panel"
import { LearningProgressPanel } from "@/components/learning-progress-panel"
import { MotivationPanel } from "@/components/motivation-panel"

export function DashboardContent() {
  return (
    <div className="space-y-4 md:space-y-6 w-full">
      {/* Top row - Daily Practice and Fluency Overview */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3 w-full">
        <div className="lg:col-span-2 w-full">
          <DailyPracticePanel />
        </div>
        <div className="lg:col-span-1 w-full">
          <FluencyOverviewPanel />
        </div>
      </div>

      {/* Bottom row - Speaking Assistant, Learning Progress, and Motivation */}
      <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
        <div className="w-full">
          <SpeakingAssistantPanel />
        </div>
        <div className="w-full">
          <LearningProgressPanel />
        </div>
        <div className="sm:col-span-2 lg:col-span-1 w-full">
          <MotivationPanel />
        </div>
      </div>
    </div>
  )
}
