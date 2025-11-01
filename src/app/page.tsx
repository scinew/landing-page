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
  BarChart3,
  TrendingUp,
  Gauge,
  Clock,
} from "lucide-react";
import { InteractiveBackground } from "@/components/interactive-background";
import { SiteHeader } from "@/components/site-header";

const FEATURES = [
  { icon: Eye, title: "Advanced Vision", description: "State-of-the-art image recognition and analysis capabilities" },
  { icon: Zap, title: "Lightning Fast", description: "Optimized for real-time processing with minimal latency" },
  { icon: Brain, title: "AI-Powered", description: "Deep learning models trained on diverse datasets" },
  { icon: Globe, title: "Scalable", description: "Deploy anywhere from edge devices to cloud infrastructure" },
  { icon: Shield, title: "Secure", description: "Enterprise-grade security and privacy protection" },
  { icon: Sparkles, title: "Continuously Learning", description: "Models that improve and adapt over time" },
] as const;

const BENCHMARK_DATA = [
  {
    model: "oculus-1-0125",
    badge: "Foundation Model",
    metrics: [
      { label: "Accuracy", value: "98.7%", icon: Gauge },
      { label: "Latency", value: "85ms", icon: Clock },
      { label: "Throughput", value: "12K/sec", icon: TrendingUp },
      { label: "Token Limit", value: "8K", icon: BarChart3 },
    ],
  },
  {
    model: "oculus-1.5-0503",
    badge: "Enhanced Model",
    metrics: [
      { label: "Accuracy", value: "99.4%", icon: Gauge },
      { label: "Latency", value: "120ms", icon: Clock },
      { label: "Throughput", value: "8K/sec", icon: TrendingUp },
      { label: "Token Limit", value: "32K", icon: BarChart3 },
    ],
  },
];

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
    href: "/checkout",
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
    href: "/checkout",
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
    href: "/checkout",
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

  return (
    <>
      <SiteHeader />
      <InteractiveBackground />
      <div ref={containerRef} className="relative min-h-screen bg-black text-white overflow-hidden pt-16">
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

            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-white/20 via-white/30 to-white/20 scale-150" />
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative text-6xl sm:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
              >
                <span className="relative">
                  Oculus AI
                  <div className="absolute -inset-4 bg-white/10 blur-2xl animate-pulse" />
                </span>
              </motion.h1>
            </div>

            <div className="relative">
              <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-white/10 via-white/15 to-white/10" />
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative text-xl sm:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto"
              >
                Unleashing the power of advanced vision models to see beyond the visible with glassmorphism-inspired clarity.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg group" asChild>
                <Link href="/chat">
                  Try Chat Demo
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent px-8 py-6 text-lg"
                asChild
              >
                <Link href="/register">
                  Get Started
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

        <section id="benchmarks" className="relative py-32 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <Badge variant="outline" className="mx-auto w-fit border-white/30 bg-transparent text-white hover:bg-white/10 mb-6">
                <BarChart3 className="w-3 h-3 mr-2" />
                Performance Benchmarks
              </Badge>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Industry-Leading Performance
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Compare the performance metrics of our vision models across key dimensions
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {BENCHMARK_DATA.map((model, idx) => (
                <motion.div
                  key={model.model}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-md hover:border-white/30 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
                    <CardHeader className="relative z-10">
                      <Badge className="mb-4 w-fit bg-white text-black">{model.badge}</Badge>
                      <CardTitle className="text-white text-2xl font-mono">{model.model}</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="grid grid-cols-2 gap-6">
                        {model.metrics.map((metric) => (
                          <div
                            key={metric.label}
                            className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm hover:border-white/30 transition-all"
                          >
                            <metric.icon className="w-6 h-6 mb-2 text-white/70" />
                            <div className="text-xs text-gray-400 mb-1">{metric.label}</div>
                            <div className="text-2xl font-bold text-white">{metric.value}</div>
                          </div>
                        ))}
                      </div>
                      <Button className="w-full mt-6 bg-white text-black hover:bg-gray-200" asChild>
                        <Link href="/chat">
                          Test {model.model}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="relative py-32 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
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
                Choose Your Plan
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Flexible pricing to scale with your needs
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PRICING_TIERS.map((tier, index) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="relative"
                >
                  <Card
                    className={`relative h-full overflow-hidden border-white/10 bg-white/5 backdrop-blur-md transition-all duration-500 ${
                      tier.highlight ? "border-white/40 ring-2 ring-white/20" : "hover:border-white/30"
                    }`}
                  >
                    {tier.highlight && (
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-white/50 via-white to-white/50" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-white text-2xl mb-2">{tier.name}</CardTitle>
                      <div className="flex items-baseline mb-4">
                        <span className="text-5xl font-bold text-white">{tier.price}</span>
                        {tier.period && <span className="text-gray-400 ml-2">{tier.period}</span>}
                      </div>
                      <CardDescription className="text-gray-400">{tier.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <ul className="space-y-3 mb-8">
                        {tier.perks.map((perk) => (
                          <li key={perk} className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 mr-3 flex-shrink-0" />
                            <span className="text-gray-300">{perk}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={`w-full ${
                          tier.highlight
                            ? "bg-white text-black hover:bg-gray-200"
                            : "border-white/20 bg-white/10 text-white hover:bg-white/20"
                        }`}
                        variant={tier.highlight ? "default" : "outline"}
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

        <footer className="relative border-t border-white/10 bg-black/70 backdrop-blur-xl py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="font-mono text-sm uppercase tracking-[0.3em] text-white/60">Oculus AI</div>
              <div className="flex gap-6 text-sm text-white/40">
                <Link href="/models" className="hover:text-white transition-colors">Models</Link>
                <Link href="/register" className="hover:text-white transition-colors">Register</Link>
                <Link href="/chat" className="hover:text-white transition-colors">Chat</Link>
                <Link href="/checkout" className="hover:text-white transition-colors">Plans</Link>
                <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
              </div>
              <div className="text-xs text-white/40">© 2025 Oculus AI. All rights reserved.</div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
