"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, X, Volume2, RotateCcw, Shuffle, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScenarioSelector } from "@/app/(dashboard)/dashboard/_components/scenario-selector";
import { TOnboardingData } from "@/redux/feature/onBoarding/onBoardingType";
import { getSocket, initiateSocket } from "@/services/socket";

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onboardingData?: TOnboardingData;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  context: string;
}

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onboardingData?: TOnboardingData;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  context: string;
}

interface ConversationMessage {
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}
type SpeechRecognitionType = typeof window extends {
  SpeechRecognition: infer T;
}
  ? T
  : typeof window extends { webkitSpeechRecognition: infer T }
  ? T
  : any;
/**
 * VoiceModal is a voice-enabled conversation component that:
 * - Starts voice recognition when user clicks the mic
 * - Sends transcribed speech to backend through socket
 * - Handles real-time AI responses in streaming chunks
 * - Displays and optionally speaks AI responses
 */

export function VoiceModal({ isOpen, onClose }: VoiceModalProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [transcriptionArr, setTranscriptionArr] = useState<string[]>([]);
  const [aiResponse, setAiResponse] = useState("");
  const [aiResponseBuffer, setAiResponseBuffer] = useState("");
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [conversationHistory, setConversationHistory] = useState<
    ConversationMessage[]
  >([]);
 const SpeechRecognition =
  typeof window !== "undefined"
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

  const recognitionRef = useRef<InstanceType<SpeechRecognitionType> | null>(
    null
  );
  const lastFinalTranscriptRef = useRef("");
  const transcriptionArrRef = useRef<string[]>([]);
  const waveformRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  // Animate waveform bars during active voice recognition
  useEffect(() => {
    if (isListening && waveformRef.current) {
      const animate = () => {
        const bars = waveformRef.current?.children;
        if (bars) {
          Array.from(bars).forEach((bar) => {
            const height = Math.random() * 40 + 10;
            (bar as HTMLElement).style.height = `${height}px`;
          });
        }
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    return () => {
      animationRef.current && cancelAnimationFrame(animationRef.current);
    };
  }, [isListening]);

  // Handle socket events
  useEffect(() => {
    if (!isOpen) return;

    initiateSocket({
      userEmail: "user@example.com",
      token: "your-token-if-any",
    });
    const socket = getSocket();

    socket?.on("chatResponseChunk", (chunk: string) => {
      setIsAiSpeaking(true);
      setAiResponseBuffer((prev) => prev + chunk);
    });

    socket?.on("chatResponseDone", () => {
      const fullResponse = aiResponseBuffer;
      setAiResponse(fullResponse);
      setConversationHistory((prev) => [
        ...prev,
        { type: "ai", content: fullResponse, timestamp: new Date() },
      ]);
      setAiResponseBuffer("");
      setIsAiSpeaking(false);
    });

    return () => {
      socket?.off("chatResponseChunk");
      socket?.off("chatResponseDone");
    };
  }, [isOpen, aiResponseBuffer]);

  // Toggle voice recognition
  const toggleListening = () => {
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setTranscription("");
      setAiResponse("");
    };

    recognition.onerror = (event:any) => {
      console.error("Speech recognition error:", event);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      processVoiceInput();
    };

    recognition.onresult = (event:any) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        result.isFinal ? (final += transcript) : (interim += transcript);
      }

      if (final) {
        lastFinalTranscriptRef.current = final.trim();
        setTranscriptionArr((prev) => {
          const newArr = [...prev, final.trim()];
          transcriptionArrRef.current = newArr;
          return newArr;
        });
      }
      setTranscription(interim || final);
    };

    recognition.start();
  };

  // Send voice input to backend via socket
  const processVoiceInput = () => {
    const latest = transcriptionArrRef.current;
    if (!latest.length) return;

    const socket = getSocket();
    if (!socket?.connected) return console.error("Socket not connected");

    const userMsg = {
      type: "user" as const,
      content: latest.join(", "),
      timestamp: new Date(),
    };
    setConversationHistory((prev) => [...prev, userMsg]);
    setTranscription("");
    setTranscriptionArr([]);
    transcriptionArrRef.current = [];

    const messagesForBackend = [
      {
        role: "system",
        content: currentScenario?.context || "You are an AI assistant.",
      },
      ...conversationHistory.map((msg) => ({
        role: msg.type === "user" ? "user" : "assistant",
        content: msg.content,
      })),
      { role: "user", content: latest.join(", ") },
    ];

    socket.emit("chatMessage", {
      model: "mistral",
      messages: messagesForBackend,
    });
  };

  // Reset state and close modal
  const handleEndSession = () => {
    setIsListening(false);
    setTranscription("");
    setAiResponse("");
    setConversationHistory([]);
    setCurrentScenario(null);
    onClose();
    window.speechSynthesis.cancel();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] custom-scroll-hide overflow-y-auto p-0 border-slate-700 text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h2 className="text-lg font-semibold">Voice Conversation</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Mic Button and Waveform */}
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
              {isListening ? (
                <Square className="h-8 w-8" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </Button>
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
              {isListening
                ? "Listening... Click to stop"
                : "Click to start speaking"}
            </p>
          </div>

          {/* User Transcription */}
          {(transcriptionArr.length > 0 || transcription) && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-green-500/30 text-green-300"
                >
                  You said
                </Badge>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <p className="text-slate-200">
                  {transcriptionArr.join(", ")}{" "}
                  {transcription.trim() !== lastFinalTranscriptRef.current && (
                    <span className="text-green-400">{transcription}</span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* AI Response */}
          {aiResponseBuffer && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-blue-500/30 text-blue-300"
                >
                  AI Coach
                </Badge>
                {isAiSpeaking && (
                  <span className="flex items-center gap-1 text-xs text-blue-400">
                    <Volume2 className="h-3 w-3" /> Speaking...
                  </span>
                )}
              </div>
              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                <p className="text-slate-200">{aiResponseBuffer}</p>
              </div>
            </div>
          )}

          {/* Conversation History */}
          {[...conversationHistory].reverse().map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`border-${
                    item.type === "user" ? "green" : "blue"
                  }-500/30 text-${item.type === "user" ? "green" : "blue"}-300`}
                >
                  {item.type === "user" ? "You said" : "AI Coach"}
                </Badge>
              </div>
              <div
                className={`p-4 rounded-lg border ${
                  item.type === "user"
                    ? "bg-slate-800/50 border-slate-700"
                    : "bg-blue-500/10 border-blue-500/30"
                }`}
              >
                <p className="text-slate-200">{item.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-slate-700 bg-slate-800/30">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleEndSession}
            className="bg-red-600 hover:bg-red-700"
          >
            End Session
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
