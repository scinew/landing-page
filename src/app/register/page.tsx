"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, ShieldCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import Link from "next/link";

interface FormState {
  email: string;
  password: string;
  accountType: string;
}

const ACCOUNT_TYPES = [
  { value: "builder", label: "Builder" },
  { value: "enterprise", label: "Enterprise" },
  { value: "research", label: "Research" },
];

const initialState: FormState = {
  email: "",
  password: "",
  accountType: "",
};

export default function RegisterPage() {
  const [values, setValues] = useState<FormState>(initialState);
  const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
    email: false,
    password: false,
    accountType: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const errors = useMemo(() => {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!values.email) {
      nextErrors.email = "Email is required";
    } else if (!emailRegex.test(values.email)) {
      nextErrors.email = "Please enter a valid email address";
    }

    if (!values.password) {
      nextErrors.password = "Password is required";
    } else {
      if (values.password.length < 8) {
        nextErrors.password = "Use at least 8 characters";
      } else if (!/[A-Z]/.test(values.password) || !/[0-9]/.test(values.password)) {
        nextErrors.password = "Include an uppercase letter and a number";
      }
    }

    if (!values.accountType) {
      nextErrors.accountType = "Select an account type";
    }

    return nextErrors;
  }, [values]);

  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ email: true, password: true, accountType: true });

    if (!isValid) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setHasSubmitted(true);
      setValues(initialState);
      setTouched({ email: false, password: false, accountType: false });
    }, 1200);
  };

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value } = event.target;
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: keyof FormState) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <>
      <SiteHeader />
      <div className="site-shell relative min-h-screen bg-black text-white overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-10 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center"
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs uppercase tracking-[0.35em] text-white/60">
              <ShieldCheck className="h-4 w-4" />
              Secure Onboarding
            </div>
            <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl">
              Register for Oculus AI Access
            </h1>
            <p className="mt-4 max-w-xl text-balance text-sm text-white/60 sm:text-base">
              Create your account to unlock enterprise-grade computer vision models with precision analytics, real-time streaming, and seamless deployment across your infrastructure.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full"
          >
            <Card className="border-white/10 bg-white/5 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <UserPlus className="h-6 w-6 text-white/70" />
                  Create your account
                </CardTitle>
                <CardDescription className="text-white/50">
                  Enter your details to receive sandbox credentials and onboarding resources.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                  <motion.div layout className="space-y-2">
                    <Label htmlFor="email">Work Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={values.email}
                      onChange={handleChange("email")}
                      onBlur={handleBlur("email")}
                      aria-invalid={touched.email && Boolean(errors.email)}
                      className="bg-black/40 text-white border-white/10"
                    />
                    {touched.email && errors.email ? (
                      <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-400"
                      >
                        {errors.email}
                      </motion.p>
                    ) : null}
                  </motion.div>

                  <motion.div layout className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a secure password"
                      value={values.password}
                      onChange={handleChange("password")}
                      onBlur={handleBlur("password")}
                      aria-invalid={touched.password && Boolean(errors.password)}
                      className="bg-black/40 text-white border-white/10"
                    />
                    {touched.password && errors.password ? (
                      <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-400"
                      >
                        {errors.password}
                      </motion.p>
                    ) : null}
                  </motion.div>

                  <motion.div layout className="space-y-2">
                    <Label htmlFor="accountType">Account Type</Label>
                    <div className="relative">
                      <select
                        id="accountType"
                        value={values.accountType}
                        onChange={handleChange("accountType")}
                        onBlur={handleBlur("accountType")}
                        className="flex h-9 w-full appearance-none rounded-md border border-white/10 bg-black/40 px-3 py-1 text-sm text-white shadow-xs transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
                        aria-invalid={touched.accountType && Boolean(errors.accountType)}
                      >
                        <option value="" className="bg-black text-white">
                          Select an option
                        </option>
                        {ACCOUNT_TYPES.map((type) => (
                          <option key={type.value} value={type.value} className="bg-black text-white">
                            {type.label}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white/40">▾</span>
                    </div>
                    {touched.accountType && errors.accountType ? (
                      <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-400"
                      >
                        {errors.accountType}
                      </motion.p>
                    ) : null}
                  </motion.div>

                  <Button type="submit" variant="inverted" className="group flex w-full items-center justify-center gap-2" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>

                  {hasSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200"
                    >
                      <strong className="font-semibold">Registration received.</strong> We&apos;ll send activation instructions to your inbox within a few minutes.
                    </motion.div>
                  ) : null}
                </form>

                <div className="mt-8 space-y-2 text-center text-sm text-white/40">
                  <p>
                    Already have access? <Link href="/chat" className="text-white underline decoration-white/30 underline-offset-4 hover:text-white/80">Launch the console</Link>
                  </p>
                  <p>
                    By continuing you agree to our <Link href="#" className="underline decoration-white/20 underline-offset-4 hover:text-white/60">Terms of Service</Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}
