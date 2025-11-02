import "@testing-library/jest-dom/vitest";
import { afterEach, beforeAll, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import React from "react";

declare global {
  interface Window {
    matchMedia: (query: string) => MediaQueryList;
  }
}

beforeAll(() => {
  let uuidCounter = 0;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!globalThis.crypto) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.crypto = {};
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis.crypto as any).randomUUID = () => {
    uuidCounter += 1;
    return `uuid-${uuidCounter}`;
  };

  if (!globalThis.requestAnimationFrame) {
    globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 0);
    globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
  }

  if (!window.matchMedia) {
    window.matchMedia = () => ({
      matches: false,
      media: "",
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
  }

  if (!window.scrollTo) {
    window.scrollTo = () => {};
  }

  if (!Element.prototype.scrollTo) {
    Element.prototype.scrollTo = () => {};
  }

  vi.mock("next/link", () => ({
    default: ({ children, href, ...props }: React.ComponentProps<"a">) => (
      <a href={typeof href === "string" ? href : "#"} {...props}>
        {children}
      </a>
    ),
  }));

  vi.mock("framer-motion", () => {
    const MockComponent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
      function MockMotionComponent(props, ref) {
        return <div ref={ref} {...props} />;
      },
    );

    return {
      AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
      motion: new Proxy(
        {},
        {
          get: () => MockComponent,
        },
      ),
    };
  });
});

afterEach(() => {
  cleanup();
});
