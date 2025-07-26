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
// Fixed ElevenLabs TTS Manager
class ElevenLabsTTSManager {
  private apiKey: string;
  private voiceId: string;
  private isPlaying = false;
  private audioContext: AudioContext | null = null;
  private audioQueue: ArrayBuffer[] = [];
  private isProcessingQueue = false;
  private textBuffer = '';
  private bufferTimer: NodeJS.Timeout | null = null;

  constructor(apiKey: string, voiceId = 'pNInz6obpgDQGcFmaJgB') {
    this.apiKey = apiKey;
    this.voiceId = voiceId;
    console.log('TTS Manager initialized with API key:', apiKey ? 'Present' : 'Missing');
  }

  private async initAudioContext() {
    if (this.audioContext) return;
    
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Resume audio context if suspended (required by browser policies)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      console.log('Audio context initialized:', this.audioContext.state);
    } catch (error) {
      console.error('Audio context initialization failed:', error);
    }
  }

  // Real-time streaming speech
  async speak(text: string) {
    if (!text.trim()) return;
    
    console.log('Speaking text:', text);

    // Initialize audio context when first called (user interaction required)
    await this.initAudioContext();

    // Buffer text to form complete sentences
    this.textBuffer += text;
    
    if (this.bufferTimer) {
      clearTimeout(this.bufferTimer);
    }

    // Process buffer after short delay to accumulate complete words/sentences
    this.bufferTimer = setTimeout(() => {
      this.processTextBuffer();
    }, 500); // Increased delay to prevent word repetition
  }

  private async processTextBuffer() {
    if (!this.textBuffer.trim()) return;

    const textToSpeak = this.textBuffer.trim();
    this.textBuffer = '';

    console.log('Processing text buffer:', textToSpeak);

    // Skip if text is too short or just punctuation
    if (textToSpeak.length < 2 || /^[^\w]*$/.test(textToSpeak)) {
      console.log('Skipping short/punctuation text:', textToSpeak);
      return;
    }

    try {
      // Check if API key is present
      if (!this.apiKey || this.apiKey === 'your-api-key-here') {
        console.error('ElevenLabs API key is missing!');
        return;
      }

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}/stream`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text: textToSpeak,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.0,
            use_speaker_boost: true
          }
        }),
      });

      console.log('ElevenLabs response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ElevenLabs API error:', response.status, errorText);
        return;
      }

      const audioBuffer = await response.arrayBuffer();
      console.log('Audio buffer received, size:', audioBuffer.byteLength);
      
      if (audioBuffer.byteLength > 0) {
        this.audioQueue.push(audioBuffer);
        this.processAudioQueue();
      }

    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
    }
  }

  private async processAudioQueue() {
    if (this.isProcessingQueue || this.audioQueue.length === 0) return;

    console.log('Starting audio queue processing, queue length:', this.audioQueue.length);
    
    this.isProcessingQueue = true;
    this.isPlaying = true;

    while (this.audioQueue.length > 0) {
      const audioBuffer = this.audioQueue.shift()!;
      try {
        await this.playAudioBuffer(audioBuffer);
      } catch (error) {
        console.error('Error playing audio buffer:', error);
      }
    }

    this.isProcessingQueue = false;
    this.isPlaying = false;
    console.log('Audio queue processing completed');
  }

  private async playAudioBuffer(buffer: ArrayBuffer): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!this.audioContext) {
        await this.initAudioContext();
        if (!this.audioContext) {
          reject(new Error('Audio context not available'));
          return;
        }
      }

      // Ensure audio context is running
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      try {
        // Use the newer promise-based API if available
        if (this.audioContext.decodeAudioData.length === 1) {
          const audioBuffer = await this.audioContext.decodeAudioData(buffer.slice(0));
          const source = this.audioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(this.audioContext.destination);
          
          source.onended = () => {
            console.log('Audio finished playing');
            resolve();
          };
          
          console.log('Playing audio buffer');
          source.start(0);
        } else {
          // Fallback to callback-based API
          this.audioContext.decodeAudioData(
            buffer.slice(0),
            (audioBuffer) => {
              const source = this.audioContext!.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(this.audioContext!.destination);
              
              source.onended = () => {
                console.log('Audio finished playing');
                resolve();
              };
              
              console.log('Playing audio buffer (callback)');
              source.start(0);
            },
            (error) => {
              console.error('Audio decode error:', error);
              reject(error);
            }
          );
        }
      } catch (error) {
        console.error('Error in playAudioBuffer:', error);
        reject(error);
      }
    });
  }

  stop() {
    console.log('Stopping TTS');
    
    // Clear buffers and queues
    this.textBuffer = '';
    this.audioQueue = [];
    this.isPlaying = false;
    this.isProcessingQueue = false;
    
    if (this.bufferTimer) {
      clearTimeout(this.bufferTimer);
      this.bufferTimer = null;
    }

    // Stop audio context
    if (this.audioContext?.state === 'running') {
      this.audioContext.suspend();
    }
  }

  resume() {
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  get speaking() {
    return this.isPlaying;
  }
}
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

  // ElevenLabs TTS Manager
  const ttsManagerRef = useRef<ElevenLabsTTSManager | null>(null);

  // Initialize ElevenLabs TTS
  useEffect(() => {
    if (isOpen && !ttsManagerRef.current) {
      const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
      
      if (!ELEVENLABS_API_KEY) {
        console.error('NEXT_PUBLIC_ELEVENLABS_API_KEY is not set in environment variables');
        return;
      }
      
      console.log('Initializing TTS manager...');
      ttsManagerRef.current = new ElevenLabsTTSManager(ELEVENLABS_API_KEY);
    }
  }, [isOpen]);


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
  
  // Handle socket events with proper state management
  useEffect(() => {
    if (!isOpen) return;

    let fullResponseBuffer = ''; // Local variable to track full response

    initiateSocket({
      userEmail: "user@example.com",
      token: "your-token-if-any",
    });
    const socket = getSocket();

    socket?.on("chatResponseChunk", (chunk: string) => {
      console.log('Received chunk:', chunk);
      
      setIsAiSpeaking(true);
      
      // Update local buffer
      fullResponseBuffer += chunk;
      
      // Update UI state
      setAiResponseBuffer(fullResponseBuffer);
      
      // Speak with ElevenLabs in real-time (only the new chunk)
      if (ttsManagerRef.current) {
        console.log('Calling TTS speak method for chunk:', chunk);
        ttsManagerRef.current.speak(chunk);
      } else {
        console.warn('TTS manager not initialized');
      }
    });

    socket?.on("chatResponseDone", () => {
      console.log('Chat response done, full response:', fullResponseBuffer);
      
      // Add complete response to conversation history
      setConversationHistory((prev) => [
        ...prev,
        { type: "ai", content: fullResponseBuffer, timestamp: new Date() },
      ]);
      
      // Clear the buffer
      setAiResponseBuffer("");
      fullResponseBuffer = ''; // Reset local buffer
      
      // Check if TTS is still playing after a delay
      setTimeout(() => {
        if (ttsManagerRef.current && !ttsManagerRef.current.speaking) {
          setIsAiSpeaking(false);
        }
      }, 2000);
    });

    return () => {
      socket?.off("chatResponseChunk");
      socket?.off("chatResponseDone");
      ttsManagerRef.current?.stop();
    };
  }, [isOpen]);

  // Auto-cleanup TTS on component unmount
  useEffect(() => {
    return () => {
      ttsManagerRef.current?.stop();
    };
  }, []);

  // Test TTS function (you can call this to test)
  const testTTS = async () => {
    if (ttsManagerRef.current) {
      console.log('Testing TTS...');
      await ttsManagerRef.current.speak("Hello, this is a test of the text to speech system.");
    }
  };


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
     ttsManagerRef.current?.stop();
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
          {/* Test TTS Button (remove this in production) */}
          <Button
            variant="outline"
            size="sm"
            onClick={testTTS}
            className="mr-2"
          >
            Test TTS
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
