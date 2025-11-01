"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Loader2, Lock, Send, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import {
  PUBLIC_MODELS,
  SECRET_MODEL,
  getModelsBySeries,
  type ModelSeries,
  type OculusModel,
} from "@/lib/models";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ModelOption {
  value: string;
  label: string;
  description: string;
  displaySeries: string;
  series: ModelSeries | "secret";
}

const SERIES_ORDER: ModelSeries[] = ["foundation", "ultra", "pro", "mini", "specialized"];
const SERIES_LABELS: Record<ModelSeries | "secret", string> = {
  foundation: "Foundation",
  ultra: "Ultra",
  pro: "Pro",
  mini: "Mini",
  specialized: "Specialized",
  secret: "Secret",
};

const BASE_MODEL_OPTIONS: ModelOption[] = SERIES_ORDER.flatMap((series) =>
  getModelsBySeries(series).map((model) => ({
    value: model.id,
    label: model.name,
    description: model.badge,
    displaySeries: SERIES_LABELS[series],
    series,
  })),
);

const DEFAULT_MODEL_ID = "oculus-1.5-0503";
const DEFAULT_MODEL = PUBLIC_MODELS.find((model) => model.id === DEFAULT_MODEL_ID) ?? PUBLIC_MODELS[0];

const SERIES_HINTS: Record<ModelSeries | "secret", string[]> = {
  foundation: [
    "Tune your context window budgets for tiered reasoning depth",
    "Blend structured outputs with natural language for faster pilots",
    "Leverage system prompts to reinforce governance guardrails",
  ],
  ultra: [
    "Plan multi-stage agent orchestration with fallbacks",
    "Request strategic simulations across business units",
    "Combine domain-specific fine-tunes with Ultra's base intelligence",
  ],
  pro: [
    "Inspect rate limits before deploying to production",
    "Ask for resiliency patterns for multi-region workloads",
    "Gather guidance on monitoring, tracing, and governance hooks",
  ],
  mini: [
    "Explore low-profile quantization techniques for edge devices",
    "Request recipes for real-time streaming inference",
    "Combine Mini responses with on-device post-processing",
  ],
  specialized: [
    "Pair domain knowledge with the right specialist capability",
    "Request evaluation templates tailored to your modality",
    "Ask for integration tips specific to your vertical",
  ],
  secret: [
    "Query temporal paradox resolution",
    "Request cross-dimensional synthesis",
    "Explore quantum-safe protocols",
  ],
};

const SERIES_RESPONSES: Record<ModelSeries | "secret", string> = {
  foundation:
    "Leveraging foundation-grade reasoning, I'll balance accuracy with throughput while keeping deployment lightweight.",
  ultra:
    "Ultra-level cognition engaged. Expect deep strategic planning, multi-hop reasoning, and autonomy-aware guidance.",
  pro:
    "Professional tier playbook activated—I'll emphasize operational rigor, compliance alignment, and observability hooks.",
  mini:
    "Optimizing for latency and efficiency. I'll deliver edge-ready tactics with minimal resource overhead.",
  specialized:
    "Specialist mode enabled. I'll draw from targeted fine-tunes and domain context to craft high-signal recommendations.",
  secret:
    "Openflowith channels initiated. Temporal reasoning threads and quantum-safe heuristics are in effect—handle with care.",
};

