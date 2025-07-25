'use client'

import React from "react";

import { useState } from "react";
import {
  MessageCircle,
  Mic,
  Send,
  Zap,
  Clock,
  Target,
  TrendingUp,
  Volume2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VoiceModal } from "@/app/(dashboard)/dashboard/_components/voice-modal";
import { TOnboardingData } from "@/redux/feature/onBoarding/onBoardingType";
import { useAppSelector } from "@/redux/hooks/hooks";


const TalkWithAi = () => {
  const {onboardingData} = useAppSelector((state)=>state.onboarding)
  const [inputText, setInputText] = useState("");
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState<string | null>(
    null
  );
  const [chatMessages, setChatMessages] = useState<
    { id: number; type: string; content: string; timestamp: Date }[]
  >([
    {
      id: 121212,
      type: "ai" as const,
      content: getPersonalizedWelcome(onboardingData as TOnboardingData),
      timestamp: new Date(),
    },
  ]);

  function getPersonalizedWelcome(onboardingData?: TOnboardingData) {
    if (!onboardingData) {
      return "Welcome to Talk with AI! I'm your personal conversation partner. Let's practice speaking together!";
    }

    const { goal, level } = onboardingData;

    const levelText =
      level === "beginner"
        ? "beginner-friendly"
        : level === "intermediate"
        ? "intermediate"
        : "advanced";

    switch (goal.id) {
      case "daily-conversation":
        return `Hi! I'm excited to help you master everyday conversations! We'll practice ${levelText} scenarios like meeting new people, small talk, and casual discussions. Ready to chat?`;
      case "professional-corporate":
        return `Welcome! Let's work on your professional communication skills. I'll help you practice ${levelText} workplace scenarios like meetings, presentations, and business discussions.`;
      case "sales-client-meetings":
        return `Great to meet you! I'm here to help you excel in sales conversations. We'll practice ${levelText} scenarios including client pitches, objection handling, and closing deals.`;
      case "ielts-academic":
        return `Hello! I'm your IELTS speaking preparation partner. We'll practice all three parts of the speaking test with ${levelText} questions and feedback.`;
      case "public-speaking":
        return `Welcome! I'm here to boost your public speaking confidence. We'll practice ${levelText} presentations, speeches, and handling Q&A sessions.`;
      case "writing-email":
        return `Hi! Let's improve your spoken communication for professional contexts. We'll practice discussing ${levelText} email content and business correspondence.`;
      default:
        return `Welcome! I'm here to help you practice ${goal.title.toLowerCase()}. Let's have some great conversations together!`;
    }
  }

  const getPersonalizedStats = (onboardingData?: TOnboardingData) => {
    if (!onboardingData) {
      return {
        todayMinutes: 25,
        targetMinutes: 30,
        conversationsToday: 3,
        targetConversations: 5,
        averageScore: 85,
        streak: 7,
      };
    }

    const { level } = onboardingData;
    const multiplier =
      level === "beginner" ? 0.8 : level === "intermediate" ? 1 : 1.2;

    return {
      todayMinutes: Math.floor(20 * multiplier),
      targetMinutes: Math.floor(30 * multiplier),
      conversationsToday: Math.floor(2 * multiplier),
      targetConversations: Math.floor(4 * multiplier),
      averageScore: Math.floor(
        75 + (level === "advanced" ? 15 : level === "intermediate" ? 10 : 0)
      ),
      streak: Math.floor(5 * multiplier),
    };
  };

  const stats = getPersonalizedStats(onboardingData as TOnboardingData);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = {
      id: chatMessages.length + 1,
      type: "user" as const,
      content: inputText,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);

    // Simulate AI response based on learning goal
    setTimeout(() => {
      let aiResponse = "That's interesting! Can you tell me more about that?";

      if (onboardingData) {
        switch (onboardingData.goal.id) {
          case "professional-corporate":
            aiResponse =
              "I see. In a professional context, how would you present this to your team? Let's practice that scenario.";
            break;
          case "sales-client-meetings":
            aiResponse =
              "Great point! Now, how would you address a client's concerns about this? Let's role-play that situation.";
            break;
          case "ielts-academic":
            aiResponse =
              "Good answer! Let me ask a follow-up question: What are the advantages and disadvantages of this approach?";
            break;
          case "public-speaking":
            aiResponse =
              "Excellent! Now, how would you present this to a larger audience? Let's practice your delivery.";
            break;
          default:
            aiResponse =
              "That's a great point! Would you like to explore this topic further through voice conversation?";
        }
      }

      const aiMessage = {
        id: Date.now() + 1,
        type: "ai" as const,
        content: aiResponse,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiMessage]);
    }, 1000);

    setInputText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickStartScenarios = [
    {
      id: "quick-chat",
      title: "Quick Chat",
      description: "5-minute casual conversation",
      icon: MessageCircle,
      duration: "5 min",
      difficulty: "Easy",
    },
    {
      id: "role-play",
      title: "Role Play",
      description: "Scenario-based practice",
      icon: Target,
      duration: "10 min",
      difficulty: "Medium",
    },
    {
      id: "deep-discussion",
      title: "Deep Discussion",
      description: "Complex topic exploration",
      icon: TrendingUp,
      duration: "15 min",
      difficulty: "Advanced",
    },
  ];
  return (
    <div>
      {" "}
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Talk with AI</h1>
          <p className="text-muted-foreground">
            Practice conversations with your AI partner - chat or speak
            naturally
          </p>
        </div>

        {/* Today's Progress */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Today's Progress
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {stats.streak} day streak
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {stats.todayMinutes}
                </p>
                <p className="text-xs text-muted-foreground">Minutes Today</p>
                <Progress
                  value={(stats.todayMinutes / stats.targetMinutes) * 100}
                  className="h-1 mt-1"
                />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {stats.conversationsToday}
                </p>
                <p className="text-xs text-muted-foreground">Conversations</p>
                <Progress
                  value={
                    (stats.conversationsToday / stats.targetConversations) * 100
                  }
                  className="h-1 mt-1"
                />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {stats.averageScore}%
                </p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {stats.streak}
                </p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="conversation" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="conversation">AI Conversation</TabsTrigger>
            <TabsTrigger value="quick-start">Quick Start</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="conversation" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Main Chat Interface */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    AI Conversation Partner
                    <Badge variant="secondary" className="text-xs">
                      Online
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Chat Messages */}
                  <div className="h-64 overflow-y-auto space-y-3 p-3 border rounded-lg bg-muted/20">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message?.type === "ai"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg text-sm ${
                            message?.type === "ai"
                              ? "bg-primary text-primary-foreground"
                              : "bg-background border shadow-sm"
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
                      <Button
                        size="icon"
                        onClick={handleSendMessage}
                        disabled={!inputText.trim()}
                      >
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

              {/* AI Coach Info */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Your AI Coach
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* AI Avatar */}
                  <div className="text-center space-y-3">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">AI Conversation Partner</h3>
                      <p className="text-sm text-muted-foreground">
                        Specialized in{" "}
                        {onboardingData?.goal.title.toLowerCase() ||
                          "English conversation"}
                      </p>
                    </div>
                  </div>

                  {/* Capabilities */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">
                      What I can help with:
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Real-time conversation practice</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Scenario-based role playing</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Pronunciation feedback</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>Grammar correction</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-sm bg-transparent"
                    >
                      💡 Get conversation tips
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-sm bg-transparent"
                    >
                      🎯 Set practice goals
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-sm bg-transparent"
                    >
                      📊 View my progress
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="quick-start" className="space-y-6">
            {/* Quick Start Scenarios */}
            <div className="grid gap-4 md:grid-cols-3">
              {quickStartScenarios.map((scenario) => {
                const Icon = scenario.icon;
                return (
                  <Card
                    key={scenario.id}
                    className="hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{scenario.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {scenario.description}
                        </p>
                        <div className="flex justify-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {scenario.duration}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {scenario.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => setIsVoiceModalOpen(true)}
                      >
                        Start Now
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Personalized Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Recommended for You
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {onboardingData?.goal.id === "professional-corporate" && (
                    <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Team Meeting Practice</h4>
                          <p className="text-sm text-muted-foreground">
                            Practice contributing to team discussions
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => setIsVoiceModalOpen(true)}
                        >
                          <Volume2 className="h-4 w-4 mr-2" />
                          Try Voice
                        </Button>
                      </div>
                    </div>
                  )}

                  {onboardingData?.goal.id === "daily-conversation" && (
                    <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Small Talk Mastery</h4>
                          <p className="text-sm text-muted-foreground">
                            Learn to start and maintain casual conversations
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => setIsVoiceModalOpen(true)}
                        >
                          <Volume2 className="h-4 w-4 mr-2" />
                          Try Voice
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Free Conversation</h4>
                        <p className="text-sm text-muted-foreground">
                          Open-ended chat about any topic you choose
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setIsVoiceModalOpen(true)}
                      >
                        <Volume2 className="h-4 w-4 mr-2" />
                        Try Voice
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {/* Conversation History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Conversations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      id: 1,
                      title: "Professional Meeting Discussion",
                      date: "Today, 2:30 PM",
                      duration: "12 min",
                      score: 88,
                      type: "Voice",
                    },
                    {
                      id: 2,
                      title: "Casual Weekend Plans Chat",
                      date: "Yesterday, 4:15 PM",
                      duration: "8 min",
                      score: 92,
                      type: "Voice",
                    },
                    {
                      id: 3,
                      title: "Text Conversation Practice",
                      date: "Yesterday, 10:20 AM",
                      duration: "15 min",
                      score: 85,
                      type: "Text",
                    },
                  ].map((conversation) => (
                    <div
                      key={conversation.id}
                      className="p-4 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{conversation.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>{conversation.date}</span>
                            <span>{conversation.duration}</span>
                            <Badge variant="outline" className="text-xs">
                              {conversation.type}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            {conversation.score}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Score
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Summary */}
            <Card>
              <CardHeader>
                <CardTitle>This Week's Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <p className="text-2xl font-bold text-blue-600">156</p>
                    <p className="text-xs text-muted-foreground">
                      Total Minutes
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <p className="text-2xl font-bold text-green-600">12</p>
                    <p className="text-xs text-muted-foreground">
                      Conversations
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <p className="text-2xl font-bold text-purple-600">89%</p>
                    <p className="text-xs text-muted-foreground">Avg Score</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <p className="text-2xl font-bold text-orange-600">6</p>
                    <p className="text-xs text-muted-foreground">Active Days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {/* Voice Modal */}
      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onboardingData={onboardingData as TOnboardingData}
      />
    </div>
  );
};

export default TalkWithAi;
