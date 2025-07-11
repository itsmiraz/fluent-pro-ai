"use client"

import { TrendingUp, Star, Mic } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function FluencyOverviewPanel() {
  const fluencyScore = 78
  const weeklyImprovement = 12
  const recentRecordings = [
    { id: 1, fluency: 82, clarity: 75, grammar: 80, date: "Today" },
    { id: 2, fluency: 78, clarity: 73, grammar: 76, date: "Yesterday" },
    { id: 3, fluency: 74, clarity: 70, grammar: 72, date: "2 days ago" },
  ]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Fluency Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Fluency Score */}
        <div className="text-center space-y-2">
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-muted-foreground/20"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - fluencyScore / 100)}`}
                className="text-primary transition-all duration-1000"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{fluencyScore}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Fluency Score</p>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              +{weeklyImprovement}% this week
            </Badge>
          </div>
        </div>

        {/* Recent Recordings */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Recent Recordings</h4>
          {recentRecordings.map((recording) => (
            <div key={recording.id} className="space-y-2 p-3 rounded-lg bg-muted/30">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{recording.date}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs">
                    {Math.round((recording.fluency + recording.clarity + recording.grammar) / 3)}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <div className="flex justify-between">
                    <span>Fluency</span>
                    <span>{recording.fluency}%</span>
                  </div>
                  <Progress value={recording.fluency} className="h-1" />
                </div>
                <div>
                  <div className="flex justify-between">
                    <span>Clarity</span>
                    <span>{recording.clarity}%</span>
                  </div>
                  <Progress value={recording.clarity} className="h-1" />
                </div>
                <div>
                  <div className="flex justify-between">
                    <span>Grammar</span>
                    <span>{recording.grammar}%</span>
                  </div>
                  <Progress value={recording.grammar} className="h-1" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button className="w-full bg-transparent" variant="outline">
          <Mic className="h-4 w-4 mr-2" />
          Review My Speech
        </Button>
      </CardContent>
    </Card>
  )
}
