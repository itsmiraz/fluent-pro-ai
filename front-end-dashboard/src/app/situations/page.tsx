"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Clock, Eye, Play, Star } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
const situationCategories = [
  {
    id: "daily-activities",
    title: "Daily Activities",
    description: "Watch and describe everyday situations and activities",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    scenarios: [
      {
        id: 1,
        title: "Morning Routine",
        description:
          "Watch someone's morning routine and describe what they do",
        duration: "2-3 min",
        difficulty: "Beginner",
        thumbnail: "/placeholder.svg?height=200&width=300",
        videoUrl: "/placeholder.svg?height=400&width=600",
        completed: false,
        rating: 0,
        tags: ["Daily Life", "Routine", "Description"],
        prompt:
          "Watch this video and describe what the person is doing in their morning routine. Include details about the sequence of activities.",
      },
      {
        id: 2,
        title: "Cooking Process",
        description: "Observe a cooking demonstration and explain the steps",
        duration: "4-5 min",
        difficulty: "Intermediate",
        thumbnail: "/placeholder.svg?height=200&width=300",
        videoUrl: "/placeholder.svg?height=400&width=600",
        completed: true,
        rating: 85,
        tags: ["Cooking", "Process", "Instructions"],
        prompt:
          "Describe the cooking process you just watched. Explain each step and the ingredients used.",
      },
      {
        id: 3,
        title: "Shopping Experience",
        description: "Watch a shopping scenario and describe the interactions",
        duration: "3-4 min",
        difficulty: "Intermediate",
        thumbnail: "/placeholder.svg?height=200&width=300",
        videoUrl: "/placeholder.svg?height=400&width=600",
        completed: false,
        rating: 0,
        tags: ["Shopping", "Interaction", "Social"],
        prompt:
          "Describe what happened in this shopping scenario. Include the customer's behavior, staff interactions, and any problems or solutions.",
      },
    ],
  },
  {
    id: "workplace",
    title: "Workplace Scenarios",
    description: "Observe professional situations and explain what's happening",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    scenarios: [
      {
        id: 4,
        title: "Team Meeting",
        description:
          "Watch a team meeting and describe the discussion and decisions",
        duration: "5-6 min",
        difficulty: "Advanced",
        thumbnail: "/placeholder.svg?height=200&width=300",
        videoUrl: "/placeholder.svg?height=400&width=600",
        completed: true,
        rating: 92,
        tags: ["Meeting", "Teamwork", "Discussion"],
        prompt:
          "Describe what happened in this team meeting. What topics were discussed? What decisions were made? How did team members interact?",
      },
      {
        id: 5,
        title: "Customer Service",
        description:
          "Observe a customer service interaction and explain the situation",
        duration: "3-4 min",
        difficulty: "Intermediate",
        thumbnail: "/placeholder.svg?height=200&width=300",
        videoUrl: "/placeholder.svg?height=400&width=600",
        completed: false,
        rating: 0,
        tags: ["Customer Service", "Problem Solving", "Communication"],
        prompt:
          "Explain the customer service situation you watched. What was the customer's problem? How did the staff member handle it?",
      },
    ],
  },
  {
    id: "social-situations",
    title: "Social Situations",
    description: "Watch social interactions and describe the dynamics",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    scenarios: [
      {
        id: 6,
        title: "Party Conversation",
        description:
          "Watch people socializing at a party and describe their interactions",
        duration: "4-5 min",
        difficulty: "Advanced",
        thumbnail: "/placeholder.svg?height=200&width=300",
        videoUrl: "/placeholder.svg?height=400&width=600",
        completed: false,
        rating: 0,
        tags: ["Social", "Conversation", "Networking"],
        prompt:
          "Describe the social interactions you observed at this party. How did people introduce themselves? What topics did they discuss?",
      },
      {
        id: 7,
        title: "Restaurant Scene",
        description: "Watch a restaurant scenario and explain what's happening",
        duration: "3-4 min",
        difficulty: "Beginner",
        thumbnail: "/placeholder.svg?height=200&width=300",
        videoUrl: "/placeholder.svg?height=400&width=600",
        completed: true,
        rating: 78,
        tags: ["Restaurant", "Service", "Dining"],
        prompt:
          "Describe what you saw in this restaurant scene. What did the customers order? How was the service? Were there any issues?",
      },
    ],
  },
  {
    id: "problem-solving",
    title: "Problem Solving",
    description: "Watch problem-solving scenarios and explain the solutions",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    scenarios: [
      {
        id: 8,
        title: "Technical Issue",
        description:
          "Watch someone solving a technical problem and explain the process",
        duration: "4-6 min",
        difficulty: "Advanced",
        thumbnail: "/placeholder.svg?height=200&width=300",
        videoUrl: "/placeholder.svg?height=400&width=600",
        completed: false,
        rating: 0,
        tags: ["Technical", "Problem Solving", "Process"],
        prompt:
          "Explain how the technical problem was solved in this video. What steps were taken? What tools or methods were used?",
      },
    ],
  },
];

