"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Loader2, Send, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";

const MODELS = [
  {
    value: "oculus-1-0125",
    label: "oculus-1-0125",
    description: "General-purpose vision intelligence",
  },
  {
    value: "oculus-1.5-0503",
    label: "oculus-1.5-0503",
    description: "Enhanced multi-modal reasoning",
  },
] as const;

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function ChatPage() {
  const [model, setModel] = useState<(typeof MODELS)[number]["value"]>("oculus-1.5-0503");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "I'm Oculus Vision—ask about detection strategies, performance tuning, or integration tips.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    setTimeout(() => {
      const assistantsThoughts = generateAssistantReply(userMessage.content, model);
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: assistantsThoughts,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsStreaming(false);

      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
        }
      });
    }, 900);
  };

  const contextHints = useMemo(() => {
    return model === "oculus-1.5-0503"
      ? [
          "Ask for multi-camera fusion tactics",
          "Request semantic segmentation tips",
          "Explore streaming inference flows",
        ]
      : [
          "Optimize edge deployment",
          "Fine-tune latency settings",
          "Request quick classification recipe",
        ];
  }, [model]);

  return (
    <>
      <SiteHeader />
      <div className="relative min-h-screen bg-black text-white overflow-hidden pt-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-20 right-1/3 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center"
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs uppercase tracking-[0.35em] text-white/60">
              <Sparkles className="h-4 w-4" />
              Interactive Console
            </div>
            <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl">
              Chat with Oculus AI
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-balance text-sm text-white/60 sm:text-base">
              Prototype conversations with our latest vision models, simulate reasoning sequences, and get ready-to-ship integration guidance in real time.
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="border-white/10 bg-white/5 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-white">Session Settings</CardTitle>
                  <CardDescription className="text-white/60">
                    Configure which model powers this conversation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <div className="relative">
                      <select
                        id="model"
                        value={model}
                        onChange={(event) => setModel(event.target.value as (typeof MODELS)[number]["value"])}
                        className="flex h-10 w-full appearance-none rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
                      >
                        {MODELS.map((modelOption) => (
                          <option key={modelOption.value} value={modelOption.value} className="bg-black text-white">
                            {modelOption.label}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white/40">▾</span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                      Hints
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-white/80">
                      {contextHints.map((hint) => (
                        <li key={hint} className="flex items-start gap-2">
                          <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-white/50" />
                          {hint}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-xs text-white/50">
                    Responses are simulated for this demo. Integrate the streaming API to connect your own backend and persist session history.
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col"
            >
              <Card className="flex flex-1 flex-col border-white/10 bg-white/5 backdrop-blur-lg">
                <CardHeader className="border-b border-white/10">
                  <CardTitle className="flex items-center gap-3 text-white">
                    <Bot className="h-6 w-6 text-white/70" />
                    Oculus Conversation
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    Typing indicators, history timeline, and staged responses for rapid prototyping
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
                  <div ref={containerRef} className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
                    <AnimatePresence initial={false}>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          layout
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -12 }}
                          transition={{ duration: 0.3 }}
                          className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                        >
                          <div className={`mt-1 flex h-9 w-9 items-center justify-center rounded-full border ${
                            message.role === "user" ? "border-white/40 bg-white/20" : "border-white/10 bg-white/10"
                          }`}>
                            {message.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                          </div>
                          <div
                            className={`max-w-xl rounded-2xl border px-4 py-3 text-sm leading-relaxed backdrop-blur ${
                              message.role === "user"
                                ? "border-white/20 bg-white/10 text-white"
                                : "border-white/10 bg-black/40 text-white/90"
                            }`}
                          >
                            <p>{message.content}</p>
                            <span className="mt-3 block text-right text-[10px] uppercase tracking-widest text-white/40">
                              {message.timestamp}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {isStreaming ? (
                      <motion.div
                        className="flex items-center gap-3 text-sm text-white/60"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                      >
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Oculus AI is crafting a response...
                      </motion.div>
                    ) : null}
                  </div>

                  <form onSubmit={handleSubmit} className="border-t border-white/10 p-4">
                    <div className="flex items-end gap-3">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="message" className="text-white/60">
                          Message
                        </Label>
                        <Input
                          id="message"
                          placeholder="Describe your dataset, ask for tuning strategies, or plan your deployment pipeline..."
                          value={input}
                          onChange={(event) => setInput(event.target.value)}
                          className="bg-black/40 text-white border-white/10"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="group flex h-12 w-12 items-center justify-center rounded-full bg-white text-black hover:bg-gray-200"
                        disabled={isStreaming}
                      >
                        {isStreaming ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4 transition-transform group-hover:-translate-y-1" />
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 grid gap-4 text-center text-xs text-white/40 sm:grid-cols-3"
          >
            <p>Streaming ready SDK integration</p>
            <p>Persistent chat history via vision thread IDs</p>
            <p>Model switch retains context window metadata</p>
          </motion.div>
        </div>
      </div>
    </>
  );
}

function generateAssistantReply(prompt: string, model: string): string {
  const baseResponse =
    "Based on your prompt, here is how I'd approach the scenario for optimal performance:";

  const modelSpecific =
    model === "oculus-1.5-0503"
      ? "Using the enhanced multi-modal capabilities, I'd fuse temporal frames and language cues to build a richer scene representation."
      : "Leveraging the foundation model, I'd focus on high-confidence detections with efficient edge-friendly transforms.";

  const promptInsight = prompt.length > 120
    ? "It looks like you're considering a complex workflow. Breaking it into modular inference steps helps maintain clarity and traceability."
    : "Your objective can be handled in a single pass. Consider batching similar requests to maximize token efficiency.";

  return `${baseResponse}\n\n${modelSpecific}\n\n${promptInsight}`;
}