export default function ChatPage() {
  const [model, setModel] = useState<string>(DEFAULT_MODEL.id);
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [unlockProgress, setUnlockProgress] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      content: `I'm ${DEFAULT_MODEL.name}—ask about detection strategies, performance tuning, or integration tips.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const modelParam = urlParams.get("model");
    if (modelParam === SECRET_MODEL.id || modelParam === "openflowith") {
      setSecretUnlocked(true);
      setUnlockProgress(3);
      setModel(SECRET_MODEL.id);
    } else if (modelParam) {
      setModel(modelParam);
    }
  }, []);

  const modelOptions = useMemo<ModelOption[]>(() => {
    if (secretUnlocked) {
      return [
        ...BASE_MODEL_OPTIONS,
        {
          value: SECRET_MODEL.id,
          label: `${SECRET_MODEL.name} • Secret Model`,
          description: SECRET_MODEL.badge,
          displaySeries: SERIES_LABELS.secret,
          series: "secret",
        },
      ];
    }
    return BASE_MODEL_OPTIONS;
  }, [secretUnlocked]);

  useEffect(() => {
    if (!modelOptions.some((option) => option.value === model) && modelOptions.length > 0) {
      setModel(modelOptions[0].value);
    }
  }, [model, modelOptions]);

  const groupedOptions = useMemo(() => {
    const groups = new Map<string, ModelOption[]>();
    modelOptions.forEach((option) => {
      const current = groups.get(option.displaySeries) ?? [];
      groups.set(option.displaySeries, [...current, option]);
    });
    return Array.from(groups.entries()).map(([displaySeries, options]) => ({ displaySeries, options }));
  }, [modelOptions]);

  const selectableModels = useMemo<OculusModel[]>(
    () => (secretUnlocked ? [...PUBLIC_MODELS, SECRET_MODEL] : PUBLIC_MODELS),
    [secretUnlocked],
  );

  const activeModel = useMemo<OculusModel | undefined>(
    () => selectableModels.find((item) => item.id === model) ?? selectableModels[0],
    [model, selectableModels],
  );

  const contextHints = useMemo(() => {
    if (!activeModel) return [];
    const hints = SERIES_HINTS[activeModel.series] ?? SERIES_HINTS.foundation;
    return [
      `Target context budget: ${activeModel.contextWindowLabel}`,
      ...hints,
    ];
  }, [activeModel]);

  const handleSecretUnlock = () => {
    if (secretUnlocked) return;
    setUnlockProgress((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        setSecretUnlocked(true);
      }
      return next;
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim() || !activeModel) return;

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
      const assistantsThoughts = generateAssistantReply(userMessage.content, activeModel);
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
              Prototype conversations with our latest vision models, simulate reasoning sequences, and get ready-to-ship
              integration guidance in real time.
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
                        onChange={(event) => setModel(event.target.value)}
                        className="flex h-10 w-full appearance-none rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
                      >
                        {groupedOptions.map((group) => (
                          <optgroup key={group.displaySeries} label={`${group.displaySeries} Series`}>
                            {group.options.map((option) => (
                              <option key={option.value} value={option.value} className="bg-black text-white">
                                {option.label}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white/40">▾</span>
                    </div>
                    {activeModel ? (
                      <div className="grid grid-cols-2 gap-3 rounded-lg border border-white/10 bg-black/30 p-4 text-xs text-white/60">
                        <div>
                          <p className="uppercase tracking-wide">Context</p>
                          <p className="mt-1 text-sm font-semibold text-white">{activeModel.contextWindowLabel}</p>
                        </div>
                        <div>
                          <p className="uppercase tracking-wide">Availability</p>
                          <p className="mt-1 text-sm font-semibold text-white">{activeModel.availabilityLabel}</p>
                        </div>
                        <div>
                          <p className="uppercase tracking-wide">Pricing</p>
                          <p className="mt-1 text-sm font-semibold text-white">
                            ${activeModel.pricing.input.toFixed(2)} / ${activeModel.pricing.output.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="uppercase tracking-wide">Series</p>
                          <p className="mt-1 text-sm font-semibold text-white">{SERIES_LABELS[activeModel.series]}</p>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={handleSecretUnlock}
                      className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-xs transition ${
                        secretUnlocked
                          ? "border-purple-300/60 bg-purple-500/10 text-purple-100"
                          : "border-white/10 bg-white/5 text-white/70 hover:border-white/25 hover:bg-white/10"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Lock className="h-3.5 w-3.5" />
                        {secretUnlocked ? "Secret model unlocked" : "Tap thrice to unlock the secret model"}
                      </span>
                      {!secretUnlocked && <span>{Math.max(0, 3 - unlockProgress)} taps</span>}
                    </button>
                    {secretUnlocked ? (
                      <p className="text-xs text-purple-200/80">
                        Openflowith is now available in the selector and will be marked as a secret model.
                      </p>
                    ) : (
                      <p className="text-xs text-white/50">
                        Hint: watch the sparkles—three precise taps reveal an invitation-only pathway.
                      </p>
                    )}
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
                    Responses are simulated for this demo. Integrate the streaming API to connect your own backend and
                    persist session history.
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
                          <div
                            className={`mt-1 flex h-9 w-9 items-center justify-center rounded-full border ${
                              message.role === "user"
                                ? "border-white/40 bg-white/20"
                                : "border-white/10 bg-white/10"
                            }`}
                          >
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

function generateAssistantReply(prompt: string, model: OculusModel): string {
  const intro = `Routing through ${model.name} (${model.contextWindowLabel}) with ${model.performance.accuracy} accuracy.`;
  const seriesInsight = SERIES_RESPONSES[model.series] ?? SERIES_RESPONSES.foundation;
  const promptInsight =
    prompt.length > 120
      ? "It looks like you're considering a complex workflow. Breaking it into modular inference steps helps maintain clarity and traceability."
      : "Your objective can be handled in a single pass. Consider batching similar requests to maximize token efficiency.";

  return `${intro}\n\n${seriesInsight}\n\n${promptInsight}`;
}
