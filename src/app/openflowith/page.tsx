"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, EyeOff, Infinity, Lock, Sparkles } from "lucide-react";
import { SECRET_MODEL } from "@/lib/models";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MODEL = SECRET_MODEL;

const HIGHLIGHTS = [
  {
    label: "Context Window",
    value: MODEL.contextWindowLabel,
    description: "Hyper-dimensional memory spanning the entire operational history of your organization.",
  },
  {
    label: "Precision",
    value: MODEL.performance.accuracy,
    description: "A benchmark-defying accuracy envelope engineered for paradox resolution and reflective reasoning.",
  },
  {
    label: "Availability",
    value: MODEL.availabilityLabel,
    description: "Invitation-only quantum infrastructure with bespoke, sovereign deployment guarantees.",
  },
];

export default function OpenflowithPage() {
  return (
    <>
      <SiteHeader />
      <div className="site-shell relative min-h-screen overflow-hidden bg-black text-white">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_55%)]" />
          <div className="absolute bottom-0 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-white/10 blur-[180px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto flex max-w-6xl flex-col gap-16 px-4 pb-24 pt-24 sm:px-6 lg:px-8"
        >
          <div className="flex flex-col gap-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <Badge className="bg-white text-black">Classified Access</Badge>
              <Badge variant="outline" className="border-white/20 bg-white/10 text-white/80">
                {MODEL.badge}
              </Badge>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Openflowith Vault
            </h1>
            <p className="mx-auto max-w-2xl text-balance text-white/70">
              Beneath the Oculus portfolio lies an invitation-only intelligence artifact. Openflowith operates beyond
              conventional context limits, orchestrating temporal reasoning threads with a <span className="font-semibold text-white">{MODEL.contextWindowLabel}</span> memory lattice and <span className="font-semibold text-white">{MODEL.performance.accuracy}</span> precision envelope.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Button asChild variant="inverted">
                <Link href="/models">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to Portfolio
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/register">
                  <Lock className="mr-2 h-4 w-4" />
                  Request Invitation
                </Link>
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid gap-6 md:grid-cols-3"
          >
            {HIGHLIGHTS.map((item) => (
              <Card key={item.label} className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-sm uppercase tracking-[0.3em] text-white/50">{item.label}</CardTitle>
                  <CardDescription className="text-3xl font-semibold text-white">{item.value}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-white/70">
                  {item.description}
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]"
          >
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-white/50">
                  <Sparkles className="h-4 w-4" />
                  Capabilities
                </div>
                <CardTitle className="text-2xl text-white">
                  Beyond-Classified Competencies
                </CardTitle>
                <CardDescription className="text-white/60">
                  Each capability is attested in a controlled quantum environment. Only select partners receive telemetry.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm text-white/80">
                {MODEL.capabilities.map((capability) => (
                  <div key={capability} className="flex items-start gap-3 rounded-lg border border-white/10 bg-black/30 p-4">
                    <Infinity className="mt-1 h-4 w-4 text-white/40" />
                    <p>{capability}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-white/50">
                  <EyeOff className="h-4 w-4" />
                  Access Controls
                </div>
                <CardTitle className="text-2xl text-white">Invitation Requirements</CardTitle>
                <CardDescription className="text-white/60">
                  Openflowith access is gated by a multi-factor trust score. Expect bespoke onboarding and continuous review.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-white/70">
                <div className="rounded-lg border border-white/10 bg-black/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-white/40">Pricing Envelope</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    ${MODEL.pricing.input.toLocaleString()} / ${MODEL.pricing.output.toLocaleString()} per 1M tokens
                  </p>
                  {MODEL.pricing.note ? (
                    <p className="mt-2 text-xs text-white/60">{MODEL.pricing.note}</p>
                  ) : null}
                </div>
                <div className="space-y-3">
                  {MODEL.useCases.map((useCase) => (
                    <div key={useCase} className="rounded-lg border border-white/10 bg-white/5 p-3 text-white/80">
                      {useCase}
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border border-white/10 bg-black/30 p-4 text-xs text-white/60">
                  <p>Release date: {MODEL.releaseDate} &bull; SLA: {MODEL.availabilitySla}</p>
                  <p className="mt-1">Rate Limit: {MODEL.rateLimit}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl"
          >
            <div className="flex flex-col items-center gap-4">
              <Badge variant="outline" className="border-white/30 bg-white/10 text-white/70">
                Unlock Protocol
              </Badge>
              <h2 className="text-3xl font-semibold text-white">Initiate the Flow</h2>
              <p className="max-w-2xl text-sm text-white/70">
                To activate Openflowith, assemble a cohort of three enterprise stakeholders with clearance, present the
                temporal checksum supplied after invitation, and align infrastructure to Oculus Quantum Edge.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild className="bg-white text-black hover:bg-gray-200">
                  <Link href="/docs/openflowith">View Secret Documentation</Link>
                </Button>
                <Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20" asChild>
                  <Link href="mailto:concierge@oculus.ai?subject=Openflowith%20Access">Signal Concierge</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
