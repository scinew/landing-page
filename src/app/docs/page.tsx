"use client";

import { Fragment, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Clock,
  Code,
  DollarSign,
  Gauge,
  GitCompare,
  Globe,
  Layers,
  Shield,
  Sparkles,
  Zap,
  Search,
  ListChecks,
  TrendingUp,
  Server,
  Workflow,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { SITE_MODELS, SECRET_MODEL } from "@/lib/models";

const SORTED_MODELS = [...SITE_MODELS].sort((a, b) => a.recommendedOrder - b.recommendedOrder);

const PRICING_PACKAGES = [
  {
    name: "Developer",
    price: "$99",
    period: "/month",
    tokens: "50M tokens included",
    description: "Prototype quickly with entry-level and lightweight models.",
    includes: ["Access to Oculus Mini & Oculus 1.0", "Shared GPU inference", "Community + email support"],
  },
  {
    name: "Growth",
    price: "$399",
    period: "/month",
    tokens: "250M tokens included",
    description: "Scale to production with enhanced reasoning and specialist models.",
    includes: ["Oculus 1.5, 2.0 & 2.5", "Low-latency streaming endpoints", "Priority support"],
  },
  {
    name: "Professional",
    price: "$899",
    period: "/month",
    tokens: "600M tokens included",
    description: "Enterprise-ready package with multimodal and Pro tiers.",
    includes: ["Oculus 3.x & Pro tiers", "Dedicated success manager", "Fine-tuning credits"],
  },
  {
    name: "Enterprise & Ultra",
    price: "Custom",
    period: "",
    tokens: "Volume-based",
    description: "Mission-critical deployments with Oculus 4.x, 5.x, and Openflowith Ultra tiers.",
    includes: ["Private cloud or on-prem options", "99.95%+ SLA", "White-glove onboarding"],
  },
];

const VOLUME_DISCOUNTS = [
  { tier: "10M+ tokens", discount: "5%", notes: "Automatic once sustained usage crosses 10M tokens/month" },
  { tier: "100M+ tokens", discount: "12%", notes: "Requires business verification and sustained volume" },
  { tier: "500M+ tokens", discount: "18%", notes: "Includes proactive scaling assistance" },
  { tier: "1B+ tokens", discount: "25%", notes: "Enterprise agreement with dedicated capacity" },
];

const DOC_NAV = [
  { id: "getting-started", label: "Getting Started", keywords: ["setup", "installation", "sdk"] },
  { id: "authentication", label: "Authentication", keywords: ["keys", "security"] },
  { id: "models", label: "Models", keywords: ["catalog", "overview"] },
  { id: "pricing", label: "Pricing", keywords: ["cost", "billing", "calculator"] },
  { id: "benchmarks", label: "Benchmarks", keywords: ["performance", "latency", "mmlu"] },
  { id: "comparison", label: "Model Comparison", keywords: ["matrix", "choose", "selector"] },
  { id: "migration", label: "Migration Guides", keywords: ["upgrade", "switch", "competitor"] },
  { id: "rate-limits", label: "Rate Limits", keywords: ["rpm", "tpm", "throttle"] },
  { id: "api-reference", label: "API Reference", keywords: ["endpoints", "rest"] },
  { id: "examples", label: "Examples", keywords: ["code", "usage"] },
  { id: "capabilities", label: "Capabilities", keywords: ["features", "skills"] },
  { id: "best-practices", label: "Best Practices", keywords: ["tips", "guidelines"] },
];

const OCULUS_MIGRATIONS = [
  {
    from: "oculus-1-0125",
    to: "oculus-2.0-0615",
    summary: "Upgrade to enhanced reasoning without changing payload formats.",
    highlights: ["Context window expands from 8K → 64K", "Latency impact +60ms on average", "Recommended for analytics workloads"],
    steps: [
      "Increase `context_window` setting to 64K tokens for deeper analysis.",
      "Tune retry policies for 145ms average latency and 5x burst capacity.",
      "Capture new reasoning traces emitted in responses under `reasoning_log`.",
    ],
  },
  {
    from: "oculus-2.0-0615",
    to: "oculus-2.5-0728",
    summary: "Enable multimodal analysis across vision, text, and audio streams.",
    highlights: ["Add multimodal payloads under `inputs`", "Automatic video frame sampling", "Streaming output supported"],
    steps: [
      "Request multimodal access in the console and provision audio quotas.",
      "Send combined payloads with typed content (image, text, audio).",
      "Validate token budgets up to 128K contexts for conversational threads.",
    ],
  },
  {
    from: "oculus-3.0-0901",
    to: "oculus-3.5-1015",
    summary: "Adopt enterprise controls with compliance guardrails.",
    highlights: ["Sovereign deployment options", "SOC2 & HIPAA controls", "Audit streaming"],
    steps: [
      "Provision tenant isolation headers for regulated workloads.",
      "Enable audit streaming to your SIEM endpoint via `audit_webhook_url`.",
      "Roll out gradually with dual-write validation for deterministic parity.",
    ],
  },
  {
    from: "oculus-pro-2.0",
    to: "oculus-4.0-1120",
    summary: "Unlock premium performance and 1M+ token contexts.",
    highlights: ["Context 512K → 1M tokens", "Accuracy uplift to 99.95%", "Supports predictive interventions"],
    steps: [
      "Engage Oculus Solutions for quota planning and provisioning dedicated capacity.",
      "Recalibrate accuracy thresholds with new benchmark baselines.",
      "Adopt predictive webhooks to trigger remediation on policy deviations.",
    ],
  },
];

const COMPETITOR_MIGRATIONS = [
  {
    from: "OpenAI GPT-4o Vision",
    to: "oculus-2.5-0728",
    summary: "Switch to Oculus multimodal without losing JSON schema compatibility.",
    steps: [
      "Map `image_base64` payloads to Oculus `inputs` array with `type: 'image'`.",
      "Replace `max_tokens` with `max_output_tokens` — same semantics, larger ceiling.",
      "Translate OpenAI function calls to Oculus `tool_invocations` for structured output.",
    ],
  },
  {
    from: "Anthropic Claude-3 Opus Vision",
    to: "oculus-3.0-0901",
    summary: "Gain faster throughput and extended audit tooling.",
    steps: [
      "Swap streaming endpoint to `https://api.oculus.ai/v1/chat/stream`.",
      "Migrate safety settings to Oculus `governance.profile` presets.",
      "Enable latency-aware retries using Oculus rate-limit headers (see below).",
    ],
  },
  {
    from: "Google Gemini 1.5 Pro",
    to: "oculus-4.0-1120",
    summary: "Move enterprise workloads to guaranteed 99.95%+ SLAs.",
    steps: [
      "Port Vertex AI configs to Oculus Deployment Templates.",
      "Adopt Oculus-managed encryption with customer keys.",
      "Leverage 1M token contexts for long-form document reasoning.",
    ],
  },
];

const RATE_LIMIT_BEST_PRACTICES = [
  "Use exponential backoff starting at 250ms and capping at 4s for 429 responses.",
  "Batch similar requests to minimize context-window sprawl and reduce token pressure.",
  "Leverage asynchronous job submissions for archival analysis workloads.",
  "Track per-model consumption with the `X-Oculus-Token-Usage` header to stay ahead of thresholds.",
];

const RATE_LIMIT_HEADERS = [
  { header: "X-Oculus-RateLimit-Limit", description: "Current request limit window (RPM / TPM)." },
  { header: "X-Oculus-RateLimit-Remaining", description: "Remaining requests in the current window." },
  { header: "X-Oculus-RateLimit-Reset", description: "UTC timestamp for when the window resets." },
  { header: "X-Oculus-Token-Usage", description: "Input and output token usage for the request." },
];

const ERROR_CODES = [
  { code: 429, meaning: "Rate limit exceeded", recovery: "Respect Retry-After header and stagger requests." },
  { code: 529, meaning: "Capacity throttled", recovery: "Automatic failover within 5 seconds or contact support." },
  { code: 403, meaning: "Quota restriction", recovery: "Request upgrade in console or via support channel." },
];

const USE_CASE_GUIDE = [
  {
    title: "Rapid Prototyping",
    description: "Choose Oculus 1.0 or Mini tiers for low-latency experimentation and tight budget control.",
    models: ["oculus-1-0125", "oculus-mini-1.0", "oculus-mini-quant"]
  },
  {
    title: "Enterprise Analytics",
    description: "Adopt Oculus 3.5 or 4.0 for compliance-ready deployments with audit trails and large contexts.",
    models: ["oculus-3.5-1015", "oculus-4.0-1120", "oculus-4.5-1205"]
  },
  {
    title: "Real-Time Agents",
    description: "Mix Oculus Pro and Mini series for interactive experiences with fallback orchestration.",
    models: ["oculus-pro-1.0", "oculus-mini-rt", "oculus-pro-2.0"]
  },
  {
    title: "Research & Frontier",
    description: "Leverage Oculus 5.0 and Openflowith to explore massive contexts, temporal reasoning, and quantum-safe protocols.",
    models: ["oculus-5.0-0110", SECRET_MODEL.id]
  },
];

const calculateEstimatedCost = (modelId: string, inputTokens: number, outputTokens: number) => {
  const model = SORTED_MODELS.find((item) => item.id === modelId);
  if (!model) return 0;
  const inputCost = (inputTokens / 1000) * model.pricing.input;
  const outputCost = (outputTokens / 1000) * model.pricing.output;
  return inputCost + outputCost;
};

const getComparisonInfo = (modelId: string) => {
  const model = SORTED_MODELS.find((item) => item.id === modelId);
  if (!model) return null;
  return {
    id: model.id,
    name: model.name,
    badge: model.badge,
    tier: model.tier,
    accuracy: model.performance.accuracy,
    latency: model.performance.latency,
    context: model.contextWindowLabel,
    price: `$${model.pricing.input.toFixed(2)} / $${model.pricing.output.toFixed(2)}`,
    availability: model.availabilityLabel,
    useCases: model.useCases.slice(0, 3),
  };
};

export default function Documentation() {
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [calculatorModel, setCalculatorModel] = useState<string>(SORTED_MODELS[1]?.id ?? SORTED_MODELS[0]?.id ?? "");
  const [inputTokens, setInputTokens] = useState(5000);
  const [outputTokens, setOutputTokens] = useState(2000);
  const [primaryModel, setPrimaryModel] = useState<string>(SORTED_MODELS[0]?.id ?? "");
  const [secondaryModel, setSecondaryModel] = useState<string>(SORTED_MODELS[1]?.id ?? "");

  const filteredNav = useMemo(() => {
    if (!searchTerm.trim()) return DOC_NAV;
    return DOC_NAV.filter((item) =>
      [item.label, ...item.keywords]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase()),
    );
  }, [searchTerm]);

  const calculatorTotal = useMemo(
    () => calculateEstimatedCost(calculatorModel, inputTokens, outputTokens),
    [calculatorModel, inputTokens, outputTokens],
  );

  const primaryInfo = useMemo(() => getComparisonInfo(primaryModel), [primaryModel]);
  const secondaryInfo = useMemo(() => getComparisonInfo(secondaryModel), [secondaryModel]);

  const maxPerformanceScore = useMemo(() => Math.max(...SORTED_MODELS.map((model) => model.performanceScore)), []);

  const renderNavigationLinks = (onNavigate?: () => void) => {
    if (filteredNav.length === 0) {
      return <p className="text-sm text-white/50">No sections match “{searchTerm}”</p>;
    }

    return filteredNav.map((item) => (
      <a
        key={item.id}
        href={`#${item.id}`}
        className="block rounded-md px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
        onClick={() => onNavigate?.()}
      >
        {item.label}
      </a>
    ));
  };

  return (
    <Fragment>
      <SiteHeader />
      <div className="site-shell relative min-h-screen bg-black text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <Button asChild variant="outline" className="mb-8">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-8">
            <Badge className="mb-6 bg-white text-black hover:bg-gray-200">
              <BookOpen className="mr-2 h-3 w-3" />
              Documentation
            </Badge>
            <h1 className="text-4xl font-bold text-balance sm:text-5xl lg:text-6xl">Oculus AI Documentation</h1>
            <p className="mt-4 max-w-3xl text-balance text-base text-gray-400 sm:text-lg md:text-xl">
              Complete guide to integrating Oculus AI vision models, pricing structures, migration paths, and performance benchmarks across our 27-model portfolio.
            </p>
          </motion.div>

          <Button
            variant="outline"
            className="mb-6 flex w-full items-center justify-center gap-2 lg:hidden"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            {mobileNavOpen ? "Hide navigation" : "Table of Contents"}
          </Button>

          <AnimatePresence>
            {mobileNavOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm lg:hidden"
              >
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
                    <input
                      type="text"
                      placeholder="Search sections..."
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/60 py-2 pl-10 pr-3 text-sm text-white placeholder:text-white/40 focus:border-white/25 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-400">Navigation</h3>
                    {renderNavigationLinks(() => setMobileNavOpen(false))}
                  </div>
                  <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-sm text-white">Need a guided tour?</CardTitle>
                      <CardDescription className="text-white/60">
                        Book a live onboarding session with an Oculus solutions architect.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="inverted" className="w-full">Schedule session</Button>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-4">
            <div className="hidden lg:col-span-1 lg:block">
              <div className="sticky top-8 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search sections..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/60 py-2 pl-10 pr-3 text-sm text-white placeholder:text-white/40 focus:border-white/25 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-400">Navigation</h3>
                  {renderNavigationLinks()}
                </div>

                <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-sm text-white">Need a guided tour?</CardTitle>
                    <CardDescription className="text-white/60">
                      Book a live onboarding session with an Oculus solutions architect.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="inverted" className="w-full">Schedule session</Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-16 lg:col-span-3">
              <Section id="getting-started" title="Getting Started">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Installation</CardTitle>
                      <CardDescription className="text-white/60">
                        Install the Oculus AI SDK using npm or pip
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-gray-200">
                      <div className="rounded-lg border border-white/10 bg-black/60 p-4">
                        <code>
                          <div># JavaScript/TypeScript</div>
                          <div>npm install @oculus-ai/sdk</div>
                          <div className="mt-4"># Python</div>
                          <div>pip install oculus-ai</div>
                        </code>
                      </div>
                      <p>
                        Configure your API key via <code className="rounded bg-white/10 px-1">OCULUS_API_KEY</code> and initialize the client inside your application bootstrap.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Quick Start</CardTitle>
                      <CardDescription className="text-white/60">
                        Analyze imagery in less than ten lines of code
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-lg border border-white/10 bg-black/60 p-4 text-sm text-gray-200">
                        <code>
                          <div>import {"{ OculusAI }"} from "@oculus-ai/sdk";</div>
                          <div className="mt-2">const client = new OculusAI({"{"}</div>
                          <div>  apiKey: process.env.OCULUS_API_KEY,</div>
                          <div>{`});`}</div>
                          <div className="mt-2">const result = await client.analyze({"{"}</div>
                          <div>  model: "oculus-1-0125",</div>
                          <div>  image: imageUrl,</div>
                          <div>  tasks: ["classification", "detection"],</div>
                          <div>{`});`}</div>
                        </code>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </Section>

              <Section id="authentication" title="Authentication">
                <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">API Keys</CardTitle>
                    <CardDescription className="text-white/60">
                      Secure your API access with bearer tokens and scoped roles
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-gray-200">
                    <p>All API requests require an API key embedded in the <code className="rounded bg-white/10 px-1">Authorization</code> header.</p>
                    <div className="rounded-lg border border-white/10 bg-black/60 p-4 text-sm">
                      <code>Authorization: Bearer YOUR_API_KEY</code>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="mt-1 h-5 w-5 text-white" />
                      <div>
                        <p className="font-semibold text-white">Rotate keys every 90 days</p>
                        <p className="text-white/60">Use the console or the `/v1/keys` endpoint to rotate credentials without downtime.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Section>

              <Section id="models" title="Model Catalog">
                <p className="mb-6 text-gray-300">
                  Oculus AI ships <strong>{SORTED_MODELS.length}</strong> vision-focused models spanning foundation, pro, mini, specialized, and ultra families. Each model includes explicit pricing, performance, and rate-limit metadata for transparent planning.
                </p>
                <div className="grid gap-6 md:grid-cols-2">
                  {SORTED_MODELS.slice(0, 6).map((model) => (
                    <Card key={model.id} className="border-white/10 bg-white/5 backdrop-blur-sm">
                      <CardHeader>
                        <Badge className="mb-4 w-fit bg-white text-black">{model.badge}</Badge>
                        <CardTitle className="text-white text-2xl">{model.name}</CardTitle>
                        <CardDescription className="text-white/60">{model.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm text-gray-200">
                        <div className="flex items-center gap-2">
                          <Gauge className="h-4 w-4 text-white/60" />
                          <span>Accuracy: {model.performance.accuracy}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-white/60" />
                          <span>Latency: {model.performance.latency}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-white/60" />
                          <span>Context: {model.contextWindowLabel}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <p className="mt-6 text-sm text-white/50">
                  Explore the full catalog and download spec sheets via the <Link href="/models" className="text-white underline">models directory</Link>.
                </p>
              </Section>

              <Section id="pricing" title="Pricing">
                <p className="text-gray-300">
                  Detailed pricing for every Oculus AI model, including per-token costs, bundled packages, volume discounts, and enterprise options. Pricing is transparent across all {SORTED_MODELS.length} models, including Openflowith's secret tier.
                </p>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  {PRICING_PACKAGES.map((tier) => (
                    <Card key={tier.name} className="border-white/10 bg-white/5 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-white text-xl">{tier.name}</CardTitle>
                        <CardDescription className="text-white/60">{tier.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 text-sm text-gray-200">
                        <div className="flex items-baseline gap-2 text-white">
                          <span className="text-4xl font-semibold">{tier.price}</span>
                          <span>{tier.period}</span>
                        </div>
                        <p className="text-white/50">{tier.tokens}</p>
                        <ul className="space-y-2 text-white/80">
                          {tier.includes.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                              <Sparkles className="mt-0.5 h-4 w-4 text-white/50" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-10 space-y-4">
                  <h3 className="text-balance text-xl font-semibold sm:text-2xl">Per-model pricing (per 1K tokens)</h3>
                  <div className="overflow-x-auto rounded-lg border border-white/10">
                    <table className="min-w-full divide-y divide-white/10 text-left text-sm text-white/80">
                      <thead>
                        <tr className="bg-white/5 text-white">
                          <th className="px-4 py-3 font-medium">Model</th>
                          <th className="px-4 py-3 font-medium">Tier</th>
                          <th className="px-4 py-3 font-medium">Input</th>
                          <th className="px-4 py-3 font-medium">Output</th>
                          <th className="px-4 py-3 font-medium">Context</th>
                          <th className="px-4 py-3 font-medium">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {SORTED_MODELS.map((model) => (
                          <tr key={model.id} className="hover:bg-white/5">
                            <td className="px-4 py-3 text-white">{model.name}</td>
                            <td className="px-4 py-3 capitalize">{model.tier}</td>
                            <td className="px-4 py-3">${model.pricing.input.toFixed(2)}</td>
                            <td className="px-4 py-3">${model.pricing.output.toFixed(2)}</td>
                            <td className="px-4 py-3">{model.contextWindowLabel}</td>
                            <td className="px-4 py-3 text-white/60">{model.pricing.note ?? model.availabilityLabel}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-12 grid gap-6 md:grid-cols-2">
                  <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white text-xl">Volume Discounts</CardTitle>
                    <CardDescription className="text-white/60">
                      Automatic & negotiated discounts for sustained usage
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-gray-200">
                    {VOLUME_DISCOUNTS.map((entry) => (
                      <div key={entry.tier} className="flex items-start justify-between gap-4 rounded-lg border border-white/10 bg-black/40 p-3">
                        <div>
                          <p className="text-white font-medium">{entry.tier}</p>
                          <p className="text-white/50">{entry.notes}</p>
                        </div>
                        <Badge className="bg-white/10 text-white">{entry.discount}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">Enterprise Options</CardTitle>
                    <CardDescription className="text-white/60">
                      Tailored plans for regulated and high-volume workloads
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-gray-200">
                    <div className="flex items-start gap-3">
                      <Shield className="mt-0.5 h-5 w-5 text-white/70" />
                      <div>
                        <p className="font-semibold text-white">Dedicated Capacity Pools</p>
                        <p className="text-white/60">Reserve GPU clusters in specific regions with 99.99% capacity SLAs.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Server className="mt-0.5 h-5 w-5 text-white/70" />
                      <div>
                        <p className="font-semibold text-white">Private Deployments</p>
                        <p className="text-white/60">Deploy Oculus models on-premise or in your VPC with zero data egress.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Workflow className="mt-0.5 h-5 w-5 text-white/70" />
                      <div>
                        <p className="font-semibold text-white">Success Engineering</p>
                        <p className="text-white/60">Partner with dedicated experts for migration, evaluation, and compliance reviews.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-12 grid gap-6 lg:grid-cols-[1.5fr,1fr]">
                <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">Cost Calculator</CardTitle>
                    <CardDescription className="text-white/60">
                      Estimate per-request spend using real-world token counts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-gray-200">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-xs uppercase tracking-wide text-white/60">Model</label>
                        <div className="relative mt-1">
                          <select
                            value={calculatorModel}
                            onChange={(event) => setCalculatorModel(event.target.value)}
                            className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/40"
                          >
                            {SORTED_MODELS.map((model) => (
                              <option key={model.id} value={model.id} className="bg-black text-white">
                                {model.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-wide text-white/60">Input tokens</label>
                        <input
                          type="number"
                          min={0}
                          value={inputTokens}
                          onChange={(event) => setInputTokens(Number(event.target.value) || 0)}
                          className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/40"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-wide text-white/60">Output tokens</label>
                        <input
                          type="number"
                          min={0}
                          value={outputTokens}
                          onChange={(event) => setOutputTokens(Number(event.target.value) || 0)}
                          className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/40"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-wide text-white/60">Estimated cost</label>
                        <div className="mt-1 rounded-md border border-white/10 bg-black/60 px-3 py-2 text-lg font-semibold text-white">
                          ${calculatorTotal.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-white/50">
                      Costs are based on per-1K token pricing. Final billing rounds up to the nearest thousand tokens per request.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">Billing Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-gray-200">
                    <Link href="/checkout" className="flex items-center gap-2 text-white/70 hover:text-white">
                      <DollarSign className="h-4 w-4" />
                      Manage subscriptions & invoices
                    </Link>
                    <Link href="/docs#rate-limits" className="flex items-center gap-2 text-white/70 hover:text-white">
                      <BarChart3 className="h-4 w-4" />
                      Monitor usage and rate limits
                    </Link>
                    <Link href="mailto:sales@oculus.ai" className="flex items-center gap-2 text-white/70 hover:text-white">
                      <Sparkles className="h-4 w-4" />
                      Request enterprise pricing review
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </Section>

            <Section id="benchmarks" title="Benchmarks">
              <p className="text-gray-300">
                Performance benchmarks across accuracy, latency, throughput, context, and specialized tasks. Results are derived from internal evaluation suites plus public benchmarks (MMLU, GSM8K, DocVQA, and synthetic stress tests). Openflowith maintains its legendary 200% accuracy rating on advanced reasoning audits.
              </p>

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                {SORTED_MODELS.slice(0, 6).map((model) => (
                  <Card key={model.id} className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white text-xl">{model.name}</CardTitle>
                          <CardDescription className="text-white/60">{model.badge}</CardDescription>
                        </div>
                        <Badge className="bg-white/10 text-white">{model.performance.accuracy}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-gray-200">
                      <BenchmarkBar label="Performance score" value={model.performanceScore} max={maxPerformanceScore} />
                      <div className="grid grid-cols-3 gap-2 text-xs text-white/70">
                        <div className="rounded-md border border-white/10 bg-black/40 p-3">
                          <Gauge className="mb-1 h-4 w-4 text-white/60" />
                          <p className="font-semibold text-white">{model.performance.accuracy}</p>
                          <p className="text-white/50">Accuracy</p>
                        </div>
                        <div className="rounded-md border border-white/10 bg-black/40 p-3">
                          <Clock className="mb-1 h-4 w-4 text-white/60" />
                          <p className="font-semibold text-white">{model.performance.latency}</p>
                          <p className="text-white/50">Latency</p>
                        </div>
                        <div className="rounded-md border border-white/10 bg-black/40 p-3">
                          <TrendingUp className="mb-1 h-4 w-4 text-white/60" />
                          <p className="font-semibold text-white">{model.performance.throughput}</p>
                          <p className="text-white/50">Throughput</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-12 grid gap-6 md:grid-cols-2">
                <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">Industry Benchmarks</CardTitle>
                    <CardDescription className="text-white/60">
                      Average benchmark results across suites
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-gray-200">
                    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 p-3">
                      <span>MMLU</span>
                      <span className="font-semibold text-white">92.4%</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 p-3">
                      <span>GSM8K</span>
                      <span className="font-semibold text-white">89.1%</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 p-3">
                      <span>DocVQA</span>
                      <span className="font-semibold text-white">98.9%</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 p-3">
                      <span>Openflowith Ultra</span>
                      <span className="font-semibold text-white">200% accuracy</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">Latency tiers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-gray-200">
                    {[
                      { label: "Realtime (<100ms)", models: "Mini RT, Oculus 1.0" },
                      { label: "Interactive (100-200ms)", models: "Oculus 1.5, 2.0, Pro 1.0" },
                      { label: "Analytical (200-350ms)", models: "Oculus 3.x, 4.0" },
                      { label: "Autonomous (>350ms)", models: "Oculus 4.5, 5.0, Openflowith" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-2 rounded-lg border border-white/10 bg-black/40 p-3">
                        <Clock className="mt-0.5 h-4 w-4 text-white/60" />
                        <div>
                          <p className="font-semibold text-white">{item.label}</p>
                          <p className="text-white/60">{item.models}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </Section>

            <Section id="comparison" title="Model Comparison">
              <p className="text-gray-300">
                Compare models side by side, explore feature matrices, and pick the right model using the guidance below.
              </p>

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">Comparison Tool</CardTitle>
                    <CardDescription className="text-white/60">Select two models to compare attributes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-gray-200">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-xs uppercase tracking-wide text-white/60">Primary</label>
                        <select
                          value={primaryModel}
                          onChange={(event) => setPrimaryModel(event.target.value)}
                          className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/40"
                        >
                          {SORTED_MODELS.map((model) => (
                            <option key={model.id} value={model.id} className="bg-black text-white">
                              {model.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-wide text-white/60">Secondary</label>
                        <select
                          value={secondaryModel}
                          onChange={(event) => setSecondaryModel(event.target.value)}
                          className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/40"
                        >
                          {SORTED_MODELS.map((model) => (
                            <option key={model.id} value={model.id} className="bg-black text-white">
                              {model.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <ComparisonGrid primary={primaryInfo} secondary={secondaryInfo} />
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">Feature Matrix</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-gray-200">
                    {["Multimodal", "Compliance Ready", "Low Latency", "High Context", "Specialized", "Autonomous"].map((feature) => (
                      <div key={feature} className="flex items-start gap-3 rounded-lg border border-white/10 bg-black/40 p-3">
                        <GitCompare className="mt-0.5 h-4 w-4 text-white/60" />
                        <div>
                          <p className="font-semibold text-white">{feature}</p>
                          <p className="text-white/60">
                            {feature === "Multimodal" && "Oculus 1.5, 2.5, 3.x"}
                            {feature === "Compliance Ready" && "Oculus 3.5, 4.0, 4.5"}
                            {feature === "Low Latency" && "Mini RT, Oculus 1.0"}
                            {feature === "High Context" && "Oculus 3.5+, 4.x, 5.x"}
                            {feature === "Specialized" && "OCR+, Geospatial, Security, Medical"}
                            {feature === "Autonomous" && "Oculus 4.5, 5.0, Openflowith"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="mt-12 grid gap-6 md:grid-cols-2">
                {USE_CASE_GUIDE.map((guide) => (
                  <Card key={guide.title} className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white text-xl">{guide.title}</CardTitle>
                      <CardDescription className="text-white/60">{guide.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-200">
                      <p className="text-white/60">Recommended models:</p>
                      <ul className="mt-2 space-y-1 text-white/80">
                        {guide.models.map((modelId) => (
                          <li key={modelId}>• {SORTED_MODELS.find((model) => model.id === modelId)?.name ?? modelId}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Section>

            <Section id="migration" title="Migration Guides">
              <p className="text-gray-300">
                Comprehensive migration playbooks with breaking changes, compatibility notes, and code snippets for both intra-Oculus upgrades and competitor transitions.
              </p>

              <div className="mt-8 space-y-6">
                {OCULUS_MIGRATIONS.map((guide) => (
                  <Card key={guide.from + guide.to} className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white text-xl">{guide.from} → {guide.to}</CardTitle>
                      <CardDescription className="text-white/60">{guide.summary}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-gray-200">
                      <div className="flex flex-wrap items-center gap-3 text-white/60">
                        {guide.highlights.map((item) => (
                          <Badge key={item} className="bg-white/10 text-white">{item}</Badge>
                        ))}
                      </div>
                      <ol className="space-y-2 text-white/80">
                        {guide.steps.map((step, index) => (
                          <li key={step} className="flex items-start gap-2">
                            <span className="mt-0.5 text-white/50">{index + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <h3 className="mt-12 text-2xl font-semibold">Migrating from other providers</h3>
              <div className="mt-4 grid gap-6 md:grid-cols-3">
                {COMPETITOR_MIGRATIONS.map((guide) => (
                  <Card key={guide.from} className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">{guide.from}</CardTitle>
                      <CardDescription className="text-white/60">{guide.summary}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-gray-200">
                      {guide.steps.map((step) => (
                        <div key={step} className="flex items-start gap-2">
                          <ListChecks className="mt-0.5 h-4 w-4 text-white/60" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Section>

            <Section id="rate-limits" title="Rate Limits">
              <p className="text-gray-300">
                Understand per-model limits, concurrency guidelines, and strategies for graceful scaling. All responses include headers with limit and usage data for programmatic monitoring.
              </p>

              <div className="mt-8 overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10 text-left text-sm text-white/80">
                  <thead>
                    <tr className="bg-white/5 text-white">
                      <th className="px-4 py-3 font-medium">Model</th>
                      <th className="px-4 py-3 font-medium">Tier</th>
                      <th className="px-4 py-3 font-medium">RPM</th>
                      <th className="px-4 py-3 font-medium">TPM</th>
                      <th className="px-4 py-3 font-medium">Burst</th>
                      <th className="px-4 py-3 font-medium">Token Limit</th>
                      <th className="px-4 py-3 font-medium">Concurrency (recommended)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {SORTED_MODELS.map((model) => {
                      const concurrency = Math.max(4, Math.round(model.rateLimits.rpm / 12));
                      return (
                        <tr key={model.id} className="hover:bg-white/5">
                          <td className="px-4 py-3 text-white">{model.name}</td>
                          <td className="px-4 py-3 capitalize">{model.tier}</td>
                          <td className="px-4 py-3">{model.rateLimits.rpm.toLocaleString()}</td>
                          <td className="px-4 py-3">{model.rateLimits.tpm.toLocaleString()}</td>
                          <td className="px-4 py-3">{model.rateLimits.burst}</td>
                          <td className="px-4 py-3">{model.contextWindowLabel}</td>
                          <td className="px-4 py-3">{concurrency} concurrent threads</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-10 grid gap-6 lg:grid-cols-2">
                <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">Handling Rate Limiting</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-gray-200">
                    {RATE_LIMIT_BEST_PRACTICES.map((tip) => (
                      <div key={tip} className="flex items-start gap-2">
                        <Zap className="mt-0.5 h-4 w-4 text-white/60" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">Headers & Error Codes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-gray-200">
                    <div className="space-y-2">
                      {RATE_LIMIT_HEADERS.map((row) => (
                        <div key={row.header} className="rounded-lg border border-white/10 bg-black/40 p-3">
                          <p className="text-white font-medium">{row.header}</p>
                          <p className="text-white/60">{row.description}</p>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {ERROR_CODES.map((row) => (
                        <div key={row.code} className="rounded-lg border border-white/10 bg-black/40 p-3">
                          <p className="text-white font-medium">HTTP {row.code}</p>
                          <p className="text-white/60">{row.meaning}</p>
                          <p className="text-white/40">Recovery: {row.recovery}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-10 border-white/10 bg-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Enterprise Limit Increases</CardTitle>
                  <CardDescription className="text-white/60">
                    Fast-track additional capacity for production workloads
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm text-gray-200 md:grid-cols-2">
                  <div className="rounded-lg border border-white/10 bg-black/40 p-4">
                    <p className="font-semibold text-white">Standard turnaround</p>
                    <p className="text-white/60">24-48 hours for reviewed accounts</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-black/40 p-4">
                    <p className="font-semibold text-white">Urgent escalation</p>
                    <p className="text-white/60">Under 2 hours via enterprise hotline</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-black/40 p-4">
                    <p className="font-semibold text-white">Requirements</p>
                    <p className="text-white/60">Projected volume, workload type, compliance posture</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-black/40 p-4">
                    <p className="font-semibold text-white">Contact</p>
                    <p className="text-white/60">Console → Usage → Request increase or email limits@oculus.ai</p>
                  </div>
                </CardContent>
              </Card>
            </Section>

            <Section id="api-reference" title="API Reference">
              <div className="space-y-6">
                <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">POST</Badge>
                      <code className="text-white">/v1/analyze</code>
                    </div>
                    <CardDescription className="text-white/60">
                      Analyze an image using a specified model
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-gray-200">
                    <div className="rounded-lg border border-white/10 bg-black/60 p-4">
                      <code>
                        <div>{"{"}</div>
                        <div>  "model": "oculus-1-0125",</div>
                        <div>  "image": "https://example.com/image.jpg",</div>
                        <div>  "tasks": ["classification", "detection"],</div>
                        <div>  "options": {"{"}</div>
                        <div>    "confidence_threshold": 0.8</div>
                        <div>  {"}"}</div>
                        <div>{"}"}</div>
                      </code>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-black/60 p-4">
                      <code>
                        <div>{"{"}</div>
                        <div>  "id": "req_123abc",</div>
                        <div>  "model": "oculus-1-0125",</div>
                        <div>  "results": {"{"} ... {"}"},</div>
                        <div>  "processing_time_ms": 87</div>
                        <div>{"}"}</div>
                      </code>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">GET</Badge>
                      <code className="text-white">/v1/models</code>
                    </div>
                    <CardDescription className="text-white/60">
                      List all available models and their capabilities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border border-white/10 bg-black/60 p-4 text-sm text-gray-200">
                      <code>
                        <div>{"{"}</div>
                        <div>  "models": [</div>
                        <div>    {"{"}</div>
                        <div>      "id": "oculus-1-0125",</div>
                        <div>      "name": "Oculus 1.0",</div>
                        <div>      "capabilities": ["classification", "detection"]</div>
                        <div>    {"}"},</div>
                        <div>    ...</div>
                        <div>  ]</div>
                        <div>{"}"}</div>
                      </code>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Section>

            <Section id="examples" title="Examples">
              <div className="space-y-6">
                {[
                  {
                    title: "Image Classification",
                    icon: Code,
                    snippet: "const result = await client.analyze({ model: 'oculus-1-0125', image, tasks: ['classification'] });",
                    commentary: "Returns ranked labels with confidence scores for each detected class.",
                  },
                  {
                    title: "Object Detection",
                    icon: Globe,
                    snippet:
                      "const result = await client.analyze({ model: 'oculus-1.5-0503', image, tasks: ['detection'], options: { confidence_threshold: 0.7 } });",
                    commentary: "Iterate over detection bounding boxes with label, confidence, and mask overlays.",
                  },
                  {
                    title: "Batch Processing",
                    icon: ServersIcon,
                    snippet:
                      "const jobs = await client.batchAnalyze({ model: 'oculus-2.0-0615', images, tasks: ['classification', 'segmentation'] });",
                    commentary: "Batch jobs stream incremental results for high-throughput workflows.",
                  },
                ].map((example) => (
                  <Card key={example.title} className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader className="flex items-center gap-3">
                      <example.icon className="h-5 w-5 text-white/80" />
                      <div>
                        <CardTitle className="text-white text-lg">{example.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-gray-200">
                      <div className="rounded-lg border border-white/10 bg-black/60 p-4">
                        <code>{example.snippet}</code>
                      </div>
                      <p className="text-white/60">{example.commentary}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Section>

            <Section id="capabilities" title="Capabilities">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { icon: Globe, title: "Scene Understanding", description: "Comprehend complex scenes, relationships, and context." },
                  { icon: Shield, title: "Compliance Tooling", description: "Inline policy enforcement, redaction, and audit streaming." },
                  { icon: Sparkles, title: "Autonomous Agents", description: "Orchestrate tool use, memory, and self-healing workflows." },
                  { icon: Code, title: "Structured Reasoning", description: "Generate JSON, SQL, or domain-specific DSL outputs." },
                  { icon: Gauge, title: "Fine-Grained Accuracy", description: "Subdomain fine-tunes for geospatial, medical, and security workloads." },
                  { icon: Zap, title: "Real-Time Vision", description: "Sub-100ms streaming for robotics and interactive agents." },
                ].map((capability) => (
                  <Card key={capability.title} className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <capability.icon className="mb-3 h-8 w-8 text-white" />
                      <CardTitle className="text-white text-lg">{capability.title}</CardTitle>
                      <CardDescription className="text-white/60">{capability.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </Section>

            <Section id="best-practices" title="Best Practices">
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  {
                    title: "Image Quality",
                    tips: ["Use high-resolution inputs (≥224px)", "Avoid aggressive compression", "Normalize lighting where possible"],
                  },
                  {
                    title: "Performance",
                    tips: ["Batch workloads to reduce latency", "Cache frequent responses", "Route to low-latency models when budget constrained"],
                  },
                  {
                    title: "Error Handling",
                    tips: ["Implement retries with jitter", "Watch rate-limit headers", "Validate inputs before sending"],
                  },
                ].map((card) => (
                  <Card key={card.title} className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">{card.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-gray-200">
                      {card.tips.map((tip) => (
                        <div key={tip} className="flex items-start gap-2">
                          <Sparkles className="mt-0.5 h-4 w-4 text-white/60" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-10 border-white/10 bg-white/5 backdrop-blur-sm text-center">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Need expert guidance?</CardTitle>
                  <CardDescription className="text-white/60">
                    Our solutions team can help evaluate workloads, plan migrations, and optimize cost-performance.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Button className="bg-white text-black hover:bg-gray-200">Contact Support</Button>
                  <Button variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                    Join Community
                  </Button>
                </CardContent>
              </Card>
            </Section>
          </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <h2 className="text-3xl font-bold text-white">{title}</h2>
      </motion.div>
      <div>{children}</div>
    </section>
  );
}

function BenchmarkBar({ label, value, max }: { label: string; value: number; max: number }) {
  const percentage = Math.max(5, Math.round((value / max) * 100));
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-white/60">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/10">
        <div className="h-full rounded-full bg-white" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function ComparisonGrid({
  primary,
  secondary,
}: {
  primary: ReturnType<typeof getComparisonInfo>;
  secondary: ReturnType<typeof getComparisonInfo>;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
      <div className="grid grid-cols-3 divide-x divide-white/10 text-sm text-white/70">
        <div className="bg-white/5 p-3 font-semibold text-white">Attribute</div>
        <div className="p-3">
          {primary ? (
            <>
              <p className="font-semibold text-white">{primary.name}</p>
              <p className="text-xs text-white/50">{primary.badge}</p>
            </>
          ) : (
            <p className="text-white/40">Select a model</p>
          )}
        </div>
        <div className="p-3">
          {secondary ? (
            <>
              <p className="font-semibold text-white">{secondary.name}</p>
              <p className="text-xs text-white/50">{secondary.badge}</p>
            </>
          ) : (
            <p className="text-white/40">Select a model</p>
          )}
        </div>
      </div>
      {[
        { label: "Tier", primary: primary?.tier, secondary: secondary?.tier },
        { label: "Pricing", primary: primary?.price, secondary: secondary?.price },
        { label: "Accuracy", primary: primary?.accuracy, secondary: secondary?.accuracy },
        { label: "Latency", primary: primary?.latency, secondary: secondary?.latency },
        { label: "Context", primary: primary?.context, secondary: secondary?.context },
        { label: "Availability", primary: primary?.availability, secondary: secondary?.availability },
        { label: "Use cases", primary: primary?.useCases.join(", "), secondary: secondary?.useCases.join(", ") },
      ].map((row) => (
        <div key={row.label} className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 text-sm text-white/70">
          <div className="bg-white/5 px-3 py-2 font-medium text-white">{row.label}</div>
          <div className="px-3 py-2 text-white/80">{row.primary ?? "—"}</div>
          <div className="px-3 py-2 text-white/80">{row.secondary ?? "—"}</div>
        </div>
      ))}
    </div>
  );
}

function ServersIcon(props: React.SVGProps<SVGSVGElement>) {
  return <Server {...props} />;
}
