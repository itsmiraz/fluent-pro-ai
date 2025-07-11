"use client"

import type React from "react"

import { useState } from "react"
import { Mic, Send, MessageCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { VoiceModal } from "@/components/voice-modal"
import type { OnboardingData } from "@/types"

interface SpeakingAssistantPanelProps {
  onboardingData?: OnboardingData
}

export function SpeakingAssistantPanel({ onboardingData }: SpeakingAssistantPanelProps = {}) {
  const [inputText, setInputText] = useState("")
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "ai" as const,
      content: getPersonalizedWelcome(onboardingData),
      timestamp: new Date(),
    },
  ])

  function getPersonalizedWelcome(onboardingData?: OnboardingData) {
    if (!onboardingData) {
      return "Hi! I'm your AI speaking coach. Let's practice some conversations together!"
    }

    const { goal } = onboardingData

    switch (goal.id) {
      case "daily-conversation":
        return "Ready to practice everyday conversations? I can help you with small talk, introductions, and casual chats!"
      case "professional-corporate":
        return "Let's work on your professional communication! We can practice meetings, presentations, and workplace discussions."
      case "sales-client-meetings":
        return "Time to polish your sales skills! I'll help you practice pitches, client interactions, and negotiations."
      case "ielts-academic":
        return "Let's prepare for your IELTS speaking test! We can practice all three parts of the speaking exam."
      case "public-speaking":
        return "Ready to boost your confidence? Let's practice presentations, speeches, and public speaking techniques!"
      case "writing-email":
        return "Let's improve your spoken communication for professional contexts and email discussions!"
      default:
        return `Hi! I'm here to help you practice ${goal.title.toLowerCase()}. Let's start a conversation!`
    }
  }

  const handleSendMessage = () => {
    if (!inputText.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: "user" as const,
      content: inputText,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        type: "ai" as const,
        content:
          "That's a great point! Let me help you practice that scenario. Would you like to try the voice mode for a more immersive experience?",
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, aiMessage])
    }, 1000)

    setInputText("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            AI Speaking Coach
            <Badge variant="secondary" className="text-xs">
              Online
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-4">
          {/* Chat Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto max-h-64">
            {chatMessages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button size="icon" onClick={handleSendMessage} disabled={!inputText.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Voice Mode Button */}
            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              onClick={() => setIsVoiceModalOpen(true)}
            >
              <Mic className="h-4 w-4 mr-2" />
              Start Voice Conversation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Voice Modal */}
      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onboardingData={onboardingData}
      />
    </>
  )
}
