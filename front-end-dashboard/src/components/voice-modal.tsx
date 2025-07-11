"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, X, Volume2, RotateCcw, Shuffle, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ScenarioSelector } from "@/components/scenario-selector"
import type { OnboardingData } from "@/types"

interface VoiceModalProps {
  isOpen: boolean
  onClose: () => void
  onboardingData?: OnboardingData
}

interface Scenario {
  id: string
  title: string
  description: string
  context: string
}

export function VoiceModal({ isOpen, onClose, onboardingData }: VoiceModalProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcription, setTranscription] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [isAiSpeaking, setIsAiSpeaking] = useState(false)
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null)
  const [isScenarioSelectorOpen, setIsScenarioSelectorOpen] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<
    Array<{
      type: "user" | "ai"
      content: string
      timestamp: Date
    }>
  >([])

  const waveformRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  // Generate scenario based on learning goal
  const generateScenario = (onboardingData?: OnboardingData): Scenario => {
    if (!onboardingData) {
      return {
        id: "general",
        title: "Casual Conversation",
        description: "Practice everyday conversation skills",
        context: "You're having a friendly chat with someone you just met at a coffee shop.",
      }
    }

    const { goal, level } = onboardingData

    switch (goal.id) {
      case "daily-conversation":
        return {
          id: "daily-chat",
          title: "Neighborhood Chat",
          description: "Practice casual conversation with a neighbor",
          context: "You've just moved to a new neighborhood and are chatting with your neighbor about the area.",
        }
      case "professional-corporate":
        return {
          id: "meeting-delay",
          title: "Explaining a Project Delay",
          description: "Communicate a delay to your manager professionally",
          context: "You need to inform your boss about a project delay and propose solutions.",
        }
      case "sales-client-meetings":
        return {
          id: "product-demo",
          title: "Product Demonstration",
          description: "Present your product to a potential client",
          context: "You're demonstrating your company's new software to an interested client.",
        }
      case "ielts-academic":
        return {
          id: "ielts-part2",
          title: "IELTS Speaking Part 2",
          description: "Describe a memorable experience",
          context: "Describe a time when you learned something new. You have 2 minutes to speak.",
        }
      case "public-speaking":
        return {
          id: "presentation-intro",
          title: "Presentation Opening",
          description: "Practice opening a presentation confidently",
          context: "You're opening a presentation about climate change to a group of colleagues.",
        }
      case "writing-email":
        return {
          id: "email-discussion",
          title: "Discussing Email Content",
          description: "Verbally discuss professional email topics",
          context: "You're discussing the content of an important email with a colleague before sending it.",
        }
      default:
        return {
          id: "custom",
          title: "Custom Practice",
          description: `Practice ${goal.title.toLowerCase()}`,
          context: `Let's practice scenarios related to ${goal.title.toLowerCase()}.`,
        }
    }
  }

  // Initialize scenario when modal opens
  useEffect(() => {
    if (isOpen && !currentScenario) {
      const scenario = generateScenario(onboardingData)
      setCurrentScenario(scenario)

      // Add initial AI message
      setConversationHistory([
        {
          type: "ai",
          content: `${scenario.context} I'll be your conversation partner. When you're ready, click the microphone to start speaking!`,
          timestamp: new Date(),
        },
      ])
    }
  }, [isOpen, onboardingData])

  // Waveform animation
  useEffect(() => {
    if (isListening && waveformRef.current) {
      const animate = () => {
        const bars = waveformRef.current?.children
        if (bars) {
          Array.from(bars).forEach((bar, index) => {
            const height = Math.random() * 40 + 10
            ;(bar as HTMLElement).style.height = `${height}px`
          })
        }
        animationRef.current = requestAnimationFrame(animate)
      }
      animate()
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isListening])

  const toggleListening = () => {
    if (isListening) {
      // Stop listening and process
      setIsListening(false)
      processVoiceInput()
    } else {
      // Start listening
      setIsListening(true)
      setTranscription("")
      setAiResponse("")

      // Simulate real-time transcription
      setTimeout(() => {
        setTranscription("I think the project might be delayed by a few days...")
      }, 1000)

      setTimeout(() => {
        setTranscription(
          "I think the project might be delayed by a few days because we encountered some technical issues.",
        )
      }, 2500)
    }
  }

  const processVoiceInput = () => {
    if (!transcription) return

    // Add user message to history
    const userMessage = {
      type: "user" as const,
      content: transcription,
      timestamp: new Date(),
    }
    setConversationHistory((prev) => [...prev, userMessage])

    // Generate AI response based on scenario
    setTimeout(() => {
      let response = ""

      if (currentScenario?.id === "meeting-delay") {
        response =
          "I understand there are technical challenges. Can you give me more details about what specific issues you're facing? And what's your proposed timeline for resolution?"
      } else if (currentScenario?.id === "product-demo") {
        response =
          "That sounds interesting! Can you show me how this feature would work in our specific use case? I'm particularly interested in the integration capabilities."
      } else {
        response =
          "That's very interesting! Can you tell me more about that? I'd love to hear your thoughts on this topic."
      }

      setAiResponse(response)
      setIsAiSpeaking(true)

      // Add AI response to history
      const aiMessage = {
        type: "ai" as const,
        content: response,
        timestamp: new Date(),
      }
      setConversationHistory((prev) => [...prev, aiMessage])

      // Simulate TTS completion
      setTimeout(() => {
        setIsAiSpeaking(false)
      }, 3000)
    }, 1000)
  }

  const handleEndSession = () => {
    setIsListening(false)
    setTranscription("")
    setAiResponse("")
    setConversationHistory([])
    setCurrentScenario(null)
    onClose()
  }

  const handleSwitchScenario = () => {
    setIsScenarioSelectorOpen(true)
  }

  const handleScenarioSelect = (scenario: Scenario) => {
    setCurrentScenario(scenario)
    setConversationHistory([
      {
        type: "ai",
        content: `${scenario.context} I'll be your conversation partner. When you're ready, click the microphone to start speaking!`,
        timestamp: new Date(),
      },
    ])
    setIsScenarioSelectorOpen(false)
    setTranscription("")
    setAiResponse("")
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl p-0 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-white">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <h2 className="text-lg font-semibold">Voice Conversation</h2>
                <p className="text-sm text-slate-300">{currentScenario?.title || "Loading scenario..."}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Scenario Context */}
          {currentScenario && (
            <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700">
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  Scenario
                </Badge>
                <div className="flex-1">
                  <p className="text-sm text-slate-300">{currentScenario.context}</p>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="p-6 space-y-6">
            {/* Microphone and Waveform */}
            <div className="text-center space-y-4">
              <Button
                size="lg"
                className={`h-20 w-20 rounded-full transition-all duration-300 ${
                  isListening
                    ? "bg-red-500 hover:bg-red-600 animate-pulse shadow-lg shadow-red-500/30"
                    : "bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30"
                }`}
                onClick={toggleListening}
              >
                {isListening ? <Square className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
              </Button>

              {/* Waveform */}
              {isListening && (
                <div className="flex items-center justify-center gap-1 h-12">
                  <div ref={waveformRef} className="flex items-end gap-1">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-blue-400 rounded-full transition-all duration-100"
                        style={{ height: "10px" }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <p className="text-sm text-slate-400">
                {isListening ? "Listening... Click to stop" : "Click to start speaking"}
              </p>
            </div>

            {/* Transcription */}
            {transcription && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-green-500/30 text-green-300">
                    You said
                  </Badge>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <p className="text-slate-200">{transcription}</p>
                </div>
              </div>
            )}

            {/* AI Response */}
            {aiResponse && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                    AI Coach
                  </Badge>
                  {isAiSpeaking && (
                    <div className="flex items-center gap-1">
                      <Volume2 className="h-3 w-3 text-blue-400" />
                      <span className="text-xs text-blue-400">Speaking...</span>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <p className="text-slate-200">{aiResponse}</p>
                </div>
              </div>
            )}

            {/* Conversation History */}
            {conversationHistory.length > 2 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-300">Conversation History</h3>
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {conversationHistory.slice(1, -2).map((message, index) => (
                    <div
                      key={index}
                      className={`text-xs p-2 rounded ${
                        message.type === "user" ? "bg-green-500/20 text-green-200" : "bg-blue-500/20 text-blue-200"
                      }`}
                    >
                      <span className="font-medium">{message.type === "user" ? "You: " : "AI: "}</span>
                      {message.content}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between p-6 border-t border-slate-700 bg-slate-800/30">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSwitchScenario}
                className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 bg-transparent"
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Switch Scenario
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTranscription("")
                  setAiResponse("")
                  setConversationHistory(conversationHistory.slice(0, 1))
                }}
                className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
            <Button variant="destructive" size="sm" onClick={handleEndSession} className="bg-red-600 hover:bg-red-700">
              End Session
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Scenario Selector Modal */}
      <ScenarioSelector
        isOpen={isScenarioSelectorOpen}
        onClose={() => setIsScenarioSelectorOpen(false)}
        onSelect={handleScenarioSelect}
        onboardingData={onboardingData}
      />
    </>
  )
}
