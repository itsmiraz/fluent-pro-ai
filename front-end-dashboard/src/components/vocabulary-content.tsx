"use client"

import { BookOpen, Star, Volume2, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"

export function VocabularyContent() {
  const [showDefinition, setShowDefinition] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)

  const todaysWords = [
    {
      word: "Eloquent",
      definition: "Fluent or persuasive in speaking or writing",
      example: "She gave an eloquent speech at the conference.",
      difficulty: "Advanced",
      learned: true,
    },
    {
      word: "Meticulous",
      definition: "Showing great attention to detail; very careful and precise",
      example: "He was meticulous in his research methodology.",
      difficulty: "Intermediate",
      learned: true,
    },
    {
      word: "Ubiquitous",
      definition: "Present, appearing, or found everywhere",
      example: "Smartphones have become ubiquitous in modern society.",
      difficulty: "Advanced",
      learned: false,
    },
    {
      word: "Pragmatic",
      definition: "Dealing with things sensibly and realistically",
      example: "We need a pragmatic approach to solve this problem.",
      difficulty: "Intermediate",
      learned: false,
    },
    {
      word: "Serendipity",
      definition: "The occurrence of events by chance in a happy way",
      example: "Meeting my business partner was pure serendipity.",
      difficulty: "Advanced",
      learned: false,
    },
  ]

  const currentWord = todaysWords[currentWordIndex]
  const learnedCount = todaysWords.filter((w) => w.learned).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vocabulary Builder</h1>
        <p className="text-muted-foreground">Expand your English vocabulary with daily word challenges</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Flashcard */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Word of the Moment
              </CardTitle>
              <Badge
                variant={
                  currentWord.difficulty === "Beginner"
                    ? "secondary"
                    : currentWord.difficulty === "Intermediate"
                      ? "default"
                      : "destructive"
                }
              >
                {currentWord.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-primary">{currentWord.word}</div>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Volume2 className="h-4 w-4" />
                Pronounce
              </Button>
            </div>

            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full gap-2 bg-transparent"
                onClick={() => setShowDefinition(!showDefinition)}
              >
                {showDefinition ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showDefinition ? "Hide" : "Show"} Definition
              </Button>

              {showDefinition && (
                <div className="space-y-3 p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">Definition:</p>
                    <p className="text-sm">{currentWord.definition}</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">Example:</p>
                    <p className="text-sm italic">"{currentWord.example}"</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setCurrentWordIndex(Math.max(0, currentWordIndex - 1))}
                disabled={currentWordIndex === 0}
              >
                Previous
              </Button>
              <Button variant={currentWord.learned ? "secondary" : "default"} className="flex-1">
                {currentWord.learned ? "Learned ✓" : "Mark as Learned"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setCurrentWordIndex(Math.min(todaysWords.length - 1, currentWordIndex + 1))}
                disabled={currentWordIndex === todaysWords.length - 1}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress & Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Words Learned</span>
                  <span>{learnedCount}/5</span>
                </div>
                <Progress value={(learnedCount / 5) * 100} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-2xl font-bold text-primary">127</p>
                  <p className="text-xs text-muted-foreground">Total Words</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-2xl font-bold text-green-600">15</p>
                  <p className="text-xs text-muted-foreground">This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Quiz</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">Test your knowledge of recently learned words:</p>
              <Input placeholder="Type the definition of 'Eloquent'..." />
              <Button className="w-full" size="sm">
                Check Answer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Word List */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Word List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {todaysWords.map((word, index) => (
              <div
                key={word.word}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 ${
                  index === currentWordIndex ? "border-primary bg-primary/5" : ""
                } ${word.learned ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800" : ""}`}
                onClick={() => setCurrentWordIndex(index)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{word.word}</span>
                  <div className="flex items-center gap-1">
                    {word.learned && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                    <Badge variant="outline" className="text-xs">
                      {word.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
