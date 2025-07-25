"use client"

import { useState } from "react"
import { Flame, Trophy, Star, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function MotivationPanel() {
  const [showConfetti, setShowConfetti] = useState(false)

  const streakDays = 7
  const badges = [
    { name: "First Steps", icon: Star, earned: true },
    { name: "Week Warrior", icon: Flame, earned: true },
    { name: "Grammar Master", icon: Trophy, earned: false },
    { name: "Speaking Pro", icon: Zap, earned: false },
  ]

  const handleStreakBoost = () => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  return (
    <Card className="h-full relative overflow-hidden">
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-4 left-4 text-2xl animate-bounce">🎉</div>
          <div className="absolute top-8 right-6 text-2xl animate-bounce" style={{ animationDelay: "0.2s" }}>
            ✨
          </div>
          <div className="absolute bottom-8 left-8 text-2xl animate-bounce" style={{ animationDelay: "0.4s" }}>
            🎊
          </div>
          <div className="absolute bottom-4 right-4 text-2xl animate-bounce" style={{ animationDelay: "0.6s" }}>
            🌟
          </div>
        </div>
      )}

      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Keep Going!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Streak Motivation */}
        <div className="text-center space-y-3 p-4 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
          <div className="text-3xl">🔥</div>
          <div>
            <p className="text-lg font-bold">{streakDays} Day Streak!</p>
            <p className="text-sm text-muted-foreground">Keep your streak alive! Complete today's tasks.</p>
          </div>
          <Button
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            onClick={handleStreakBoost}
          >
            <Zap className="h-4 w-4 mr-2" />
            Boost Streak
          </Button>
        </div>

        {/* Badges */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Recent Badges</h4>
          <div className="grid grid-cols-2 gap-2">
            {badges.map((badge) => {
              const Icon = badge.icon
              return (
                <div
                  key={badge.name}
                  className={`p-3 rounded-lg border text-center space-y-1 ${
                    badge.earned
                      ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800"
                      : "bg-muted/30 border-muted opacity-50"
                  }`}
                >
                  <Icon className={`h-6 w-6 mx-auto ${badge.earned ? "text-yellow-600" : "text-muted-foreground"}`} />
                  <p className="text-xs font-medium">{badge.name}</p>
                  {badge.earned && (
                    <Badge variant="secondary" className="text-xs">
                      Earned
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
            📚 Resume Last Practice
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
            🔖 Review Bookmarked Words
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
