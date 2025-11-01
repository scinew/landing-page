"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Eye,
  Zap,
  Brain,
  Globe,
  Shield,
  Sparkles,
  BookOpen,
  Code2,
  Layers,
  Users,
} from "lucide-react";

const FEATURES = [
  { icon: Eye, title: "Advanced Vision", description: "State-of-the-art image recognition and analysis capabilities" },
  { icon: Zap, title: "Lightning Fast", description: "Optimized for real-time processing with minimal latency" },
  { icon: Brain, title: "AI-Powered", description: "Deep learning models trained on diverse datasets" },
  { icon: Globe, title: "Scalable", description: "Deploy anywhere from edge devices to cloud infrastructure" },
  { icon: Shield, title: "Secure", description: "Enterprise-grade security and privacy protection" },
  { icon: Sparkles, title: "Continuously Learning", description: "Models that improve and adapt over time" },
] as const;

const DOCUMENTATION_HIGHLIGHTS = [
  {
    id: "oculus-1-0125",
    badge: "Foundation Model",
    title: "oculus-1-0125",
    description:
      "Our foundational vision model, optimized for general-purpose image understanding and classification tasks with exceptional accuracy.",
    highlights: [
      "99% precision on core manufacturing, retail, and security datasets",
      "Designed for edge devices with CPU + GPU parity",
      "Adaptive noise reduction for challenging environments",
    ],
    endpoints: [
      { label: "REST", value: "POST https://api.oculus.ai/v1/vision/classify" },
      { label: "SDK", value: "client.analyze({ model: 'oculus-1-0125' })" },
    ],
    example: `curl https://api.oculus.ai/v1/vision/classify \
  -H "Authorization: Bearer $OCULUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "oculus-1-0125",
    "image": "https://assets.oculus.ai/samples/assembly-line.jpg",
    "tasks": ["classification", "detection"],
    "options": { "confidence_threshold": 0.85 }
  }'`,
    sdkSnippet: `const result = await client.analyze({
  model: "oculus-1-0125",
  image: imageUrl,
  tasks: ["classification", "detection"],
});

console.log(result.classifications[0]);`,
  },
  {
    id: "oculus-1.5-0503",
    badge: "Enhanced Model",
    title: "oculus-1.5-0503",
    description:
      "The next evolution in vision AI. Enhanced capabilities for complex scene understanding, fine-grained object detection, and semantic analysis.",
    highlights: [
      "Multi-modal fusion for synchronized text, audio, and video inputs",
      "Fine-grained segmentation down to 2px resolution",
      "Context-aware reasoning with explainable outputs",
    ],
    endpoints: [
      { label: "REST", value: "POST https://api.oculus.ai/v1/vision/analyze" },
      { label: "Streaming", value: "wss://stream.oculus.ai/v1/vision/live" },
    ],
    example: `curl https://api.oculus.ai/v1/vision/analyze \
  -H "Authorization: Bearer $OCULUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "oculus-1.5-0503",
    "input": {
      "image": "https://assets.oculus.ai/samples/metropolis.jpg",
      "prompt": "Identify traffic anomalies and unusual objects"
    },
    "tasks": ["segmentation", "reasoning"],
    "options": { "report": "narrative" }
  }'`,
    sdkSnippet: `const result = await client.analyze({
  model: "oculus-1.5-0503",
  image: frameBuffer,
  prompt: "Summarize key events",
  tasks: ["segmentation", "reasoning"],
});

console.log(result.summary);`,
  },
] as const;

const SPONSORS = [
  {
    name: "Horizon Labs",
    description: "Deploying Oculus AI across 12k autonomous retail kiosks worldwide.",
    tag: "Edge Compute Partner",
  },
  {
    name: "Visionary Ventures",
    description: "Backing large-scale infrastructure that powers trillions of frames each month.",
    tag: "Strategic Investor",
  },
  {
    name: "Synapse Studios",
    description: "Using Oculus AI to orchestrate live sports analytics across five continents.",
    tag: "Premier Partner",
  },
  {
    name: "LambdaWorks",
    description: "Training specialized safety models with Oculus AI accelerated pipelines.",
    tag: "Research Lab",
  },
  {
    name: "NeuralShift",
    description: "Integrating Oculus AI into next-gen robotics and industrial inspection systems.",
    tag: "Automation Partner",
  },
  {
    name: "GlassWing",
    description: "Delivering immersive AR experiences powered by Oculus AI perception.",
    tag: "Experience Studio",
  },
] as const;

