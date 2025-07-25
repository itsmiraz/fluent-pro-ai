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

// Generate scenario based on learning goal
// const generateScenario = (onboardingData?: TOnboardingData): Scenario => {
//   if (!onboardingData) {
//     return {
//       id: "general",
//       title: "Casual Conversation",
//       description: "Practice everyday conversation skills",
//       context:
//         "You're having a friendly chat with someone you just met at a coffee shop.",
//     };
//   }

//   const { goal, level } = onboardingData;

//   switch (goal.id) {
//     case "daily-conversation":
//       return {
//         id: "daily-chat",
//         title: "Neighborhood Chat",
//         description: "Practice casual conversation with a neighbor",
//         context:
//           "You've just moved to a new neighborhood and are chatting with your neighbor about the area.",
//       };
//     case "professional-corporate":
//       return {
//         id: "meeting-delay",
//         title: "Explaining a Project Delay",
//         description: "Communicate a delay to your manager professionally",
//         context:
//           "You need to inform your boss about a project delay and propose solutions.",
//       };
//     case "sales-client-meetings":
//       return {
//         id: "product-demo",
//         title: "Product Demonstration",
//         description: "Present your product to a potential client",
//         context:
//           "You're demonstrating your company's new software to an interested client.",
//       };
//     case "ielts-academic":
//       return {
//         id: "ielts-part2",
//         title: "IELTS Speaking Part 2",
//         description: "Describe a memorable experience",
//         context:
//           "Describe a time when you learned something new. You have 2 minutes to speak.",
//       };
//     case "public-speaking":
//       return {
//         id: "presentation-intro",
//         title: "Presentation Opening",
//         description: "Practice opening a presentation confidently",
//         context:
//           "You're opening a presentation about climate change to a group of colleagues.",
//       };
//     case "writing-email":
//       return {
//         id: "email-discussion",
//         title: "Discussing Email Content",
//         description: "Verbally discuss professional email topics",
//         context:
//           "You're discussing the content of an important email with a colleague before sending it.",
//       };
//     default:
//       return {
//         id: "custom",
//         title: "Custom Practice",
//         description: `Practice ${goal.title.toLowerCase()}`,
//         context: `Let's practice scenarios related to ${goal.title.toLowerCase()}.`,
//       };
//   }
// };

// // Initialize scenario when modal opens
// useEffect(() => {
//   if (isOpen && !currentScenario) {
//     const scenario = generateScenario(onboardingData);
//     setCurrentScenario(scenario);

//     // Add initial AI message
//     setConversationHistory([
//       {
//         type: "ai",
//         content: `${scenario.context} I'll be your conversation partner. When you're ready, click the microphone to start speaking!`,
//         timestamp: new Date(),
//       },
//     ]);
//   }
// }, [isOpen, onboardingData]);

/**
 * On click voice transcript starts
 * On saying some thing it stores that into a state
 * On stop recording it send the transcript to the backend through socket
 * Backend responses in buffer
 * And we show that
 *
 *
 */
const speakChunk = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1; // adjust speed if needed
  utterance.pitch = 1; // adjust pitch
  utterance.lang = "en-US";
  window.speechSynthesis.speak(utterance);
};

