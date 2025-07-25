"use client"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { TOnboardingData } from "@/redux/feature/onBoarding/onBoardingType"

interface Scenario {
  id: string
  title: string
  description: string
  context: string
}

interface ScenarioSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (scenario: Scenario) => void
  onboardingData?: TOnboardingData
}

export function ScenarioSelector({ isOpen, onClose, onSelect, onboardingData }: ScenarioSelectorProps) {
  const getScenarios = (onboardingData?: TOnboardingData): Scenario[] => {
    if (!onboardingData) {
      return [
        {
          id: "general-1",
          title: "Coffee Shop Chat",
          description: "Casual conversation with a stranger",
          context: "You're waiting in line at a coffee shop and start chatting with someone.",
        },
        {
          id: "general-2",
          title: "Travel Planning",
          description: "Discussing vacation plans",
          context: "You're talking to a friend about planning a weekend trip together.",
        },
      ]
    }

    const { goal } = onboardingData

    switch (goal.id) {
      case "daily-conversation":
        return [
          {
            id: "daily-1",
            title: "Neighborhood Chat",
            description: "Meeting your new neighbor",
            context: "You've just moved and are chatting with your neighbor about the area.",
          },
          {
            id: "daily-2",
            title: "Grocery Store Help",
            description: "Asking for help finding items",
            context: "You're in a grocery store and need help finding specific ingredients.",
          },
          {
            id: "daily-3",
            title: "Weather Small Talk",
            description: "Casual conversation about weather",
            context: "You're making small talk about the unusual weather with a colleague.",
          },
          {
            id: "daily-4",
            title: "Weekend Plans",
            description: "Discussing weekend activities",
            context: "You're talking with friends about what to do this weekend.",
          },
        ]

      case "professional-corporate":
        return [
          {
            id: "corp-1",
            title: "Project Delay Explanation",
            description: "Informing manager about delays",
            context: "You need to explain a project delay to your boss and propose solutions.",
          },
          {
            id: "corp-2",
            title: "Team Meeting Discussion",
            description: "Contributing to team meetings",
            context: "You're in a team meeting discussing quarterly goals and sharing updates.",
          },
          {
            id: "corp-3",
            title: "Client Status Update",
            description: "Updating clients on progress",
            context: "You're calling a client to provide an update on their project status.",
          },
          {
            id: "corp-4",
            title: "Performance Review",
            description: "Discussing achievements and goals",
            context: "You're in your annual performance review discussing accomplishments.",
          },
        ]

      case "sales-client-meetings":
        return [
          {
            id: "sales-1",
            title: "Product Demonstration",
            description: "Showcasing product features",
            context: "You're demonstrating your software to a potential client.",
          },
          {
            id: "sales-2",
            title: "Handling Objections",
            description: "Addressing client concerns",
            context: "A client has concerns about pricing and implementation timeline.",
          },
          {
            id: "sales-3",
            title: "Closing the Deal",
            description: "Finalizing the agreement",
            context: "You're in the final stages of closing a deal with an interested client.",
          },
          {
            id: "sales-4",
            title: "Follow-up Call",
            description: "Checking in after proposal",
            context: "You're following up with a client after sending them a proposal.",
          },
        ]

      case "ielts-academic":
        return [
          {
            id: "ielts-1",
            title: "Part 1: Personal Questions",
            description: "Answering questions about yourself",
            context: "The examiner is asking about your hobbies, work, and daily routine.",
          },
          {
            id: "ielts-2",
            title: "Part 2: Describe Experience",
            description: "2-minute monologue",
            context: "Describe a time when you learned something new. You have 2 minutes.",
          },
          {
            id: "ielts-3",
            title: "Part 3: Abstract Discussion",
            description: "Discussing complex topics",
            context: "Discuss the role of technology in education and its future impact.",
          },
          {
            id: "ielts-4",
            title: "Part 2: Describe a Place",
            description: "Describing locations",
            context: "Describe a place you visited that left a strong impression on you.",
          },
        ]

      case "public-speaking":
        return [
          {
            id: "public-1",
            title: "Presentation Opening",
            description: "Starting a presentation confidently",
            context: "You're opening a presentation about climate change to colleagues.",
          },
          {
            id: "public-2",
            title: "Q&A Session",
            description: "Handling audience questions",
            context: "You've finished your presentation and are taking questions from the audience.",
          },
          {
            id: "public-3",
            title: "Impromptu Speech",
            description: "Speaking without preparation",
            context: "You've been asked to give a 2-minute speech about teamwork.",
          },
          {
            id: "public-4",
            title: "Storytelling",
            description: "Engaging narrative speaking",
            context: "You're telling a story to illustrate a point in your presentation.",
          },
        ]

      case "writing-email":
        return [
          {
            id: "email-1",
            title: "Email Content Discussion",
            description: "Discussing email before sending",
            context: "You're discussing an important email with a colleague before sending.",
          },
          {
            id: "email-2",
            title: "Formal Communication",
            description: "Professional correspondence topics",
            context: "You're explaining formal communication protocols to a new team member.",
          },
          {
            id: "email-3",
            title: "Complaint Resolution",
            description: "Addressing customer complaints",
            context: "You're discussing how to respond to a customer complaint email.",
          },
          {
            id: "email-4",
            title: "Meeting Request",
            description: "Scheduling and coordination",
            context: "You're verbally coordinating a meeting request before sending the email.",
          },
        ]

      default:
        return [
          {
            id: "custom-1",
            title: "General Practice",
            description: `Practice ${goal.title.toLowerCase()}`,
            context: `Let's practice scenarios related to ${goal.title.toLowerCase()}.`,
          },
        ]
    }
  }

  const scenarios = getScenarios(onboardingData)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Choose a Scenario</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select a conversation scenario to practice. Each scenario is tailored to your learning goals.
          </p>

          <div className="grid gap-3">
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => onSelect(scenario)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">{scenario.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{scenario.description}</p>
                    <p className="text-xs text-muted-foreground italic">"{scenario.context}"</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Select
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
