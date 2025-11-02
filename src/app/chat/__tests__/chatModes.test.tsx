import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatPage from "../page";

const configureMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn().mockReturnValue(false),
    })),
  });
};

const setViewportWidth = (width: number) => {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: width,
  });
};

const openSidebar = async (user: ReturnType<typeof userEvent.setup>) => {
  const sidebarToggle = await screen.findByRole("button", { name: /open sidebar/i });
  await user.click(sidebarToggle);
};

beforeEach(() => {
  configureMatchMedia(false);
  setViewportWidth(1280);
});

describe("ChatPage regressions", () => {
  it("retains secret model unlock after switching modes", async () => {
    const user = userEvent.setup();
    render(<ChatPage />);

    await openSidebar(user);

    const unlockButton = await screen.findByRole("button", { name: /tap thrice to unlock/i });
    await user.click(unlockButton);
    await user.click(unlockButton);
    await user.click(unlockButton);

    await screen.findByText(/secret model unlocked/i);

    const searchButton = screen.getByRole("button", { name: /search/i, pressed: false });
    await user.click(searchButton);

    const conversationButton = screen.getByRole("button", { name: /conversation/i, pressed: false });
    await user.click(conversationButton);

    expect(screen.getByText(/secret model unlocked/i)).toBeInTheDocument();
  });

  it("closes the sidebar when viewing a conversation from search results on mobile widths", async () => {
    configureMatchMedia(false);
    setViewportWidth(375);
    const user = userEvent.setup();
    render(<ChatPage />);

    await openSidebar(user);

    const searchModeButton = screen.getByRole("button", { name: /search/i });
    await user.click(searchModeButton);

    const searchInput = screen.getByPlaceholderText(/search across all conversations/i);
    await user.type(searchInput, "speaking");

    const runSearchButton = screen.getByRole("button", { name: /run search/i });
    await user.click(runSearchButton);

    const viewConversationButton = await screen.findByRole("button", { name: /view conversation/i });
    await user.click(viewConversationButton);

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /tap thrice to unlock/i })).not.toBeInTheDocument();
    });
  });

  it("defaults to conversation mode", () => {
    render(<ChatPage />);
    const conversationButton = screen.getByRole("button", { name: /conversation/i });
    expect(conversationButton.getAttribute("aria-pressed")).toBe("true");
  });
});
