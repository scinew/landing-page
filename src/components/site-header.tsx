"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Overview" },
  { href: "/models", label: "Models" },
  { href: "/register", label: "Register" },
  { href: "/checkout", label: "Plans" },
  { href: "/docs", label: "Docs" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    const body = document.body;

    if (mobileMenuOpen) {
      scrollPositionRef.current = window.scrollY;
      body.classList.add("scroll-lock");
      body.style.top = `-${scrollPositionRef.current}px`;
      body.style.width = "100%";
      closeButtonRef.current?.focus();
    } else if (body.classList.contains("scroll-lock")) {
      body.classList.remove("scroll-lock");
      body.style.top = "";
      body.style.width = "";
      window.scrollTo(0, scrollPositionRef.current);
    }

    return () => {
      body.classList.remove("scroll-lock");
      body.style.top = "";
      body.style.width = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }

      if (e.key === "Tab" && mobileMenuOpen && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const previousPathnameRef = useRef(pathname);
  useEffect(() => {
    if (previousPathnameRef.current === pathname) {
      return undefined;
    }

    previousPathnameRef.current = pathname;

    if (!mobileMenuOpen) {
      return undefined;
    }

    const frame = requestAnimationFrame(() => setMobileMenuOpen(false));

    return () => cancelAnimationFrame(frame);
  }, [pathname, mobileMenuOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <Link href="/" className="font-mono text-sm uppercase tracking-[0.3em] text-white/80 hover:text-white transition-colors">
            Oculus AI
          </Link>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative text-sm font-medium text-white/60 transition-colors hover:text-white",
                    isActive && "text-white"
                  )}
                >
                  {item.label}
                  {isActive ? (
                    <motion.span
                      layoutId="active-nav-indicator"
                      className="absolute -bottom-2 left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full bg-white"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden text-xs font-medium text-white/40 lg:block">
              Vision intelligence at scale
            </div>
            <Button asChild variant="outline" size="sm" className="hidden sm:flex">
              <Link href="#pricing">Get Access</Link>
            </Button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden flex items-center justify-center p-2 text-white/80 hover:text-white transition-colors"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              ref={drawerRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-sm bg-black/95 backdrop-blur-xl border-l border-white/10 shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 sm:px-6 sm:py-4">
                  <Link
                    href="/"
                    className="font-mono text-sm uppercase tracking-[0.3em] text-white/80"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Oculus AI
                  </Link>
                  <button
                    ref={closeButtonRef}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center p-2 text-white/80 hover:text-white transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 py-6 sm:px-6" aria-label="Mobile navigation">
                  <ul className="space-y-1">
                    {NAV_ITEMS.map((item) => {
                      const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className={cn(
                              "block px-4 py-3 text-base font-medium rounded-lg transition-colors",
                              isActive
                                ? "bg-white/10 text-white"
                                : "text-white/60 hover:text-white hover:bg-white/5"
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="px-4 text-xs font-medium text-white/40 mb-4">
                      Vision intelligence at scale
                    </p>
                    <Button asChild variant="inverted" className="w-full">
                      <Link href="#pricing" onClick={() => setMobileMenuOpen(false)}>
                        Get Access
                      </Link>
                    </Button>
                  </div>
                </nav>

                <div className="px-4 py-4 border-t border-white/10 text-xs text-white/40 sm:px-6">
                  © 2025 Oculus AI. All rights reserved.
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
