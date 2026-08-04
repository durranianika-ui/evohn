import { describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AgeGate, AGE_GATE_STORAGE_KEY } from "@/components/common/AgeGate";
import { EnquiryDrawer } from "@/components/enquiry/EnquiryDrawer";
import { EnquiryList } from "@/components/enquiry/EnquiryList";
import {
  ENQUIRY_STORAGE_KEY,
  EnquiryProvider,
  buildEnquiryMessage,
} from "@/lib/enquiry";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

const ITEM = {
  slug: "bpc-157",
  name: "BPC-157",
  subtitle: "Recovery / Peptide",
  dosage: "5 mg",
};

function seed(items = [ITEM]) {
  window.localStorage.setItem(ENQUIRY_STORAGE_KEY, JSON.stringify(items));
}

/* ========================================================================== */

describe("age gate", () => {
  it("appears when no acknowledgement is stored", async () => {
    render(<AgeGate />);
    expect(
      await screen.findByRole("dialog", { name: /research use only/i }),
    ).toBeInTheDocument();
  });

  it("states both declarations rather than one vague confirmation", async () => {
    render(<AgeGate />);
    await screen.findByRole("dialog");
    expect(screen.getByText(/at least 18 years of age/i)).toBeInTheDocument();
    expect(
      screen.getByText(/research, laboratory or professional capacity/i),
    ).toBeInTheDocument();
  });

  it("closes and records the acknowledgement on accept", async () => {
    const user = userEvent.setup();
    render(<AgeGate />);
    await screen.findByRole("dialog");

    await user.click(screen.getByRole("button", { name: /i confirm both/i }));

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    const stored = JSON.parse(
      window.localStorage.getItem(AGE_GATE_STORAGE_KEY) ?? "null",
    );
    expect(stored.accepted).toBe(true);
    expect(typeof stored.at).toBe("number");
  });

  it("stays away on a later visit within the window", () => {
    window.localStorage.setItem(
      AGE_GATE_STORAGE_KEY,
      JSON.stringify({ accepted: true, at: Date.now() }),
    );
    render(<AgeGate />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("returns once the acknowledgement has aged out", async () => {
    const thirtyOneDays = 31 * 24 * 60 * 60 * 1000;
    window.localStorage.setItem(
      AGE_GATE_STORAGE_KEY,
      JSON.stringify({ accepted: true, at: Date.now() - thirtyOneDays }),
    );
    render(<AgeGate />);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("ignores a malformed or forged record rather than trusting it", async () => {
    for (const forged of ["not json", "{}", '{"accepted":"yes"}', "[]"]) {
      window.localStorage.setItem(AGE_GATE_STORAGE_KEY, forged);
      const { unmount } = render(<AgeGate />);
      expect(await screen.findByRole("dialog")).toBeInTheDocument();
      unmount();
    }
  });

  it("offers a real decline path rather than looping back", async () => {
    const user = userEvent.setup();
    render(<AgeGate />);
    await screen.findByRole("dialog");

    await user.click(screen.getByRole("button", { name: /i do not confirm/i }));
    expect(
      screen.getByText(/this catalogue is not for you/i),
    ).toBeInTheDocument();
    // Declining must not have recorded an acknowledgement.
    expect(window.localStorage.getItem(AGE_GATE_STORAGE_KEY)).toBeNull();
  });

  it("lets a declined visitor return to the notice", async () => {
    const user = userEvent.setup();
    render(<AgeGate />);
    await screen.findByRole("dialog");

    await user.click(screen.getByRole("button", { name: /i do not confirm/i }));
    await user.click(screen.getByRole("button", { name: /back to the notice/i }));
    expect(
      screen.getByRole("heading", { name: /research use only/i }),
    ).toBeInTheDocument();
  });

  it("is a modal dialog with an accessible name and description", async () => {
    render(<AgeGate />);
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "entry-title");
    expect(dialog).toHaveAttribute("aria-describedby", "entry-body");
  });

  it("moves focus to accept, so the keyboard lands somewhere useful", async () => {
    render(<AgeGate />);
    const accept = await screen.findByRole("button", {
      name: /i confirm both/i,
    });
    await waitFor(() => expect(accept).toHaveFocus());
  });

  it("cannot be dismissed with Escape — the question is the point", async () => {
    const user = userEvent.setup();
    render(<AgeGate />);
    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("links to the positions it relies on", async () => {
    render(<AgeGate />);
    await screen.findByRole("dialog");
    expect(
      screen.getByRole("link", { name: /age-verification position/i }),
    ).toHaveAttribute("href", "/age-verification");
    expect(
      screen.getByRole("link", { name: /research-use condition/i }),
    ).toHaveAttribute("href", "/research-use-only");
    expect(screen.getByRole("link", { name: /^terms$/i })).toHaveAttribute(
      "href",
      "/terms",
    );
  });
});

/* ========================================================================== */

describe("enquiry message", () => {
  it("falls back to a general enquiry for an empty list", () => {
    expect(buildEnquiryMessage([])).toMatch(/more information about the EVOHN/i);
  });

  it("numbers a single compound and uses the singular", () => {
    const message = buildEnquiryMessage([ITEM]);
    expect(message).toContain("the following compound:");
    expect(message).toContain("1. BPC-157");
  });

  it("numbers several compounds and counts them", () => {
    const message = buildEnquiryMessage([
      ITEM,
      { ...ITEM, slug: "tb-500", name: "TB-500" },
    ]);
    expect(message).toContain("the following 2 compounds:");
    expect(message).toContain("1. BPC-157");
    expect(message).toContain("2. TB-500");
  });
});

describe("enquiry drawer", () => {
  const open = () =>
    render(
      <EnquiryProvider>
        <EnquiryDrawer open onClose={vi.fn()} />
      </EnquiryProvider>,
    );

  it("explains itself when empty rather than showing a bare zero", () => {
    open();
    expect(screen.getByText(/nothing selected yet/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /browse the catalogue/i }),
    ).toHaveAttribute("href", "/catalogue");
  });

  it("lists a persisted selection", async () => {
    seed();
    open();
    const drawer = screen.getByRole("dialog", { name: /enquiry list/i });
    expect(
      await within(drawer).findByRole("link", { name: "BPC-157" }),
    ).toHaveAttribute("href", "/products/bpc-157");
  });

  it("removes an item and updates the count", async () => {
    const user = userEvent.setup();
    seed([ITEM, { ...ITEM, slug: "tb-500", name: "TB-500" }]);
    open();

    expect(await screen.findByText("2 compounds")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /remove BPC-157/i }));
    expect(await screen.findByText("1 compound")).toBeInTheDocument();
  });

  it("clears the whole list", async () => {
    const user = userEvent.setup();
    seed();
    open();

    await screen.findByRole("link", { name: "BPC-157" });
    await user.click(screen.getByRole("button", { name: /^clear$/i }));
    expect(screen.getByText(/nothing selected yet/i)).toBeInTheDocument();
  });

  it("states plainly that nothing is being ordered", () => {
    open();
    expect(
      screen.getByText(/no price is shown and nothing is ordered here/i),
    ).toBeInTheDocument();
  });

  it("persists a change back to storage", async () => {
    const user = userEvent.setup();
    seed();
    open();

    await screen.findByRole("link", { name: "BPC-157" });
    await user.click(screen.getByRole("button", { name: /remove BPC-157/i }));
    await waitFor(() =>
      expect(
        JSON.parse(window.localStorage.getItem(ENQUIRY_STORAGE_KEY) ?? "[]"),
      ).toEqual([]),
    );
  });
});

describe("enquiry page", () => {
  const openPage = () =>
    render(
      <EnquiryProvider>
        <EnquiryList />
      </EnquiryProvider>,
    );

  it("shows the message that will actually be sent, before it is sent", async () => {
    seed();
    openPage();
    expect(await screen.findByText(/1\. BPC-157/)).toBeInTheDocument();
  });

  it("offers a way out when the list is empty", async () => {
    openPage();
    expect(
      await screen.findByRole("heading", { name: /your list is empty/i }),
    ).toBeInTheDocument();
  });

  it("points at the privacy position rather than asserting one inline", async () => {
    seed();
    openPage();
    expect(
      await screen.findByRole("link", { name: /privacy/i }),
    ).toHaveAttribute("href", "/privacy");
  });
});

describe("enquiry storage", () => {
  it("survives a corrupt record without losing the session", async () => {
    window.localStorage.setItem(ENQUIRY_STORAGE_KEY, "{{not json");
    render(
      <EnquiryProvider>
        <EnquiryDrawer open onClose={vi.fn()} />
      </EnquiryProvider>,
    );
    expect(screen.getByText(/nothing selected yet/i)).toBeInTheDocument();
  });

  it("discards entries that are not the shape we wrote", async () => {
    window.localStorage.setItem(
      ENQUIRY_STORAGE_KEY,
      JSON.stringify([{ nope: true }, 42, null, ITEM]),
    );
    render(
      <EnquiryProvider>
        <EnquiryDrawer open onClose={vi.fn()} />
      </EnquiryProvider>,
    );
    expect(await screen.findByText("1 compound")).toBeInTheDocument();
  });

  it("adopts a change made in another tab", async () => {
    render(
      <EnquiryProvider>
        <EnquiryDrawer open onClose={vi.fn()} />
      </EnquiryProvider>,
    );
    expect(screen.getByText(/nothing selected yet/i)).toBeInTheDocument();

    await act(async () => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: ENQUIRY_STORAGE_KEY,
          newValue: JSON.stringify([ITEM]),
        }),
      );
    });
    expect(await screen.findByText("1 compound")).toBeInTheDocument();
  });
});
