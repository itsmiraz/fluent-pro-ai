"use client"

import { useState } from "react"
import {
  Calendar,
  Flame,
  Trophy,
  Clock,
  Target,
  Star,
  Award,
  BookOpen,
  Mic,
  Video,
  Brain,
  Eye,
  MessageSquare,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

// Activity types with their configurations
const activityTypes = [
  {
    id: "practice-room",
    name: "Practice Room",
    icon: Mic,
    color: "bg-blue-500",
    lightColors: ["bg-blue-100", "bg-blue-200", "bg-blue-300", "bg-blue-400", "bg-blue-500"],
    darkColors: ["bg-blue-900", "bg-blue-800", "bg-blue-700", "bg-blue-600", "bg-blue-500"],
  },
  {
    id: "situations",
    name: "Situation Analysis",
    icon: Eye,
    color: "bg-green-500",
    lightColors: ["bg-green-100", "bg-green-200", "bg-green-300", "bg-green-400", "bg-green-500"],
    darkColors: ["bg-green-900", "bg-green-800", "bg-green-700", "bg-green-600", "bg-green-500"],
  },
  {
    id: "vocabulary",
    name: "Vocabulary",
    icon: BookOpen,
    color: "bg-purple-500",
    lightColors: ["bg-purple-100", "bg-purple-200", "bg-purple-300", "bg-purple-400", "bg-purple-500"],
    darkColors: ["bg-purple-900", "bg-purple-800", "bg-purple-700", "bg-purple-600", "bg-purple-500"],
  },
  {
    id: "video-lessons",
    name: "Video Lessons",
    icon: Video,
    color: "bg-orange-500",
    lightColors: ["bg-orange-100", "bg-orange-200", "bg-orange-300", "bg-orange-400", "bg-orange-500"],
    darkColors: ["bg-orange-900", "bg-orange-800", "bg-orange-700", "bg-orange-600", "bg-orange-500"],
  },
  {
    id: "grammar",
    name: "Grammar Tests",
    icon: Brain,
    color: "bg-red-500",
    lightColors: ["bg-red-100", "bg-red-200", "bg-red-300", "bg-red-400", "bg-red-500"],
    darkColors: ["bg-red-900", "bg-red-800", "bg-red-700", "bg-red-600", "bg-red-500"],
  },
  {
    id: "speaking",
    name: "Speaking Practice",
    icon: MessageSquare,
    color: "bg-teal-500",
    lightColors: ["bg-teal-100", "bg-teal-200", "bg-teal-300", "bg-teal-400", "bg-teal-500"],
    darkColors: ["bg-teal-900", "bg-teal-800", "bg-teal-700", "bg-teal-600", "bg-teal-500"],
  },
]

// Generate activity data for each type for the last 52 weeks
const generateActivityDataByType = () => {
  const data: { [key: string]: any[] } = {}
  const today = new Date()

  activityTypes.forEach((type) => {
    data[type.id] = []

    // Generate 52 weeks of data
    for (let week = 51; week >= 0; week--) {
      const weekStart = new Date(today)
      weekStart.setDate(weekStart.getDate() - week * 7)

      // Generate 7 days for this week
      const weekData = []
      for (let day = 0; day < 7; day++) {
        const date = new Date(weekStart)
        date.setDate(date.getDate() + day)

        // Generate random activity level (0-4) with different probabilities for each type
        let activityLevel = 0
        const random = Math.random()

        switch (type.id) {
          case "practice-room":
            activityLevel = random > 0.2 ? Math.floor(Math.random() * 5) : 0
            break
          case "situations":
            activityLevel = random > 0.4 ? Math.floor(Math.random() * 4) + 1 : 0
            break
          case "vocabulary":
            activityLevel = random > 0.1 ? Math.floor(Math.random() * 5) : 0
            break
          case "video-lessons":
            activityLevel = random > 0.6 ? Math.floor(Math.random() * 3) + 1 : 0
            break
          case "grammar":
            activityLevel = random > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0
            break
          case "speaking":
            activityLevel = random > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0
            break
        }

        weekData.push({
          date: date.toISOString().split("T")[0],
          level: activityLevel,
          activities: activityLevel * Math.floor(Math.random() * 3) + (activityLevel > 0 ? 1 : 0),
          minutes: activityLevel * Math.floor(Math.random() * 20) + (activityLevel > 0 ? 5 : 0),
        })
      }

      data[type.id].push({
        weekStart: weekStart.toISOString().split("T")[0],
        days: weekData,
        totalActivities: weekData.reduce((sum, d) => sum + d.activities, 0),
        totalMinutes: weekData.reduce((sum, d) => sum + d.minutes, 0),
        activeDays: weekData.filter((d) => d.level > 0).length,
      })
    }
  })

  return data
}

const activityDataByType = generateActivityDataByType()

// Calculate streaks for each activity type
const calculateStreaksByType = () => {
  const streaks: { [key: string]: { current: number; longest: number } } = {}

  activityTypes.forEach((type) => {
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0

    // Flatten all days and start from most recent
    const allDays = activityDataByType[type.id].flatMap((week) => week.days).reverse()

    for (let i = 0; i < allDays.length; i++) {
      if (allDays[i].level > 0) {
        tempStreak++
        if (i === 0) {
          currentStreak = tempStreak
        }
      } else {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 0
        if (i === 0) {
          currentStreak = 0
        }
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak)
    streaks[type.id] = { current: currentStreak, longest: longestStreak }
  })

  return streaks
}

const streaksByType = calculateStreaksByType()

// Calculate totals for each activity type
const calculateTotalsByType = () => {
  const totals: { [key: string]: any } = {}

  activityTypes.forEach((type) => {
    const weeks = activityDataByType[type.id]
    const allDays = weeks.flatMap((week) => week.days)

    totals[type.id] = {
      totalActivities: allDays.reduce((sum, d) => sum + d.activities, 0),
      totalMinutes: allDays.reduce((sum, d) => sum + d.minutes, 0),
      activeDays: allDays.filter((d) => d.level > 0).length,
      averagePerWeek: Math.round((allDays.reduce((sum, d) => sum + d.activities, 0) / 52) * 10) / 10,
    }
  })

  return totals
}

const totalsByType = calculateTotalsByType()

// Get activity color based on level and type - improved quality
const getActivityColor = (level: number, type: any, isDark = false) => {
  if (level === 0) return "bg-muted/50 border-muted-foreground/10"

  const baseColor = type.color.replace("bg-", "").replace("-500", "")
  const opacity = 0.3 + level * 0.175 // Better opacity scaling

  return `bg-${baseColor}-${200 + level * 100} dark:bg-${baseColor}-${900 - level * 100} border-${baseColor}-${300 + level * 50}/30`
}

// Get month labels for the past 12 months
const getMonthLabels = () => {
  const months = []
  const today = new Date()

  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
    months.push(date.toLocaleDateString("en-US", { month: "short" }))
  }

  return months
}

// Achievement badges
const achievements = [
  {
    id: 1,
    name: "First Steps",
    description: "Complete your first practice session",
    icon: Star,
    earned: true,
    date: "2024-01-15",
  },
  {
    id: 2,
    name: "Week Warrior",
    description: "Practice for 7 consecutive days",
    icon: Flame,
    earned: true,
    date: "2024-01-22",
  },
  {
    id: 3,
    name: "Month Master",
    description: "Practice for 30 consecutive days",
    icon: Calendar,
    earned: true,
    date: "2024-02-15",
  },
  {
    id: 4,
    name: "Century Club",
    description: "Complete 100 practice sessions",
    icon: Trophy,
    earned: true,
    date: "2024-03-01",
  },
  {
    id: 5,
    name: "Speaking Pro",
    description: "Complete 50 speaking exercises",
    icon: Mic,
    earned: true,
    date: "2024-02-28",
  },
  { id: 6, name: "Vocabulary Master", description: "Learn 500 new words", icon: BookOpen, earned: false, date: null },
  {
    id: 7,
    name: "Video Enthusiast",
    description: "Watch 25 situation videos",
    icon: Video,
    earned: true,
    date: "2024-03-10",
  },
  {
    id: 8,
    name: "Grammar Guru",
    description: "Score 90%+ on 10 grammar tests",
    icon: Brain,
    earned: false,
    date: null,
  },
  {
    id: 9,
    name: "Consistency King",
    description: "Practice for 100 consecutive days",
    icon: Award,
    earned: false,
    date: null,
  },
  { id: 10, name: "Time Master", description: "Spend 100 hours practicing", icon: Clock, earned: false, date: null },
]

const earnedAchievements = achievements.filter((a) => a.earned)
const upcomingAchievements = achievements.filter((a) => !a.earned)

const ProgressState = () => {
const [selectedPeriod, setSelectedPeriod] = useState("year")
  const [hoveredDay, setHoveredDay] = useState<any>(null)
  const [hoveredType, setHoveredType] = useState<string>("")

  // Calculate overall stats
  const overallStats = {
    totalActivities: Object.values(totalsByType).reduce((sum: number, type: any) => sum + type.totalActivities, 0),
    totalMinutes: Object.values(totalsByType).reduce((sum: number, type: any) => sum + type.totalMinutes, 0),
    totalActiveDays: Math.max(...Object.values(totalsByType).map((type: any) => type.activeDays)),
    longestStreak: Math.max(...Object.values(streaksByType).map((streak: any) => streak.longest)),
  }
    return (
    <div>
        <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Progress & Statistics</h1>
        <p className="text-muted-foreground">Track your learning journey across all activities</p>
      </div>

      {/* Key Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{overallStats.longestStreak}</p>
                <p className="text-sm text-muted-foreground">Best Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{overallStats.totalActivities}</p>
                <p className="text-sm text-muted-foreground">Total Activities</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{Math.round(overallStats.totalMinutes / 60)}</p>
                <p className="text-sm text-muted-foreground">Hours Practiced</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{overallStats.totalActiveDays}</p>
                <p className="text-sm text-muted-foreground">Active Days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="year">Activity Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="year" className="space-y-6">
          {/* Activity Heatmap by Type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Activity Breakdown by Type
                <Badge variant="secondary">52 weeks • 6 activity types</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Month labels - properly aligned */}
              <div className="flex justify-between text-xs text-muted-foreground pl-40 pr-4">
                {getMonthLabels().map((month, index) => (
                  <div key={index} className="flex-1 text-center">
                    <span>{month}</span>
                  </div>
                ))}
              </div>

              {/* Activity rows for each type */}
              <div className="space-y-4">
                {activityTypes.map((type) => {
                  const Icon = type.icon
                  const typeData = activityDataByType[type.id]
                  const typeStats = totalsByType[type.id]
                  const typeStreaks = streaksByType[type.id]

                  return (
                    <div key={type.id} className="space-y-2">
                      <div className="flex items-center gap-4">
                        {/* Activity type info */}
                        <div className="w-36 flex items-center gap-2 flex-shrink-0">
                          <Icon
                            className="h-4 w-4"
                            style={{ color: type.color.replace("bg-", "").replace("-500", "") }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">{type.name}</p>
                            <p className="text-xs text-muted-foreground">{typeStats.totalActivities} activities</p>
                          </div>
                        </div>

                        {/* Activity grid for 52 weeks - improved alignment and quality */}
                        <div className="flex-1 flex gap-0.5 justify-between px-2">
                          {typeData.map((week, weekIndex) => (
                            <div key={weekIndex} className="flex flex-col gap-0.5">
                              {week.days.map((day:any, dayIndex:any) => (
                                <div
                                  key={dayIndex}
                                  className={`w-2.5 h-2.5 rounded-sm cursor-pointer transition-all duration-200 hover:ring-1 hover:ring-primary/50 hover:scale-110 border border-transparent ${getActivityColor(day.level, type)}`}
                                  onMouseEnter={() => {
                                    setHoveredDay(day)
                                    setHoveredType(type.name)
                                  }}
                                  onMouseLeave={() => {
                                    setHoveredDay(null)
                                    setHoveredType("")
                                  }}
                                  title={`${day.date}: ${day.activities} ${type.name.toLowerCase()} activities (${day.minutes} min)`}
                                  style={{
                                    boxShadow: day.level > 0 ? "0 0 0 0.5px rgba(0,0,0,0.1)" : "none",
                                  }}
                                />
                              ))}
                            </div>
                          ))}
                        </div>

                        {/* Stats summary */}
                        <div className="w-32 text-right flex-shrink-0">
                          <div className="flex items-center gap-2 justify-end">
                            <Flame className="h-3 w-3 text-orange-500" />
                            <span className="text-sm font-medium">{typeStreaks.current}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {Math.round(typeStats.totalMinutes / 60)}h total
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Improved Legend */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span>Less</span>
                    <div className="flex gap-1">
                      {[0, 1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`w-2.5 h-2.5 rounded-sm border ${level === 0 ? "bg-muted border-muted-foreground/20" : "bg-primary border-primary/20"}`}
                          style={{
                            opacity: level === 0 ? 1 : 0.2 + level * 0.2,
                            boxShadow: level > 0 ? "0 0 0 0.5px rgba(0,0,0,0.1)" : "none",
                          }}
                        />
                      ))}
                    </div>
                    <span>More</span>
                  </div>

                  <div className="text-muted-foreground/70">Each square = 1 day • Hover for details</div>
                </div>

                <div className="text-xs text-muted-foreground">52 weeks of activity data</div>
              </div>

              {/* Enhanced Hover tooltip */}
              {hoveredDay && (
                <div
                  className="fixed top-0 left-0 bg-popover border rounded-lg p-3 shadow-lg z-50 text-xs pointer-events-none transform -translate-x-1/2 -translate-y-full"
                  style={{
                    left: "50%",
                    top: "50%",
                  }}
                >
                  <div className="space-y-1">
                    <p className="font-medium text-popover-foreground">{hoveredType}</p>
                    <p className="text-muted-foreground">
                      {new Date(hoveredDay.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <span>{hoveredDay.activities} activities</span>
                      <span>{hoveredDay.minutes} minutes</span>
                    </div>
                    {hoveredDay.level > 0 && (
                      <div className="flex items-center gap-1 pt-1">
                        <div
                          className="w-2 h-2 rounded-sm"
                          style={{ backgroundColor: `hsl(var(--primary))`, opacity: 0.2 + hoveredDay.level * 0.2 }}
                        />
                        <span className="text-muted-foreground">Level {hoveredDay.level}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Type Summary - Enhanced */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activityTypes.map((type) => {
              const Icon = type.icon
              const typeStats = totalsByType[type.id]
              const typeStreaks = streaksByType[type.id]

              return (
                <Card key={type.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`p-2.5 rounded-lg ${type.color.replace("bg-", "bg-").replace("500", "100")} dark:${type.color.replace("bg-", "bg-").replace("500", "900")}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm">{type.name}</h3>
                        <p className="text-xs text-muted-foreground">{typeStats.activeDays} active days</p>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Current Streak</span>
                        <span className="font-medium flex items-center gap-1">
                          <Flame className="h-3 w-3 text-orange-500" />
                          {typeStreaks.current} days
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Best Streak</span>
                        <span className="font-medium">{typeStreaks.longest} days</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Total Time</span>
                        <span className="font-medium">{Math.round(typeStats.totalMinutes / 60)}h</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Weekly Avg</span>
                        <span className="font-medium">{typeStats.averagePerWeek}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          {/* Achievement Summary */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-2xl font-bold">{earnedAchievements.length}</p>
                <p className="text-sm text-muted-foreground">Achievements Earned</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold">{upcomingAchievements.length}</p>
                <p className="text-sm text-muted-foreground">Goals Remaining</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold">
                  {Math.round((earnedAchievements.length / achievements.length) * 100)}%
                </p>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Earned Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Earned Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {earnedAchievements.map((achievement) => {
                  const Icon = achievement.icon
                  return (
                    <div
                      key={achievement.id}
                      className="p-4 rounded-lg border bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900">
                          <Icon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm">{achievement.name}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                          <Badge variant="secondary" className="text-xs">
                            Earned {new Date(achievement.date!).toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Upcoming Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingAchievements.map((achievement) => {
                  const Icon = achievement.icon
                  return (
                    <div key={achievement.id} className="p-4 rounded-lg border bg-muted/30">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm">{achievement.name}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                          <Badge variant="outline" className="text-xs">
                            In Progress
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          {/* Detailed Statistics by Activity Type */}
          <div className="grid gap-6 md:grid-cols-2">
            {activityTypes.map((type) => {
              const Icon = type.icon
              const typeStats = totalsByType[type.id]
              const typeStreaks = streaksByType[type.id]

              return (
                <Card key={type.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {type.name} Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <p className="text-lg font-bold">{typeStats.totalActivities}</p>
                        <p className="text-xs text-muted-foreground">Total Sessions</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <p className="text-lg font-bold">{Math.round(typeStats.totalMinutes / 60)}h</p>
                        <p className="text-xs text-muted-foreground">Time Spent</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <p className="text-lg font-bold">{typeStreaks.longest}</p>
                        <p className="text-xs text-muted-foreground">Best Streak</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <p className="text-lg font-bold">{typeStats.averagePerWeek}</p>
                        <p className="text-xs text-muted-foreground">Avg/Week</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Consistency Rate</span>
                        <span>{Math.round((typeStats.activeDays / 365) * 100)}%</span>
                      </div>
                      <Progress value={(typeStats.activeDays / 365) * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </div>
  )
}

export default ProgressState