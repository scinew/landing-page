"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  Search,
  Brain,
  MessagesSquare,
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
import { formatTimestamp } from "@/lib/utils";

type ChatMode = "conversation" | "search" | "deepthink";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  mode?: ChatMode;
}

interface SearchResult {
  conversationId: string;
  conversationTitle: string;
  messageId: string;
  before: string;
  match: string;
  after: string;
  timestamp: number;
  prefixEllipsis: boolean;
  suffixEllipsis: boolean;
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

const ellipsize = (text: string, length = 48) => (text.length > length ? `${text.slice(0, length)}…` : text);

export default function ChatPage() {
  const createAssistantGreeting = useCallback(
    (modelRecord: OculusModel) =>
      `You're speaking with ${modelRecord.name}. Ask about detection strategies, performance tuning, or deployment orchestration.`,
    [],
  );

  const createConversation = useCallback(
    (modelRecord: OculusModel, timestamp: number): Conversation => {
      const createdAt = new Date(timestamp);
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
        createdAt,
        updatedAt: createdAt,
        model: modelRecord.id,
      };
    },
    [createAssistantGreeting],
  );

  const [initialTimestamp] = useState(() => Date.now());

  const initialConversation = useMemo(
    () => createConversation(DEFAULT_MODEL, initialTimestamp),
    [createConversation, initialTimestamp],
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [unlockProgress, setUnlockProgress] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(() => [initialConversation]);
  const [activeConversationId, setActiveConversationId] = useState<string>(() => initialConversation.id);

  const [model, setModel] = useState<string>(DEFAULT_MODEL.id);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>("conversation");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(min-width: 1024px)");
    const timeout = setTimeout(() => {
      setSidebarOpen(media.matches);
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const modelParam = urlParams.get("model");
    if (!modelParam) return;

    const timeout = setTimeout(() => {
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
                            timestamp: Date.now(),
                          },
                        ]
                      : conversation.messages,
                  updatedAt: new Date(),
                }
              : conversation,
          ),
        );
        setActiveConversationId((prev) => prev || initialConversation.id);
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
                            timestamp: Date.now(),
                          },
                        ]
                      : conversation.messages,
                  updatedAt: new Date(),
                }
              : conversation,
          ),
        );
        setActiveConversationId((prev) => prev || initialConversation.id);
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [createAssistantGreeting, initialConversation]);

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
      const timeout = setTimeout(() => {
        setModel(modelOptions[0].value);
      }, 0);

      return () => clearTimeout(timeout);
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
      const timeout = setTimeout(() => {
        setModel(activeConversation.model);
      }, 0);

      return () => clearTimeout(timeout);
    }
  }, [activeConversation, model]);

  const contextHints = useMemo(() => {
    if (!activeModel) return [];
    
    if (chatMode === "search") {
      return [
        "Search across all conversations and messages",
        "Use specific keywords for better results",
        "Results are ordered by recency",
        "Switch back to Conversation mode to continue chatting",
      ];
    }

    if (chatMode === "deepthink") {
      return [
        "Extended reasoning with structured analysis",
        "Expect detailed breakdowns and key takeaways",
        "Responses may take longer to generate",
        "Best for complex problems requiring deep analysis",
      ];
    }

    const hints = SERIES_HINTS[activeModel.series] ?? SERIES_HINTS.foundation;
    return [
      `Target context budget: ${activeModel.contextWindowLabel}`,
      ...hints,
    ];
  }, [activeModel, chatMode]);

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
    const newConversation = createConversation(referencedModel, Date.now());
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

  const performSearch = (query: string) => {
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    conversations.forEach((conversation) => {
      conversation.messages.forEach((message) => {
        const lowerContent = message.content.toLowerCase();
        const matchIndex = lowerContent.indexOf(lowerQuery);

        if (matchIndex >= 0) {
          const beforeStart = Math.max(0, matchIndex - 60);
          const afterEnd = Math.min(message.content.length, matchIndex + query.length + 60);
          const before = message.content.slice(beforeStart, matchIndex);
          const match = message.content.slice(matchIndex, matchIndex + query.length);
          const after = message.content.slice(matchIndex + query.length, afterEnd);

          results.push({
            conversationId: conversation.id,
            conversationTitle: conversation.title,
            messageId: message.id,
            before: before.trimStart(),
            match,
            after: after.trimEnd(),
            timestamp: message.timestamp,
            prefixEllipsis: beforeStart > 0,
            suffixEllipsis: afterEnd < message.content.length,
          });
        }
      });
    });

    setSearchResults(results.sort((a, b) => b.timestamp - a.timestamp));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;

    // Handle search mode
    if (chatMode === "search") {
      performSearch(input.trim());
      return;
    }

    if (!activeConversation || !activeModel) return;

    const timestamp = Date.now();
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp,
      mode: chatMode,
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

    const latency = chatMode === "deepthink" ? 2000 : 900;

    setTimeout(() => {
      const assistantsThoughts = generateAssistantReply(userMessage.content, activeModel, chatMode);
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: assistantsThoughts,
        timestamp: Date.now(),
        mode: chatMode,
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
    }, latency);
  };

  return (
    <div className="relative flex min-h-screen bg-black text-white">
      <AnimatePresence>{sidebarOpen && <SidebarOverlay onDismiss={() => setSidebarOpen(false)} />}</AnimatePresence>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="fixed inset-y-0 left-0 z-50 flex w-full max-w-sm flex-col border-r border-white/10 bg-black/95 backdrop-blur-xl lg:max-w-none lg:w-80"
          >
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <Link href="/" className="flex items-center gap-2 font-mono text-sm uppercase tracking-[0.3em] text-white/80">
                <Eye className="h-5 w-5" />
                Oculus AI
              </Link>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Close sidebar"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-4">
              <Button onClick={handleNewChat} variant="inverted" className="flex w-full items-center justify-center gap-2">
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
                          {lastMessage ? formatTimestamp(lastMessage.timestamp) : ""}
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
              <Button variant="outline" className="flex w-full items-center justify-center gap-2" onClick={() => setSettingsOpen(true)}>
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Link href="/">
                <Button variant="outline" className="flex w-full items-center justify-center gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className={`flex min-h-screen flex-1 flex-col transition-all duration-300 ${sidebarOpen ? "lg:ml-80" : "ml-0"}`}>
        <header className="border-b border-white/10 bg-black/80 backdrop-blur-xl">
          <div className="flex flex-col gap-4 px-4 py-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex w-full items-start gap-3 sm:w-auto sm:items-center">
              {!sidebarOpen && (
                <Button variant="ghost" size="sm" aria-label="Open sidebar" onClick={() => setSidebarOpen(true)}>
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <div>
                <h1 className="text-lg font-semibold">{activeConversation?.title ?? "New Conversation"}</h1>
                <p className="text-xs text-white/45 sm:text-sm sm:text-white/40">
                  {activeModel?.name ?? "Oculus AI"} • {activeModel?.contextWindowLabel ?? "Context aware"}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
              <div className="relative w-full sm:w-auto sm:min-w-[220px]">
                <select
                  value={model}
                  onChange={(event) => handleModelSelection(event.target.value)}
                  className="h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
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
                className="flex w-full items-center justify-center gap-2 sm:w-auto"
              >
                <Plus className="h-4 w-4" />
                New Chat
              </Button>
              <Button
                variant="outline"
                onClick={() => setSettingsOpen(true)}
                className="flex w-full items-center justify-center gap-2 sm:w-auto"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <div className="text-xs text-white/40 sm:text-right">{messages.length} messages</div>
            </div>
          </div>
        </header>

        <div
          ref={containerRef}
          className="flex-1 space-y-5 overflow-y-auto px-3 py-5 sm:space-y-6 sm:px-4 sm:py-6"
        >
          {chatMode === "search" && searchResults.length > 0 && (
            <div className="mx-auto w-full max-w-5xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-white">
                  Found {searchResults.length} {searchResults.length === 1 ? "result" : "results"}
                </h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchResults([]);
                    setInput("");
                  }}
                  className="text-white/60 hover:bg-white/10 hover:text-white"
                >
                  Clear
                </Button>
              </div>
              {searchResults.map((result) => (
                <motion.div
                  key={result.messageId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                >
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-medium text-white/70">{result.conversationTitle}</span>
                    <span className="text-white/40">{formatTimestamp(result.timestamp)}</span>
                  </div>
                  <p className="break-words text-sm leading-relaxed text-white/80">
                    {result.prefixEllipsis && <span className="text-white/40">...</span>}
                    {result.before}
                    <mark className="bg-yellow-400/30 font-semibold text-yellow-100">{result.match}</mark>
                    {result.after}
                    {result.suffixEllipsis && <span className="text-white/40">...</span>}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveConversationId(result.conversationId);
                      setChatMode("conversation");
                      setSearchResults([]);
                      setInput("");
                      if (window.innerWidth < 1024) {
                        setSidebarOpen(false);
                      }
                    }}
                    className="mt-3 text-xs text-white/60 hover:text-white"
                  >
                    View conversation →
                  </button>
                </motion.div>
              ))}
            </div>
          )}
          {chatMode === "search" && searchResults.length === 0 && input.length === 0 && (
            <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center py-12 text-center">
              <Search className="h-12 w-12 text-white/20" />
              <h3 className="mt-4 text-lg font-semibold text-white/70">Search your conversations</h3>
              <p className="mt-2 text-sm text-white/50">
                Enter a search query to find messages across all your conversations
              </p>
            </div>
          )}
          {chatMode === "search" && searchResults.length === 0 && input.length > 0 && (
            <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center py-12 text-center">
              <Search className="h-12 w-12 text-white/20" />
              <h3 className="mt-4 text-lg font-semibold text-white/70">No results found</h3>
              <p className="mt-2 text-sm text-white/50">
                Try different keywords or check your spelling
              </p>
            </div>
          )}
          {chatMode !== "search" && (
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className={`mx-auto flex w-full max-w-5xl gap-3 sm:gap-4 ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border sm:h-9 sm:w-9 ${
                      message.role === "user" ? "border-white/40 bg-white/20" : "border-white/10 bg-white/10"
                    }`}
                  >
                    {message.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                  </div>
                  <div
                    className={`flex-1 rounded-2xl border px-3.5 py-3 text-sm leading-relaxed backdrop-blur sm:px-4 sm:text-base ${
                      message.role === "user"
                        ? "border-white/20 bg-white/10 text-white"
                        : "border-white/10 bg-black/40 text-white/90"
                    }`}
                  >
                    {message.mode === "deepthink" && message.role === "assistant" && (
                      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-purple-300/30 bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-200">
                        <Brain className="h-3 w-3" />
                        Deepthink Mode
                      </div>
                    )}
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    <span className="mt-3 block text-right text-[10px] uppercase tracking-[0.2em] text-white/35 sm:tracking-[0.3em]">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          {isStreaming && chatMode !== "search" && (
            <motion.div
              className="mx-auto flex w-full max-w-5xl items-center gap-3 text-sm text-white/60"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/10 sm:h-9 sm:w-9">
                <Bot className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {chatMode === "deepthink" ? "Analyzing deeply..." : "Oculus AI is crafting a response..."}
              </div>
            </motion.div>
          )}
        </div>

        <div className="border-t border-white/10 bg-black/80 backdrop-blur-xl">
          <div className="mx-auto w-full max-w-5xl px-4 py-4 safe-bottom">
            <form
              onSubmit={handleSubmit}
              className="grid gap-4 md:grid-cols-[minmax(0,320px),1fr,auto] md:items-end"
            >
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/45">Mode</span>
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <button
                    type="button"
                    aria-pressed={chatMode === "conversation"}
                    onClick={() => {
                      setChatMode("conversation");
                      setSearchResults([]);
                    }}
                    className={`flex w-full items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                      chatMode === "conversation"
                        ? "border-white bg-white text-black shadow-sm"
                        : "border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:text-white"
                    } sm:flex-1`}
                  >
                    <MessagesSquare className="h-4 w-4" />
                    <span>Conversation</span>
                  </button>
                  <button
                    type="button"
                    aria-pressed={chatMode === "search"}
                    onClick={() => {
                      setChatMode("search");
                    }}
                    className={`flex w-full items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                      chatMode === "search"
                        ? "border-white bg-white text-black shadow-sm"
                        : "border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:text-white"
                    } sm:flex-1`}
                  >
                    <Search className="h-4 w-4" />
                    <span>Search</span>
                  </button>
                  <button
                    type="button"
                    aria-pressed={chatMode === "deepthink"}
                    onClick={() => {
                      setChatMode("deepthink");
                      setSearchResults([]);
                    }}
                    className={`flex w-full items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                      chatMode === "deepthink"
                        ? "border-white bg-white text-black shadow-sm"
                        : "border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:text-white"
                    } sm:flex-1`}
                  >
                    <Brain className="h-4 w-4" />
                    <span>Deepthink</span>
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-white/45 sm:text-sm sm:text-white/50">
                  {chatMode === "conversation" && <Sparkles className="h-4 w-4 shrink-0" />}
                  {chatMode === "search" && <Search className="h-4 w-4 shrink-0" />}
                  {chatMode === "deepthink" && <Brain className="h-4 w-4 shrink-0" />}
                  <span className="font-medium text-white/80">
                    {chatMode === "conversation" && (activeModel?.name ?? "Oculus AI")}
                    {chatMode === "search" && "Search Mode"}
                    {chatMode === "deepthink" && `${activeModel?.name ?? "Oculus AI"} • Deepthink`}
                  </span>
                </div>
                <Input
                  placeholder={
                    chatMode === "conversation"
                      ? "Ask about vision pipelines, integration tactics, or benchmarking insights..."
                      : chatMode === "search"
                        ? "Search across all conversations..."
                        : "Ask a complex question for deep analysis..."
                  }
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  className="min-h-[3rem] border-white/10 bg-white/5 text-white focus-visible:ring-white/40"
                  disabled={chatMode !== "search" && isStreaming}
                />
              </div>
              <Button
                type="submit"
                aria-label={chatMode === "search" ? "Run search" : "Send message"}
                className="group flex h-12 w-full items-center justify-center rounded-full bg-white text-black hover:bg-gray-200 md:h-[3.25rem] md:w-[3.25rem]"
                disabled={(chatMode !== "search" && isStreaming) || !input.trim()}
              >
                {isStreaming ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : chatMode === "search" ? (
                  <Search className="h-5 w-5" />
                ) : (
                  <Send className="h-5 w-5 group-hover:-translate-y-1" />
                )}
              </Button>
            </form>
            <p className="mt-3 text-xs text-white/40">
              {chatMode === "conversation" &&
                "Conversations refresh with each session. Connect your own backend to persist history and enable streaming responses."}
              {chatMode === "search" && "Search is performed locally across all loaded conversations."}
              {chatMode === "deepthink" &&
                "Deepthink mode provides extended reasoning with structured analysis and key takeaways."}
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {settingsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black lg:hidden"
              onClick={() => setSettingsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 24, stiffness: 220 }}
              className="fixed inset-y-0 right-0 z-50 w-full bg-black/95 backdrop-blur-xl lg:w-full lg:max-w-md lg:border-l lg:border-white/10"
            >
              <Card className="flex h-full flex-col border-0 bg-transparent shadow-none">
                <CardHeader className="sticky top-0 z-10 border-b border-white/10 bg-black/95 backdrop-blur-xl safe-top">
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
                <CardContent className="flex-1 space-y-6 overflow-y-auto px-4 pb-8 pt-6 safe-bottom">
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
                          <p className="text-[10px] uppercase tracking-wide sm:text-xs">Context</p>
                          <p className="mt-1 text-sm font-semibold text-white">{activeModel.contextWindowLabel}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wide sm:text-xs">Availability</p>
                          <p className="mt-1 text-sm font-semibold text-white">{activeModel.availabilityLabel}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wide sm:text-xs">Pricing</p>
                          <p className="mt-1 text-sm font-semibold text-white">
                            ${activeModel.pricing.input.toFixed(2)} / ${activeModel.pricing.output.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wide sm:text-xs">Accuracy</p>
                          <p className="mt-1 text-sm font-semibold text-white">{activeModel.performance.accuracy}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Context hints</p>
                    <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/80">
                      {contextHints.map((hint) => (
                        <li key={hint} className="flex items-start gap-2">
                          <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-white/50" />
                          <span>{hint}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-white/50">
                    Responses are simulated for this demo. Integrate the streaming API to connect your backend, persist threads, and enable multi-participant conversations.
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
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
      className="fixed inset-0 z-40 bg-black/70 lg:hidden"
      onClick={onDismiss}
    />
  );
}

function generateAssistantReply(prompt: string, model: OculusModel, mode: ChatMode): string {
  const intro = `Routing through ${model.name} (${model.contextWindowLabel}) with ${model.performance.accuracy} accuracy.`;
  const seriesInsight = SERIES_RESPONSES[model.series] ?? SERIES_RESPONSES.foundation;

  if (mode === "deepthink") {
    const keyTakeaways = [
      "Key findings",
      "Operational considerations",
      "Recommended next actions",
      "Validation checkpoints",
    ];

    const takeawaysList = keyTakeaways
      .map((item) => {
        const insight = prompt.length > 160
          ? `• ${item}: Layer plans to address the multi-step objective while safeguarding edge conditions.`
          : `• ${item}: Focus on high-signal steps to keep delivery lean without sacrificing robustness.`;
        return insight;
      })
      .join("\n");

    return [
      intro,
      seriesInsight,
      "Deepthink synopsis:",
      takeawaysList,
      "Next step: Convert this outline into an execution-ready plan or request scenario stress tests.",
    ].join("\n\n");
  }

  const promptInsight =
    prompt.length > 120
      ? "It looks like you're considering a complex workflow. Breaking it into modular inference steps helps maintain clarity and traceability."
      : "Your objective can be handled in a single pass. Consider batching similar requests to maximize token efficiency.";

  return `${intro}\n\n${seriesInsight}\n\n${promptInsight}`;
}
