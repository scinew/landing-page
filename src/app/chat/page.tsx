"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Loader2,
  Lock,
  Send,
  Sparkles,
  User,
  Plus,
  Menu,
  X,
  MessageSquare,
  Settings,
  ChevronLeft,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  model: string;
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

const formatTime = (timestamp: string) => timestamp;
const ellipsize = (text: string, length = 48) => (text.length > length ? `${text.slice(0, length)}…` : text);

export default function ChatPage() {
  const createAssistantGreeting = (modelRecord: OculusModel) =>
    `You're speaking with ${modelRecord.name}. Ask about detection strategies, performance tuning, or deployment orchestration.`;

  const createConversation = (modelRecord: OculusModel): Conversation => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return {
      id: crypto.randomUUID(),
      title: "New Conversation",
      messages: [
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: createAssistantGreeting(modelRecord),
          timestamp,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      model: modelRecord.id,
    };
  };

  const initialConversationRef = useRef<Conversation | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [unlockProgress, setUnlockProgress] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    if (!initialConversationRef.current) {
      initialConversationRef.current = createConversation(DEFAULT_MODEL);
    }
    return [initialConversationRef.current];
  });
  const [activeConversationId, setActiveConversationId] = useState<string>(() => initialConversationRef.current?.id ?? "");
  const [model, setModel] = useState<string>(DEFAULT_MODEL.id);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(min-width: 1024px)");
    setSidebarOpen(media.matches);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const modelParam = urlParams.get("model");
    if (!modelParam) return;

    if (modelParam === SECRET_MODEL.id || modelParam === "openflowith") {
      setSecretUnlocked(true);
      setUnlockProgress(3);
      setModel(SECRET_MODEL.id);
      setConversations((prev) =>
        prev.map((conversation, index) =>
          index === 0
            ? {
                ...conversation,
                model: SECRET_MODEL.id,
                messages:
                  conversation.messages.length === 1 && conversation.messages[0].role === "assistant"
                    ? [
                        {
                          ...conversation.messages[0],
                          content: createAssistantGreeting(SECRET_MODEL),
                          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                        },
                      ]
                    : conversation.messages,
                updatedAt: new Date(),
              }
            : conversation,
        ),
      );
      setActiveConversationId((prev) => prev || (initialConversationRef.current?.id ?? ""));
    } else {
      const targetModel = PUBLIC_MODELS.find((item) => item.id === modelParam);
      if (!targetModel) return;
      setModel(targetModel.id);
      setConversations((prev) =>
        prev.map((conversation, index) =>
          index === 0
            ? {
                ...conversation,
                model: targetModel.id,
                messages:
                  conversation.messages.length === 1 && conversation.messages[0].role === "assistant"
                    ? [
                        {
                          ...conversation.messages[0],
                          content: createAssistantGreeting(targetModel),
                          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                        },
                      ]
                    : conversation.messages,
                updatedAt: new Date(),
              }
            : conversation,
        ),
      );
      setActiveConversationId((prev) => prev || (initialConversationRef.current?.id ?? ""));
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

  const modelMap = useMemo(() => {
    const map = new Map<string, OculusModel>();
    selectableModels.forEach((item) => map.set(item.id, item));
    map.set(SECRET_MODEL.id, SECRET_MODEL);
    return map;
  }, [selectableModels]);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) ?? null,
    [conversations, activeConversationId],
  );

  const activeModel = activeConversation ? modelMap.get(activeConversation.model) ?? modelMap.get(model) : modelMap.get(model);
  const messages = activeConversation?.messages ?? [];

  useEffect(() => {
    if (!activeConversation) return;
    if (activeConversation.model !== model) {
      setModel(activeConversation.model);
    }
  }, [activeConversation?.model]);

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

  const handleNewChat = () => {
    const referencedModel = activeModel ?? DEFAULT_MODEL;
    const newConversation = createConversation(referencedModel);
    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    setModel(referencedModel.id);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setActiveConversationId(conversation.id);
    setModel(conversation.model);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleModelSelection = (value: string) => {
    setModel(value);
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === activeConversationId
          ? {
              ...conversation,
              model: value,
            }
          : conversation,
      ),
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim() || !activeConversation || !activeModel) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp,
    };

    const previewTitle = ellipsize(input.trim(), 48);

    setConversations((prev) => {
      const updated = prev.map((conversation) =>
        conversation.id === activeConversationId
          ? {
              ...conversation,
              messages: [...conversation.messages, userMessage],
              title:
                conversation.messages.length === 1 && conversation.messages[0].role === "assistant"
                  ? previewTitle
                  : conversation.title,
              updatedAt: new Date(),
            }
          : conversation,
      );
      return updated;
    });

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
      setConversations((prev) =>
        prev
          .map((conversation) =>
            conversation.id === activeConversationId
              ? {
                  ...conversation,
                  messages: [...conversation.messages, assistantMessage],
                  updatedAt: new Date(),
                }
              : conversation,
          )
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
      );
      setIsStreaming(false);

      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
        }
      });
    }, 900);
  };

  return (
    <div className="relative flex min-h-screen bg-black text-white">
      <AnimatePresence>{sidebarOpen && <SidebarOverlay onDismiss={() => setSidebarOpen(false)} />}</AnimatePresence>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="fixed inset-y-0 left-0 z-50 flex w-80 flex-col border-r border-white/10 bg-black/95 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <Link href="/" className="flex items-center gap-2 font-mono text-sm uppercase tracking-[0.3em] text-white/80">
                <Eye className="h-5 w-5" />
                Oculus AI
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="text-white/60 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-4">
              <Button
                onClick={handleNewChat}
                className="flex w-full items-center justify-center gap-2 bg-white text-black hover:bg-gray-200"
              >
                <Plus className="h-4 w-4" />
                New Chat
              </Button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-white/40">History</div>
              <div className="mt-3 space-y-2">
                {conversations.map((conversation) => {
                  const lastMessage = conversation.messages[conversation.messages.length - 1];
                  const conversationModel = modelMap.get(conversation.model);
                  const isActive = conversation.id === activeConversationId;
                  return (
                    <button
                      key={conversation.id}
                      onClick={() => handleConversationSelect(conversation)}
                      className={`w-full rounded-lg border p-3 text-left transition-all ${
                        isActive
                          ? "border-white/30 bg-white/10 text-white"
                          : "border-white/5 bg-transparent text-white/70 hover:border-white/20 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-semibold truncate">{conversation.title}</div>
                        <span className="text-[10px] uppercase tracking-wide text-white/40">
                          {lastMessage ? formatTime(lastMessage.timestamp) : ""}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-white/40">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>{conversation.messages.length} messages</span>
                        <span className="text-white/30">•</span>
                        <span>{conversationModel?.name ?? "Model"}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 border-t border-white/10 p-4">
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
                  {secretUnlocked ? "Secret model unlocked" : "Tap thrice to unlock"}
                </span>
                {!secretUnlocked && <span>{Math.max(0, 3 - unlockProgress)} taps</span>}
              </button>
              <Button
                variant="outline"
                className="flex w-full items-center justify-center gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Link href="/">
                <Button
                  variant="outline"
                  className="flex w-full items-center justify-center gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className={`flex min-h-screen flex-1 flex-col transition-all duration-300 ${sidebarOpen ? "md:ml-80" : "ml-0"}`}>
        <header className="border-b border-white/10 bg-black/80 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4">
            <div className="flex items-center gap-3">
              {!sidebarOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="text-white/60 hover:bg-white/10 hover:text-white"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <div>
                <h1 className="text-lg font-semibold">{activeConversation?.title ?? "New Conversation"}</h1>
                <p className="text-xs text-white/40">
                  {activeModel?.name ?? "Oculus AI"} • {activeModel?.contextWindowLabel ?? "Context aware"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <select
                  value={model}
                  onChange={(event) => handleModelSelection(event.target.value)}
                  className="flex h-10 min-w-[200px] appearance-none items-center rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
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
              <Button
                variant="outline"
                onClick={handleNewChat}
                className="flex items-center gap-2 border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                <Plus className="h-4 w-4" />
                New Chat
              </Button>
              <Button
                variant="outline"
                onClick={() => setSettingsOpen(true)}
                className="flex items-center gap-2 border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <div className="hidden text-xs text-white/40 md:block">{messages.length} messages</div>
            </div>
          </div>
        </header>

        <div ref={containerRef} className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className={`mx-auto flex max-w-5xl gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border ${
                    message.role === "user" ? "border-white/40 bg-white/20" : "border-white/10 bg-white/10"
                  }`}
                >
                  {message.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </div>
                <div
                  className={`flex-1 rounded-2xl border px-4 py-3 text-sm leading-relaxed backdrop-blur ${
                    message.role === "user"
                      ? "border-white/20 bg-white/10 text-white"
                      : "border-white/10 bg-black/40 text-white/90"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <span className="mt-3 block text-right text-[10px] uppercase tracking-widest text-white/35">
                    {message.timestamp}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isStreaming && (
            <motion.div
              className="mx-auto flex max-w-5xl items-center gap-3 text-sm text-white/60"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10">
                <Bot className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Oculus AI is crafting a response...
              </div>
            </motion.div>
          )}
        </div>

        <div className="border-t border-white/10 bg-black/80 backdrop-blur-xl">
          <div className="mx-auto max-w-5xl px-4 py-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row md:items-end">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <Sparkles className="h-3 w-3" />
                  <span>{activeModel?.name ?? "Oculus AI"}</span>
                </div>
                <Input
                  placeholder="Ask about vision pipelines, integration tactics, or benchmarking insights..."
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  className="min-h-[3rem] border-white/10 bg-white/5 text-white focus-visible:ring-white/40"
                  disabled={isStreaming}
                />
              </div>
              <Button
                type="submit"
                className="group flex h-12 w-full items-center justify-center rounded-full bg-white text-black hover:bg-gray-200 md:w-12"
                disabled={isStreaming || !input.trim()}
              >
                {isStreaming ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 group-hover:-translate-y-1" />}
              </Button>
            </form>
            <p className="mt-3 text-xs text-white/35">
              Conversations refresh with each session. Connect your own backend to persist history and enable streaming responses.
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            initial={{ x: 360 }}
            animate={{ x: 0 }}
            exit={{ x: 360 }}
            transition={{ type: "spring", damping: 24, stiffness: 220 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-white/10 bg-black/95 backdrop-blur-xl"
          >
            <Card className="h-full border-0 bg-transparent shadow-none">
              <CardHeader className="border-b border-white/10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Settings</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSettingsOpen(false)}
                    className="text-white/60 hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <CardDescription className="text-white/60">
                  Fine-tune your chat workspace
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="settings-model" className="text-white">
                    Active model
                  </Label>
                  <div className="relative">
                    <select
                      id="settings-model"
                      value={model}
                      onChange={(event) => handleModelSelection(event.target.value)}
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
                  {activeModel && (
                    <div className="mt-3 grid grid-cols-2 gap-3 rounded-lg border border-white/10 bg-black/30 p-4 text-xs text-white/60">
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
                        <p className="uppercase tracking-wide">Accuracy</p>
                        <p className="mt-1 text-sm font-semibold text-white">{activeModel.performance.accuracy}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Context hints</p>
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
                  Responses are simulated for this demo. Integrate the streaming API to connect your backend, persist threads, and enable multi-participant conversations.
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarOverlay({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-40 bg-black md:hidden"
      onClick={onDismiss}
    />
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