const PRICING_TIERS = [
  {
    name: "Starter",
    price: "$99",
    period: "/month",
    description: "Launch your first vision-powered product with production-ready tooling.",
    perks: [
      "50k image credits included",
      "Access to oculus-1-0125",
      "Batch + realtime APIs",
      "Community & email support",
    ],
    cta: "Start Trial",
    href: "#contact",
    highlight: false,
  },
  {
    name: "Growth",
    price: "$299",
    period: "/month",
    description: "Scale to millions of inferences with proactive monitoring and SLAs.",
    perks: [
      "500k image credits",
      "Access to both models",
      "Low-latency streaming endpoints",
      "Dedicated success manager",
    ],
    cta: "Talk to Sales",
    href: "#contact",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored deployments with compliance, private hosting, and custom training.",
    perks: [
      "Unlimited usage tiers",
      "Private fine-tuning",
      "On-prem & sovereign cloud support",
      "24/7 white-glove coverage",
    ],
    cta: "Book a Demo",
    href: "#contact",
    highlight: false,
  },
] as const;

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const opacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(smoothProgress, [0, 0.2], [1, 0.95]);
  const y1 = useTransform(smoothProgress, [0, 0.5], [0, 200]);
  const y2 = useTransform(smoothProgress, [0, 0.5], [0, -100]);
  const y3 = useTransform(smoothProgress, [0.2, 0.6], [0, 150]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
        style={{ opacity, scale }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <Badge variant="outline" className="border-white/20 text-white bg-transparent hover:bg-white/10 px-4 py-2 text-sm">
              <Sparkles className="w-3 h-3 mr-2 inline" />
              Next-Gen Vision Intelligence
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
          >
            Oculus AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto"
          >
            Unleashing the power of advanced vision models to see beyond the visible with glassmorphism-inspired clarity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button size="lg" className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg group" asChild>
              <Link href="#pricing">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent px-8 py-6 text-lg"
              asChild
            >
              <Link href="/docs">
                View Documentation
              </Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
            <motion.div
              className="w-1.5 h-1.5 bg-white/60 rounded-full mx-auto"
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section with Parallax */}
      <motion.section className="relative py-32 px-4 sm:px-6 lg:px-8" style={{ y: y1 }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-30" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Why Choose Oculus AI?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Cutting-edge vision models designed for precision, speed, and scalability
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Card className="group relative h-full overflow-hidden border-white/10 bg-white/5 backdrop-blur-md transition-all duration-500 hover:border-white/40">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="relative z-10">
                    <feature.icon className="w-12 h-12 mb-4 text-white" />
                    <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-400">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Model 1 Section */}
      <motion.section className="relative py-32 px-4 sm:px-6 lg:px-8" style={{ y: y2 }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-0 w-72 h-72 bg-white/10 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-6 bg-white text-black hover:bg-gray-200">Foundation Model</Badge>
              <h2 className="text-5xl sm:text-6xl font-bold mb-6">oculus-1-0125</h2>
              <p className="text-xl text-gray-400 mb-8">
                Our foundational vision model, optimized for general-purpose image understanding
                and classification tasks with exceptional accuracy.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { title: "High Accuracy", description: "98.7% accuracy on standard benchmarks" },
                  { title: "Fast Inference", description: "Sub-100ms response times at scale" },
                  { title: "Versatile", description: "Supports multiple image formats and sizes" },
                ].map((item) => (
                  <div className="flex items-start" key={item.title}>
                    <div className="w-2 h-2 bg-white rounded-full mt-2 mr-4" />
                    <div>
                      <h4 className="text-lg font-semibold mb-1">{item.title}</h4>
                      <p className="text-gray-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button size="lg" className="bg-white text-black hover:bg-gray-200 group" asChild>
                <Link href="/docs#models">
                  Explore oculus-1-0125
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-square rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-8 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative z-10 h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl font-bold mb-4">01</div>
                    <div className="text-2xl text-gray-400">Foundation</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Model 2 Section */}
      <motion.section className="relative py-32 px-4 sm:px-6 lg:px-8" style={{ y: y3 }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-1/3 right-0 w-72 h-72 bg-white/10 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative aspect-square rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-8 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative z-10 h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl font-bold mb-4">1.5</div>
                    <div className="text-2xl text-gray-400">Enhanced</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <Badge className="mb-6 bg-white text-black hover:bg-gray-200">Enhanced Model</Badge>
              <h2 className="text-5xl sm:text-6xl font-bold mb-6">oculus-1.5-0503</h2>
              <p className="text-xl text-gray-400 mb-8">
                The next evolution in vision AI. Enhanced capabilities for complex scene
                understanding, fine-grained object detection, and semantic analysis.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { title: "Enhanced Understanding", description: "Advanced scene comprehension and context awareness" },
                  { title: "Multi-Modal", description: "Seamlessly integrates with text and audio inputs" },
                  { title: "Fine-Grained Detection", description: "Identifies subtle details and nuanced patterns" },
                ].map((item) => (
                  <div className="flex items-start" key={item.title}>
                    <div className="w-2 h-2 bg-white rounded-full mt-2 mr-4" />
                    <div>
                      <h4 className="text-lg font-semibold mb-1">{item.title}</h4>
                      <p className="text-gray-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button size="lg" className="bg-white text-black hover:bg-gray-200 group" asChild>
                <Link href="/docs#models">
                  Explore oculus-1.5-0503
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Documentation Highlights */}
      <section id="documentation" className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-30" />
        </div>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mx-auto w-fit border-white/30 bg-transparent text-white hover:bg-white/10">
              <BookOpen className="w-3 h-3 mr-2" />
              Documentation
            </Badge>
            <h2 className="mt-6 text-4xl sm:text-5xl font-bold">Build with confidence</h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mt-4">
              Comprehensive guides, API references, and usage examples for every Oculus AI model.
            </p>
          </motion.div>

          <div className="space-y-12">
            {DOCUMENTATION_HIGHLIGHTS.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:border-white/40">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <CardHeader className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <Badge className="mb-4 bg-white text-black hover:bg-gray-200 w-fit">{section.badge}</Badge>
                      <CardTitle className="text-3xl text-white">{section.title}</CardTitle>
                      <CardDescription className="text-gray-300 text-lg max-w-2xl mt-4">
                        {section.description}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                      asChild
                    >
                      <Link href={`/docs#${section.id}`}>Full documentation</Link>
                    </Button>
                  </CardHeader>
                  <CardContent className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <Layers className="w-4 h-4" />
                          Capabilities
                        </h3>
                        <ul className="space-y-2 text-gray-300">
                          {section.highlights.map((highlight) => (
                            <li key={highlight} className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Endpoints
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {section.endpoints.map((endpoint) => (
                            <div
                              key={endpoint.label}
                              className="rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-gray-300"
                            >
                              <p className="text-white text-xs uppercase tracking-widest mb-2">{endpoint.label}</p>
                              <p className="break-words leading-relaxed">{endpoint.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-white/10 bg-black/60 p-5">
                        <div className="mb-3 flex items-center gap-2 text-sm text-white">
                          <Code2 className="w-4 h-4" />
                          cURL
                        </div>
                        <pre className="text-left text-sm leading-relaxed text-gray-200 whitespace-pre-wrap">
                          {section.example}
                        </pre>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/60 p-5">
                        <div className="mb-3 flex items-center gap-2 text-sm text-white">
                          <Code2 className="w-4 h-4" />
                          SDK
                        </div>
                        <pre className="text-left text-sm leading-relaxed text-gray-200 whitespace-pre-wrap">
                          {section.sdkSnippet}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section id="sponsors" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-20" />
        </div>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mx-auto w-fit border-white/30 bg-transparent text-white hover:bg-white/10">
              Strategic Partners
            </Badge>
            <h2 className="mt-6 text-4xl font-bold">Trusted by vision-first teams</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mt-4">
              Leading companies, studios, and research labs build on Oculus AI to power mission-critical vision systems.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {SPONSORS.map((sponsor, index) => (
              <motion.div
                key={sponsor.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:border-white/40">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative z-10">
                    <p className="text-sm uppercase tracking-[0.3em] text-white/60 mb-3">{sponsor.tag}</p>
                    <h3 className="text-2xl font-semibold text-white mb-4">{sponsor.name}</h3>
                    <p className="text-gray-300 leading-relaxed">{sponsor.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-32 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-40" />
        </div>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mx-auto w-fit border-white/30 bg-transparent text-white hover:bg-white/10">
              Pricing
            </Badge>
            <h2 className="mt-6 text-4xl sm:text-5xl font-bold">
              Flexible pricing for every stage
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mt-4">
              Choose a plan that matches your scale and compliance needs. Seamless upgrades as your workload grows.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {PRICING_TIERS.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  className={`relative overflow-hidden backdrop-blur-xl transition-all duration-500 h-full border-2 ${
                    tier.highlight
                      ? "border-white bg-white text-black shadow-[0_30px_120px_-60px_rgba(255,255,255,1)]"
                      : "border-white/10 bg-black/60 text-white hover:border-white/40 hover:bg-white/10"
                  }`}
                >
                  {tier.highlight && (
                    <div className="absolute top-4 right-4 rounded-full bg-black text-white px-3 py-1 text-xs font-semibold">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className={`text-3xl ${tier.highlight ? "text-black" : "text-white"}`}>
                      {tier.name}
                    </CardTitle>
                    <CardDescription className={`${tier.highlight ? "text-black/70" : "text-gray-300"} text-base`}>
                      {tier.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <span className={`text-4xl font-bold ${tier.highlight ? "text-black" : "text-white"}`}>
                        {tier.price}
                      </span>
                      {tier.period && (
                        <span className={`ml-2 text-base ${tier.highlight ? "text-black/70" : "text-gray-400"}`}>
                          {tier.period}
                        </span>
                      )}
                    </div>
                    <ul className="space-y-3">
                      {tier.perks.map((perk) => (
                        <li
                          key={perk}
                          className={`flex items-center gap-3 text-sm ${tier.highlight ? "text-black/80" : "text-gray-300"}`}
                        >
                          <span className={`h-2 w-2 rounded-full ${tier.highlight ? "bg-black" : "bg-white"}`} />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      size="lg"
                      className={
                        tier.highlight
                          ? "bg-black text-white hover:bg-black/80"
                          : "bg-white text-black hover:bg-gray-200"
                      }
                      asChild
                    >
                      <Link href={tier.href}>{tier.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">Choose Your Model</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Both models are designed for excellence, optimized for different use cases
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[{
              title: "oculus-1-0125",
              description: "Perfect for standard vision tasks",
              items: [
                "Image classification",
                "Object detection",
                "Face recognition",
                "Quality assurance",
                "Content moderation",
              ],
            }, {
              title: "oculus-1.5-0503",
              description: "Advanced capabilities for complex tasks",
              items: [
                "Scene understanding",
                "Multi-object tracking",
                "Semantic segmentation",
                "Visual reasoning",
                "Cross-modal analysis",
              ],
            }].map((model, index) => (
              <motion.div
                key={model.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Card className="group relative h-full overflow-hidden border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:border-white/40">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-white text-3xl mb-4">{model.title}</CardTitle>
                    <CardDescription className="text-gray-400 text-lg">
                      {model.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <ul className="space-y-3">
                      {model.items.map((item) => (
                        <li key={item} className="flex items-center text-gray-300">
                          <div className="w-1.5 h-1.5 bg-white rounded-full mr-3" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-30" />
        </div>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Ready to See the Future?
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Start building with Oculus AI today. Join thousands of developers leveraging the power of advanced vision intelligence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg group" asChild>
                <Link href="#pricing">
                  Get API Access
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent px-8 py-6 text-lg"
                asChild
              >
                <Link href="mailto:sales@oculus.ai">Contact Sales</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Oculus AI</h3>
              <p className="text-gray-400">Advanced vision intelligence for the modern world.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#documentation" className="text-gray-400 hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-gray-400 hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/docs#api-reference" className="text-gray-400 hover:text-white transition-colors">
                    API Reference
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#sponsors" className="text-gray-400 hover:text-white transition-colors">
                    Sponsors
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <a href="mailto:careers@oculus.ai" className="text-gray-400 hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Stay in touch</h4>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:support@oculus.ai" className="text-gray-400 hover:text-white transition-colors">
                    support@oculus.ai
                  </a>
                </li>
                <li>
                  <a href="mailto:sales@oculus.ai" className="text-gray-400 hover:text-white transition-colors">
                    sales@oculus.ai
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Oculus AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