export function VoiceModal({
  isOpen,
  onClose,
  onboardingData,
}: VoiceModalProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [transcriptionArr, setTranscriptionArr] = useState<string[]>([]);
  const [aiResponse, setAiResponse] = useState("");

  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [isScenarioSelectorOpen, setIsScenarioSelectorOpen] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<
    Array<{
      type: "user" | "ai";
      content: string;
      timestamp: Date;
    }>
  >([]);

  const SpeechRecognition =
    typeof window !== "undefined"
      ? window?.SpeechRecognition || (window as any).webkitSpeechRecognition
      : null;

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const waveformRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  // Waveform animation
  useEffect(() => {
    if (isListening && waveformRef.current) {
      const animate = () => {
        const bars = waveformRef.current?.children;
        if (bars) {
          Array.from(bars).forEach((bar, index) => {
            const height = Math.random() * 40 + 10;
            (bar as HTMLElement).style.height = `${height}px`;
          });
        }
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isListening]);

  const [aiResponseBuffer, setAiResponseBuffer] = useState("");
  let bufferedText = "";

  const speakBuffered = (chunk: string) => {
    bufferedText += chunk;

    // If chunk contains punctuation, assume it's a complete phrase
    if (/[.?!]\s*$/.test(chunk)) {
      const utterance = new SpeechSynthesisUtterance(bufferedText);
      utterance.rate = 1.05;
      utterance.pitch = 1;
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
      bufferedText = ""; // reset after speaking
    }
  };
  const [audioChunks, setAudioChunks] = useState<Uint8Array[]>([]);
  useEffect(() => {
    if (isOpen) {
      initiateSocket({
        userEmail: "user@example.com",
        token: "your-token-if-any",
      });

      const socket = getSocket();
      console.log("here");
      socket?.on("ttsAudioChunk", (chunk: ArrayBuffer) => {
        setAudioChunks((prev) => [...prev, new Uint8Array(chunk)]);
      });

      socket?.on("ttsAudioDone", () => {
        // Combine chunks into Blob and play audio
        const audioBlob = new Blob(audioChunks, { type: "audio/mpeg" });
        const audioUrl = URL.createObjectURL(audioBlob);
        console.log("Audio URL:", audioUrl);
        const audio = new Audio(audioUrl);
        audio.play().catch(console.error);
        setAudioChunks([]); // Reset for next audio
      });

      socket?.on("chatResponseChunk", (chunk: string) => {
        setIsAiSpeaking(true);
        setAiResponseBuffer((prev) => prev + chunk);
        speakBuffered(chunk);
      });

      socket?.on("chatResponseDone", () => {
        setAiResponse(aiResponseBuffer);
        setIsAiSpeaking(true);
        setConversationHistory((prev) => [
          ...prev,
          { type: "ai", content: aiResponseBuffer, timestamp: new Date() },
        ]);
        // setTimeout(() => setIsAiSpeaking(false), 3000);
        setIsAiSpeaking(false);
        setAiResponseBuffer("");
      });

      return () => {
        socket?.off("chatResponseChunk");
        socket?.off("chatResponseDone");
        socket?.off("ttsAudioChunk");
        socket?.off("ttsAudioDone");
      };
    }
  }, [isOpen, aiResponseBuffer]);

  const lastFinalTranscriptRef = useRef("");
  const transcriptionArrRef = useRef<string[]>([]);
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

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log("started proccess");
      processVoiceInput();
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        lastFinalTranscriptRef.current = finalTranscript.trim();
        setTranscriptionArr((prev) => {
          const newArr = [...prev, finalTranscript.trim()];
          transcriptionArrRef.current = newArr;
          return newArr;
        });
      }

      // Update current live transcript
      setTranscription(interimTranscript || finalTranscript);
    };

    recognition.start();
  };

  const processVoiceInput = () => {
    const latestTranscriptions = transcriptionArrRef.current;
    console.log("Transcriptions from ref:", latestTranscriptions.join(", "));

    if (latestTranscriptions.length === 0) return;

    const socket = getSocket();
    if (!socket || !socket.connected) {
      console.error("Socket not connected");
      return;
    }

    // Add user message to history
    const userMessage = {
      type: "user" as const,
      content: latestTranscriptions.join(", "),
      timestamp: new Date(),
    };
    setTranscription("");
    setTranscriptionArr([]);
    setConversationHistory((prev) => [...prev, userMessage]);
    console.log(latestTranscriptions.join(", "));
    // Prepare messages array for backend with roles and content
    const messagesForBackend = [
      {
        role: "system",
        content: currentScenario?.context || "You are an AI assistant.",
      },
      ...conversationHistory.map((msg) => ({
        role: msg.type === "user" ? "user" : "assistant",
        content: msg.content,
      })),
      {
        role: "user",
        content: latestTranscriptions.join(", "),
      },
    ];
    transcriptionArrRef.current = [];

    // Send chat message event via socket
    socket.emit("chatMessage", {
      model: "mistral",
      messages: messagesForBackend,
    });
  };

  const handleEndSession = () => {
    setIsListening(false);
    setTranscription("");
    setAiResponse("");
    setConversationHistory([]);
    setCurrentScenario(null);
    onClose();
    window.speechSynthesis.cancel();
  };

  const handleSwitchScenario = () => {
    setIsScenarioSelectorOpen(true);
  };

  const handleScenarioSelect = (scenario: Scenario) => {
    setCurrentScenario(scenario);
    setConversationHistory([
      {
        type: "ai",
        content: `${scenario.context} I'll be your conversation partner. When you're ready, click the microphone to start speaking!`,
        timestamp: new Date(),
      },
    ]);
    setIsScenarioSelectorOpen(false);
    setTranscription("");
    setAiResponse("");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] custom-scroll-hide overflow-y-auto  p-0 border-slate-700 text-white">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <h2 className="text-lg font-semibold">Voice Conversation</h2>
                {/* <p className="text-sm text-slate-300">
                  {currentScenario?.title || "Loading scenario..."}
                </p> */}
              </div>
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

          {/* Scenario Context */}
          {/* {currentScenario && (
            <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700">
              <div className="flex items-start gap-3">
                <Badge
                  variant="secondary"
                  className="bg-blue-500/20 text-blue-300 border-blue-500/30"
                >
                  Scenario
                </Badge>
                <div className="flex-1">
                  <p className="text-sm text-slate-300">
                    {currentScenario.context}
                  </p>
                </div>
              </div>
            </div>
          )} */}

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
                {isListening ? (
                  <Square className="h-8 w-8" />
                ) : (
                  <Mic className="h-8 w-8" />
                )}
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
                {isListening
                  ? "Listening... Click to stop"
                  : "Click to start speaking"}
              </p>
            </div>

            {/* Transcription */}
            {(transcriptionArr.length > 0 || transcription) && (
              <div className="space-y-2 ">
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
                    {transcription.trim() &&
                      transcription.trim() !==
                        lastFinalTranscriptRef.current && (
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
                    <div className="flex items-center gap-1">
                      <Volume2 className="h-3 w-3 text-blue-400" />
                      <span className="text-xs text-blue-400">Speaking...</span>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <p className="text-slate-200">{aiResponseBuffer}</p>
                </div>
              </div>
            )}

            {[...conversationHistory].reverse().map((item, i) => (
              <div key={i}>
                {item.type === "ai" && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-blue-500/30 text-blue-300"
                      >
                        AI Coach
                      </Badge>
                    </div>
                    <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                      <p className="text-slate-200">{item.content}</p>
                    </div>
                  </div>
                )}
                {item.type === "user" && (
                  <div className="space-y-2 ">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-green-500/30 text-green-300"
                      >
                        You said ds
                      </Badge>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <p className="text-slate-200">{item.content}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Conversation History */}
            {/* {conversationHistory.length > 2 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-300">
                  Conversation History
                </h3>
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {conversationHistory.slice(1, -2).map((message, index) => (
                    <div
                      key={index}
                      className={`text-xs p-2 rounded ${
                        message.type === "user"
                          ? "bg-green-500/20 text-green-200"
                          : "bg-blue-500/20 text-blue-200"
                      }`}
                    >
                      <span className="font-medium">
                        {message.type === "user" ? "You: " : "AI: "}
                      </span>
                      {message.content}
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between p-6 border-t border-slate-700 bg-slate-800/30">
            <div className="flex gap-2">
              {/* <Button
                variant="outline"
                size="sm"
                onClick={handleSwitchScenario}
                className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 bg-transparent"
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Switch Scenario
              </Button> */}
              {/* <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTranscription("");
                  setAiResponse("");
                  setConversationHistory(conversationHistory.slice(0, 1));
                }}
                className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button> */}
            </div>
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

      {/* Scenario Selector Modal */}
      <ScenarioSelector
        isOpen={isScenarioSelectorOpen}
        onClose={() => setIsScenarioSelectorOpen(false)}
        onSelect={handleScenarioSelect}
        onboardingData={onboardingData}
      />
    </>
  );
}
