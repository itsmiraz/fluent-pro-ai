"use client"

import { PersonalizedDashboardContent } from "./_components/personalized-dashboard-content"

export default function Dashboard() {
 


  return (
    <div className="flex min-h-screen bg-background">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <PersonalizedDashboardContent  />
      </div>
    </div>
  )
}
