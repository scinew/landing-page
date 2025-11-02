"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Building2,
  Check,
  CheckCircle2,
  CreditCard,
  Globe,
  Lock,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
} from "lucide-react";
import Link from "next/link";

import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "SG", name: "Singapore" },
];

interface CheckoutFormData {
  selectedPlan: string;
  email: string;
  fullName: string;
  company: string;
  phone: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  cardholderName: string;
}

type SubmitStatus = "idle" | "success" | "error";

type FormErrors = Partial<Record<keyof CheckoutFormData, string>>;

const INITIAL_FORM_DATA: CheckoutFormData = {
  selectedPlan: "growth",
  email: "",
  fullName: "",
  company: "",
  phone: "",
  country: "US",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
  cardholderName: "",
};

export default function CheckoutPage() {
  const [formData, setFormData] = useState<CheckoutFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

  const isEnterprise = formData.selectedPlan === "enterprise";
  const selectedPlanData = PLANS.find((plan) => plan.id === formData.selectedPlan);

  const handleInputChange = (field: keyof CheckoutFormData) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));

      if (submitStatus !== "idle") {
        setSubmitStatus("idle");
      }

      if (errors[field]) {
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated[field];
          return updated;
        });
      }
    };

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!formData.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!formData.country) {
      nextErrors.country = "Country is required.";
    }

    if (!formData.addressLine1.trim()) {
      nextErrors.addressLine1 = "Address line 1 is required.";
    }

    if (!formData.city.trim()) {
      nextErrors.city = "City is required.";
    }

    if (!formData.state.trim()) {
      nextErrors.state = "State or province is required.";
    }

    if (!formData.postalCode.trim()) {
      nextErrors.postalCode = "Postal code is required.";
    }

    if (!isEnterprise) {
      const strippedCard = formData.cardNumber.replace(/\s+/g, "");
      if (!strippedCard || strippedCard.length < 13) {
        nextErrors.cardNumber = "Enter a valid card number.";
      }

      if (!formData.expiry || !/^\d{2}\/\d{2}$/.test(formData.expiry)) {
        nextErrors.expiry = "Use MM/YY format.";
      }

      if (!formData.cvc || formData.cvc.length < 3) {
        nextErrors.cvc = "Enter a valid CVC.";
      }

      if (!formData.cardholderName.trim()) {
        nextErrors.cardholderName = "Cardholder name is required.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1400));
      setSubmitStatus("success");
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const successMessage = isEnterprise
    ? "Request submitted! Our sales team will reach out within one business day."
    : "Payment successful! Redirecting you to your dashboard...";

  const errorMessage = isEnterprise
    ? "We couldn't send your request. Please try again."
    : "Payment failed. Please check the details and try again.";

  return (
    <>
      <SiteHeader />
      <div className="site-shell relative min-h-screen bg-black text-white overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 -left-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            <Badge variant="outline" className="mb-4 border-white/30 bg-transparent text-white">
              <Shield className="mr-2 h-3 w-3" />
              Secure Checkout
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Complete Your Purchase
            </h1>
            <p className="mt-3 text-base text-white/60">
              All plans include a 14-day free trial. Upgrade, downgrade, or cancel anytime.
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="border-white/10 bg-white/5 backdrop-blur-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Building2 className="h-5 w-5 text-white/70" />
                      Select your plan
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      Choose the plan that best fits your usage requirements.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {PLANS.map((plan) => {
                      const isSelected = formData.selectedPlan === plan.id;

                      return (
                        <motion.button
                          key={plan.id}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, selectedPlan: plan.id }));
                            setSubmitStatus("idle");
                          }}
                          className={`relative w-full rounded-lg border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:p-6 ${
                            isSelected
                              ? "border-white/50 bg-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                              : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                          }`}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          {plan.popular && (
                            <Badge className="absolute -top-2 left-4 bg-white text-black text-xs">Most Popular</Badge>
                          )}
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-3">
                              <span
                                className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border transition ${
                                  isSelected ? "border-white bg-white" : "border-white/40"
                                }`}
                                aria-hidden="true"
                              >
                                <span
                                  className={`h-2 w-2 rounded-full ${
                                    isSelected ? "bg-black" : "bg-transparent"
                                  }`}
                                />
                              </span>
                              <div>
                                <h3 className="text-lg font-semibold text-white sm:text-xl">{plan.name}</h3>
                                <p className="mt-1 text-xs text-white/60 sm:text-sm">{plan.description}</p>
                              </div>
                            </div>
                            <div className="text-left sm:text-right">
                              <span className="text-2xl font-bold text-white sm:text-3xl">{plan.price}</span>
                              {plan.period && <span className="ml-1 text-sm text-white/60">{plan.period}</span>}
                            </div>
                          </div>
                          <ul className="mt-3 grid grid-cols-1 gap-2 text-xs text-white/80 sm:grid-cols-2 sm:text-sm">
                            {plan.features.map((feature) => (
                              <li key={feature} className="flex items-start gap-2">
                                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-white/60" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.button>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 backdrop-blur-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <User className="h-5 w-5 text-white/70" />
                      Account & contact information
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      We’ll use this information to create your account and stay in touch.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-white/50" />
                          Email address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@company.com"
                          value={formData.email}
                          onChange={handleInputChange("email")}
                          className={`bg-black/40 text-white border-white/10 placeholder:text-white/40 ${
                            errors.email ? "border-red-500" : ""
                          }`}
                          aria-invalid={Boolean(errors.email)}
                        />
                        {errors.email && (
                          <p className="flex items-center gap-1 text-xs text-red-400">
                            <AlertCircle className="h-3 w-3" />
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="fullName">Full name *</Label>
                        <Input
                          id="fullName"
                          placeholder="Jane Cooper"
                          value={formData.fullName}
                          onChange={handleInputChange("fullName")}
                          className={`bg-black/40 text-white border-white/10 placeholder:text-white/40 ${
                            errors.fullName ? "border-red-500" : ""
                          }`}
                          aria-invalid={Boolean(errors.fullName)}
                        />
                        {errors.fullName && (
                          <p className="flex items-center gap-1 text-xs text-red-400">
                            <AlertCircle className="h-3 w-3" />
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">Company (optional)</Label>
                        <Input
                          id="company"
                          placeholder="Acme Inc."
                          value={formData.company}
                          onChange={handleInputChange("company")}
                          className="bg-black/40 text-white border-white/10 placeholder:text-white/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-white/50" />
                          Phone (optional)
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone}
                          onChange={handleInputChange("phone")}
                          className="bg-black/40 text-white border-white/10 placeholder:text-white/40"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 backdrop-blur-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <MapPin className="h-5 w-5 text-white/70" />
                      Billing address
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      Enter the address associated with your billing method.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="country" className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-white/50" />
                        Country *
                      </Label>
                      <select
                        id="country"
                        value={formData.country}
                        onChange={handleInputChange("country")}
                        className={`flex h-9 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 ${
                          errors.country ? "border-red-500" : ""
                        }`}
                        aria-invalid={Boolean(errors.country)}
                      >
                        {COUNTRIES.map((country) => (
                          <option key={country.code} value={country.code} className="bg-black text-white">
                            {country.name}
                          </option>
                        ))}
                      </select>
                      {errors.country && (
                        <p className="flex items-center gap-1 text-xs text-red-400">
                          <AlertCircle className="h-3 w-3" />
                          {errors.country}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="addressLine1">Address line 1 *</Label>
                      <Input
                        id="addressLine1"
                        placeholder="123 Market Street"
                        value={formData.addressLine1}
                        onChange={handleInputChange("addressLine1")}
                        className={`bg-black/40 text-white border-white/10 placeholder:text-white/40 ${
                          errors.addressLine1 ? "border-red-500" : ""
                        }`}
                        aria-invalid={Boolean(errors.addressLine1)}
                      />
                      {errors.addressLine1 && (
                        <p className="flex items-center gap-1 text-xs text-red-400">
                          <AlertCircle className="h-3 w-3" />
                          {errors.addressLine1}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="addressLine2">Address line 2 (optional)</Label>
                      <Input
                        id="addressLine2"
                        placeholder="Suite 400"
                        value={formData.addressLine2}
                        onChange={handleInputChange("addressLine2")}
                        className="bg-black/40 text-white border-white/10 placeholder:text-white/40"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          placeholder="San Francisco"
                          value={formData.city}
                          onChange={handleInputChange("city")}
                          className={`bg-black/40 text-white border-white/10 placeholder:text-white/40 ${
                            errors.city ? "border-red-500" : ""
                          }`}
                          aria-invalid={Boolean(errors.city)}
                        />
                        {errors.city && (
                          <p className="flex items-center gap-1 text-xs text-red-400">
                            <AlertCircle className="h-3 w-3" />
                            {errors.city}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State / Province *</Label>
                        <Input
                          id="state"
                          placeholder="CA"
                          value={formData.state}
                          onChange={handleInputChange("state")}
                          className={`bg-black/40 text-white border-white/10 placeholder:text-white/40 ${
                            errors.state ? "border-red-500" : ""
                          }`}
                          aria-invalid={Boolean(errors.state)}
                        />
                        {errors.state && (
                          <p className="flex items-center gap-1 text-xs text-red-400">
                            <AlertCircle className="h-3 w-3" />
                            {errors.state}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal code *</Label>
                        <Input
                          id="postalCode"
                          placeholder="94102"
                          value={formData.postalCode}
                          onChange={handleInputChange("postalCode")}
                          className={`bg-black/40 text-white border-white/10 placeholder:text-white/40 ${
                            errors.postalCode ? "border-red-500" : ""
                          }`}
                          aria-invalid={Boolean(errors.postalCode)}
                        />
                        {errors.postalCode && (
                          <p className="flex items-center gap-1 text-xs text-red-400">
                            <AlertCircle className="h-3 w-3" />
                            {errors.postalCode}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {!isEnterprise ? (
                  <Card className="border-white/10 bg-white/5 backdrop-blur-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <CreditCard className="h-5 w-5 text-white/70" />
                        Payment details
                      </CardTitle>
                      <CardDescription className="text-white/60">
                        Your information is encrypted using industry-standard protocols.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card number *</Label>
                        <Input
                          id="cardNumber"
                          inputMode="numeric"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={handleInputChange("cardNumber")}
                          className={`bg-black/40 text-white border-white/10 placeholder:text-white/40 ${
                            errors.cardNumber ? "border-red-500" : ""
                          }`}
                          aria-invalid={Boolean(errors.cardNumber)}
                        />
                        {errors.cardNumber && (
                          <p className="flex items-center gap-1 text-xs text-red-400">
                            <AlertCircle className="h-3 w-3" />
                            {errors.cardNumber}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry date *</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={formData.expiry}
                            onChange={handleInputChange("expiry")}
                            className={`bg-black/40 text-white border-white/10 placeholder:text-white/40 ${
                              errors.expiry ? "border-red-500" : ""
                            }`}
                            aria-invalid={Boolean(errors.expiry)}
                          />
                          {errors.expiry && (
                            <p className="flex items-center gap-1 text-xs text-red-400">
                              <AlertCircle className="h-3 w-3" />
                              {errors.expiry}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC *</Label>
                          <Input
                            id="cvc"
                            inputMode="numeric"
                            placeholder="123"
                            value={formData.cvc}
                            onChange={handleInputChange("cvc")}
                            className={`bg-black/40 text-white border-white/10 placeholder:text-white/40 ${
                              errors.cvc ? "border-red-500" : ""
                            }`}
                            aria-invalid={Boolean(errors.cvc)}
                          />
                          {errors.cvc && (
                            <p className="flex items-center gap-1 text-xs text-red-400">
                              <AlertCircle className="h-3 w-3" />
                              {errors.cvc}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardholderName">Cardholder name *</Label>
                        <Input
                          id="cardholderName"
                          placeholder="Name on card"
                          value={formData.cardholderName}
                          onChange={handleInputChange("cardholderName")}
                          className={`bg-black/40 text-white border-white/10 placeholder:text-white/40 ${
                            errors.cardholderName ? "border-red-500" : ""
                          }`}
                          aria-invalid={Boolean(errors.cardholderName)}
                        />
                        {errors.cardholderName && (
                          <p className="flex items-center gap-1 text-xs text-red-400">
                            <AlertCircle className="h-3 w-3" />
                            {errors.cardholderName}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-white/10 bg-white/5 backdrop-blur-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Building2 className="h-5 w-5 text-white/70" />
                        Enterprise onboarding
                      </CardTitle>
                      <CardDescription className="text-white/60">
                        Tell us a bit about your team and we’ll tailor a plan for you.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-lg border border-white/10 bg-white/5 p-5 text-left">
                        <p className="text-sm text-white/70">
                          Unlock unlimited seats, dedicated success engineering, SSO, compliant deployment options,
                          and custom SLAs. Submit the form and our sales team will reach out shortly.
                        </p>
                      </div>
                      <div className="rounded-lg border border-dashed border-white/20 bg-white/5 p-5 text-left">
                        <p className="text-sm text-white/70">
                          Prefer to talk now? Email us directly and one of our specialists will respond within hours.
                        </p>
                        <div className="mt-3">
                          <Button asChild variant="inverted">
                            <a href="mailto:sales@example.com">Contact sales</a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4">
                  <Button type="submit" size="lg" disabled={isSubmitting} variant="inverted" className="flex w-full items-center justify-center gap-2">
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {isEnterprise ? <Mail className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                        {isEnterprise ? "Submit request" : "Complete purchase"}
                      </span>
                    )}
                  </Button>

                  {submitStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      role="status"
                      aria-live="polite"
                      className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4" />
                      <span>{successMessage}</span>
                    </motion.div>
                  )}

                  {submitStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      role="alert"
                      className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4" />
                      <span>{errorMessage}</span>
                    </motion.div>
                  )}

                  <div className="grid gap-3 rounded-lg border border-white/10 bg-white/5 p-4 text-xs text-white/60 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-white/60" />
                      PCI-DSS compliant payments
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-white/60" />
                      256-bit TLS encryption
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-white/60" />
                      Cancel anytime during trial
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-white/60" />
                      24/7 priority support
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card className="border-white/10 bg-white/5 backdrop-blur-lg lg:sticky lg:top-24">
                <CardHeader>
                  <CardTitle className="text-white">Order summary</CardTitle>
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
                              <span className="text-white/60">Billing cycle</span>
                              <span className="text-white">Monthly</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white/60">Trial period</span>
                              <span className="text-white">14 days free</span>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="border-t border-white/10 pt-4">
                        {selectedPlanData.price !== "Custom" ? (
                          <div className="flex items-end justify-between">
                            <span className="text-lg font-semibold text-white">Total due today</span>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-white">{selectedPlanData.price}</div>
                              <div className="text-xs text-white/60">{selectedPlanData.period}</div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="text-xl font-semibold text-white">Custom pricing</div>
                            <p className="mt-1 text-xs text-white/60">Based on your requirements</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Included features</p>
                        <ul className="space-y-2">
                          {selectedPlanData.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2 text-sm text-white/80">
                              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-white/60" />
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
                          {" and "}
                          <Link href="#" className="underline hover:text-white/60">
                            Privacy Policy
                          </Link>
                        </p>
                        <p>Invoices and receipts will be sent to {formData.email || "your email"}.</p>
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