interface SituationsContentProps {
  onStartPractice: (scenarioId: number) => void;
}

const Situations = () => {
  const [selectedCategory, setSelectedCategory] = useState("daily-activities");

  const currentCategory = situationCategories.find(
    (cat) => cat.id === selectedCategory
  );
  const totalScenarios = situationCategories.reduce(
    (sum, cat) => sum + cat.scenarios.length,
    0
  );
  const completedScenarios = situationCategories.reduce(
    (sum, cat) => sum + cat.scenarios.filter((s) => s.completed).length,
    0
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Situation Analysis</h1>
        <p className="text-muted-foreground">
          Watch real-life scenarios and practice describing what you observe
        </p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Videos Analyzed</span>
                <span>
                  {completedScenarios}/{totalScenarios}
                </span>
              </div>
              <Progress
                value={(completedScenarios / totalScenarios) * 100}
                className="h-2"
              />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {Math.round((completedScenarios / totalScenarios) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {Math.round(
                  situationCategories.reduce(
                    (sum, cat) =>
                      sum +
                      cat.scenarios
                        .filter((s) => s.completed)
                        .reduce((ratingSum, s) => ratingSum + s.rating, 0),
                    0
                  ) / Math.max(completedScenarios, 1)
                )}
                %
              </p>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {situationCategories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2"
          >
            <span>{category.title}</span>
            <Badge variant="secondary" className="text-xs">
              {category.scenarios.length}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Current Category */}
      {currentCategory && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">{currentCategory.title}</h2>
            <Badge className={currentCategory.color}>
              {currentCategory.scenarios.length} videos
            </Badge>
          </div>
          <p className="text-muted-foreground">{currentCategory.description}</p>

          {/* Scenarios Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentCategory.scenarios.map((scenario) => (
              <Card
                key={scenario.id}
                className="group hover:shadow-lg transition-all duration-200"
              >
                <div className="relative">
                  <img
                    src={scenario.thumbnail || "/placeholder.svg"}
                    alt={scenario.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-t-lg group-hover:bg-black/10 transition-colors" />

                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-3 group-hover:bg-white transition-colors">
                      <Play className="h-6 w-6 text-primary" />
                    </div>
                  </div>

                  <div className="absolute top-2 right-2 flex gap-1">
                    <Badge
                      variant="secondary"
                      className={getDifficultyColor(scenario.difficulty)}
                    >
                      {scenario.difficulty}
                    </Badge>
                    {scenario.completed && (
                      <Badge className="bg-green-500 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        {scenario.rating}%
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Badge
                      variant="secondary"
                      className="bg-black/50 text-white"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {scenario.duration}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    {scenario.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {scenario.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {scenario.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {/* onClick={() => onStartPractice(scenario.id)} */}
                    <Link href={`situation-practice/${scenario.id}`}>
                      <Button className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        {scenario.completed
                          ? "Watch Again"
                          : "Watch & Describe"}
                      </Button>
                    </Link>
                    <Button variant="outline" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Situations;
