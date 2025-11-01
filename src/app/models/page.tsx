"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE_MODELS } from "@/lib/models";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";

export default function ModelsPage() {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recommended");
  const [selected, setSelected] = useState<string[]>([]);

  const filteredModels = useMemo(() => {
    let models = SITE_MODELS;

    if (filter !== "all") {
      models = models.filter((model) => model.categories.includes(filter));
    }

    switch (sort) {
      case "price-asc":
        return [...models].sort((a, b) => a.pricing.input + a.pricing.output - (b.pricing.input + b.pricing.output));
      case "price-desc":
        return [...models].sort((a, b) => b.pricing.input + b.pricing.output - (a.pricing.input + a.pricing.output));
      case "performance":
        return [...models].sort((a, b) => b.performanceScore - a.performanceScore);
      case "context":
        return [...models].sort((a, b) => b.contextWindowTokens - a.contextWindowTokens);
      default:
        return [...models].sort((a, b) => a.recommendedOrder - b.recommendedOrder);
    }
  }, [filter, sort]);

  const toggleCompare = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((modelId) => modelId !== id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  return (
    <>
      <SiteHeader />
      <div className="relative min-h-screen bg-black text-white">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-24 left-10 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-24 right-10 h-[30rem] w-[30rem] rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
          <Badge variant="outline" className="mb-6 border-white/30 bg-transparent text-white">
            Oculus AI Platform
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Oculus Model Portfolio
          </h1>
          <p className="mt-4 text-lg text-white/60">
            Explore our suite of production-ready vision models with tiered pricing and enterprise-grade SLAs.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Button asChild className="bg-white text-black hover:bg-gray-200">
              <Link href="/register">Get Started</Link>
            </Button>
            <Button variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20" asChild>
              <Link href="/checkout">View Pricing</Link>
            </Button>
          </div>
        </motion.div>

        <div className="mb-12 grid gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:grid-cols-4">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Sort By</h2>
            <div className="grid gap-2">
              {[
                { id: "recommended", label: "Recommended" },
                { id: "price-asc", label: "Price: Low to High" },
                { id: "price-desc", label: "Price: High to Low" },
                { id: "performance", label: "Performance" },
                { id: "context", label: "Context Window" },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSort(option.id)}
                  className={`rounded-lg border px-4 py-2 text-left text-sm transition-all ${
                    sort === option.id
                      ? "border-white/40 bg-white/15"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 lg:col-span-3">
            <h2 className="text-lg font-semibold">Filter By Use Case</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { id: "all", label: "All" },
                { id: "general", label: "General Purpose" },
                { id: "multimodal", label: "Multimodal" },
                { id: "vision", label: "Vision Specialist" },
                { id: "enterprise", label: "Enterprise" },
                { id: "lightweight", label: "Low Latency" },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setFilter(option.id)}
                  className={`rounded-full border px-4 py-2 text-sm transition-all ${
                    filter === option.id
                      ? "border-white bg-white text-black"
                      : "border-white/15 bg-white/5 text-white/80 hover:border-white/30 hover:bg-white/10"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence>
                {filteredModels.map((model) => (
                  <motion.div
                    key={model.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="group h-full border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-white/25">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-white text-black">{model.badge}</Badge>
                          <button
                            onClick={() => toggleCompare(model.id)}
                            className={`rounded-full border px-3 py-1 text-xs transition ${
                              selected.includes(model.id)
                                ? "border-white bg-white text-black"
                                : "border-white/15 text-white/70 hover:border-white/30 hover:bg-white/10"
                            }`}
                          >
                            {selected.includes(model.id) ? "Selected" : "Compare"}
                          </button>
                        </div>
                        <CardTitle className="text-2xl text-white">{model.name}</CardTitle>
                        <CardDescription className="text-white/60">
                          {model.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-3 text-sm text-white/70">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-white/40">Context Window</p>
                            <p className="font-semibold text-white">{model.contextWindowLabel}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-white/40">Latency</p>
                            <p className="font-semibold text-white">{model.performance.latency}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-white/40">Accuracy</p>
                            <p className="font-semibold text-white">{model.performance.accuracy}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-white/40">Throughput</p>
                            <p className="font-semibold text-white">{model.performance.throughput}</p>
                          </div>
                        </div>

                        <div>
                          <p className="mb-2 text-xs uppercase tracking-wide text-white/40">Capabilities</p>
                          <div className="flex flex-wrap gap-2">
                            {model.capabilities.slice(0, 4).map((capability) => (
                              <span
                                key={capability}
                                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                              >
                                {capability}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="mb-2 text-xs uppercase tracking-wide text-white/40">Ideal For</p>
                          <ul className="space-y-1 text-sm text-white/70">
                            {model.useCases.slice(0, 3).map((useCase) => (
                              <li key={useCase}>• {useCase}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                          <p className="text-xs uppercase tracking-wide text-white/40">Pricing (per 1M tokens)</p>
                          <div className="mt-3 flex items-center justify-between text-sm text-white/80">
                            <div>
                              <p className="text-white/60">Input</p>
                              <p className="text-lg font-semibold text-white">${model.pricing.input.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-white/60">Output</p>
                              <p className="text-lg font-semibold text-white">${model.pricing.output.toFixed(2)}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-white/60">Availability</p>
                              <p className="text-sm font-medium uppercase text-white">
                                {model.availability.toUpperCase()}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <Button size="sm" className="bg-white text-black hover:bg-gray-200" asChild>
                            <Link href={`/chat?model=${model.id}`}>Try Now</Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                            asChild
                          >
                            <Link href="/register">Get Started</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-16 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Compare Models</h2>
                <p className="text-sm text-white/60">Selected up to 3 models for side-by-side comparison.</p>
              </div>
              <Button
                variant="outline"
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                onClick={() => setSelected([])}
              >
                Clear Comparison
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-white/80">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-white/40">
                    <th className="px-4 py-3">Capability</th>
                    {selected.map((modelId) => {
                      const model = SITE_MODELS.find((item) => item.id === modelId)!;
                      return (
                        <th key={model.id} className="px-4 py-3 font-medium text-white">
                          {model.name}
                          <span className="ml-2 text-xs text-white/40">{model.version}</span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: "Context Window",
                      value: (model: (typeof SITE_MODELS)[number]) => model.contextWindowLabel,
                    },
                    {
                      label: "Accuracy",
                      value: (model: (typeof SITE_MODELS)[number]) => model.performance.accuracy,
                    },
                    {
                      label: "Latency",
                      value: (model: (typeof SITE_MODELS)[number]) => model.performance.latency,
                    },
                    {
                      label: "Throughput",
                      value: (model: (typeof SITE_MODELS)[number]) => model.performance.throughput,
                    },
                    {
                      label: "Pricing (Input / Output)",
                      value: (model: (typeof SITE_MODELS)[number]) => `$${model.pricing.input.toFixed(2)} / $${
                        model.pricing.output.toFixed(2)
                      }`,
                    },
                    {
                      label: "Availability",
                      value: (model: (typeof SITE_MODELS)[number]) => model.availabilityLabel,
                    },
                    {
                      label: "Rate Limit",
                      value: (model: (typeof SITE_MODELS)[number]) => model.rateLimit,
                    },
                    {
                      label: "Top Capability",
                      value: (model: (typeof SITE_MODELS)[number]) => model.capabilities[0],
                    },
                    {
                      label: "Ideal Use Case",
                      value: (model: (typeof SITE_MODELS)[number]) => model.useCases[0],
                    },
                  ].map((row) => (
                    <tr key={row.label} className="border-b border-white/5">
                      <td className="px-4 py-3 font-semibold text-white">{row.label}</td>
                      {selected.map((modelId) => {
                        const model = SITE_MODELS.find((item) => item.id === modelId)!;
                        return (
                          <td key={model.id} className="px-4 py-3 text-white/70">
                            {row.value(model)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
    </>
  );
}
