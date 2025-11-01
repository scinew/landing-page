"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, CreditCard, Lock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import Link from "next/link";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "$99",
    period: "/month",
    description: "Perfect for individual developers and small teams",
    features: [
      "50k image credits",
      "oculus-1-0125 access",
      "Batch + realtime APIs",
      "Community support",
      "Basic analytics",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: "$299",
    period: "/month",
    description: "Scale your applications with enhanced resources",
    features: [
      "500k image credits",
      "Both models access",
      "Low-latency streaming",
      "Dedicated support",
      "Advanced analytics",
      "Custom integrations",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions for large-scale deployments",
    features: [
      "Unlimited usage",
      "Private fine-tuning",
      "On-prem deployment",
      "24/7 white-glove support",
      "SLA guarantees",
      "Priority feature access",
    ],
  },
];

export default function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState("growth");
  const [billingInfo, setBillingInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    name: "",
  });

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillingInfo((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const selectedPlanData = PLANS.find((p) => p.id === selectedPlan);

  return (
    <>
      <SiteHeader />
      <div className="relative min-h-screen bg-black text-white overflow-hidden pt-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 -left-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <Badge variant="outline" className="mb-6 border-white/30 bg-transparent text-white">
              <Shield className="mr-2 h-3 w-3" />
              Secure Checkout
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Choose Your Plan
            </h1>
            <p className="mt-4 text-lg text-white/60">
              Select a plan that fits your needs. All plans include 14-day free trial.
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <Card className="mb-8 border-white/10 bg-white/5 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-white">Select Plan</CardTitle>
                  <CardDescription className="text-white/60">
                    Choose the plan that best fits your usage requirements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {PLANS.map((plan) => (
                    <motion.button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative w-full rounded-lg border p-6 text-left transition-all ${
                        selectedPlan === plan.id
                          ? "border-white/40 bg-white/10"
                          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {plan.popular && (
                        <Badge className="absolute -top-3 left-6 bg-white text-black">Most Popular</Badge>
                      )}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                          <p className="mt-1 text-sm text-white/60">{plan.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-baseline">
                            <span className="text-3xl font-bold text-white">{plan.price}</span>
                            {plan.period && <span className="ml-1 text-white/60">{plan.period}</span>}
                          </div>
                        </div>
                      </div>
                      <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start text-white/80">
                            <Check className="mr-2 h-4 w-4 flex-shrink-0 text-white/60" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </motion.button>
                  ))}
                </CardContent>
              </Card>

              {selectedPlan !== "enterprise" && (
                <Card className="border-white/10 bg-white/5 backdrop-blur-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-white">
                      <CreditCard className="h-6 w-6 text-white/70" />
                      Payment Details
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      Your information is encrypted and secured
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={billingInfo.cardNumber}
                          onChange={handleInputChange("cardNumber")}
                          className="bg-black/40 text-white border-white/10"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={billingInfo.expiry}
                            onChange={handleInputChange("expiry")}
                            className="bg-black/40 text-white border-white/10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            placeholder="123"
                            value={billingInfo.cvc}
                            onChange={handleInputChange("cvc")}
                            className="bg-black/40 text-white border-white/10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="name">Cardholder Name</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={billingInfo.name}
                          onChange={handleInputChange("name")}
                          className="bg-black/40 text-white border-white/10"
                        />
                      </div>

                      <Button className="w-full bg-white text-black hover:bg-gray-200">
                        <Lock className="mr-2 h-4 w-4" />
                        Complete Purchase
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {selectedPlan === "enterprise" && (
                <Card className="border-white/10 bg-white/5 backdrop-blur-lg">
                  <CardContent className="py-12 text-center">
                    <h3 className="mb-2 text-2xl font-semibold text-white">Contact Sales</h3>
                    <p className="mb-6 text-white/60">
                      Our enterprise team will work with you to create a custom solution tailored to your needs.
                    </p>
                    <Button className="bg-white text-black hover:bg-gray-200">Schedule Demo</Button>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card className="sticky top-24 border-white/10 bg-white/5 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-white">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedPlanData && (
                    <>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Plan</span>
                          <span className="font-medium text-white">{selectedPlanData.name}</span>
                        </div>
                        {selectedPlanData.price !== "Custom" && (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-white/60">Billing Cycle</span>
                              <span className="text-white">Monthly</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white/60">Trial Period</span>
                              <span className="text-white">14 days free</span>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="border-t border-white/10 pt-4">
                        {selectedPlanData.price !== "Custom" ? (
                          <div className="flex justify-between">
                            <span className="text-lg font-semibold text-white">Total</span>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-white">{selectedPlanData.price}</div>
                              <div className="text-xs text-white/60">{selectedPlanData.period}</div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="text-xl font-semibold text-white">Custom Pricing</div>
                            <p className="mt-1 text-xs text-white/60">Based on your requirements</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                          Included Features
                        </p>
                        <ul className="space-y-2">
                          {selectedPlanData.features.map((feature) => (
                            <li key={feature} className="flex items-start text-sm text-white/80">
                              <Check className="mr-2 h-4 w-4 flex-shrink-0 text-white/60" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2 text-center text-xs text-white/40">
                        <p>
                          By completing your purchase you agree to our{" "}
                          <Link href="#" className="underline hover:text-white/60">
                            Terms of Service
                          </Link>
                        </p>
                        <p className="flex items-center justify-center gap-1">
                          <Lock className="h-3 w-3" />
                          Payments secured by industry-standard encryption
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
