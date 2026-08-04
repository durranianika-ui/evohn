import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

/**
 * The reduced-motion branches.
 *
 * `useReducedMotion` is mocked rather than driven through `matchMedia`:
 * framer-motion resolves the device preference once into a module-level value
 * on first import, so a stub changed later in the run never reaches it. Mocking
 * the hook tests the branch this codebase actually owns.
 */
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>(
    "framer-motion",
  );
  return { ...actual, useReducedMotion: () => true };
});

const { SplitText } = await import("@/components/motion/SplitText");
const { Reveal } = await import("@/components/motion/Reveal");
const { MobileNav } = await import("@/components/layout/MobileNav");
const { EnquiryProvider } = await import("@/lib/enquiry");

describe("under prefers-reduced-motion", () => {
  it("SplitText renders plain lines with no per-word clip boxes", () => {
    render(<SplitText as="h2" text={"One\nTwo"} />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toBe("OneTwo");
    expect(heading.querySelector("[aria-hidden]")).toBeNull();
    // With no animated fragments there is nothing to relabel, so the heading
    // is read from its own text rather than from an aria-label.
    expect(heading).not.toHaveAttribute("aria-label");
  });

  it("Reveal still renders its children", () => {
    render(
      <Reveal>
        <p>Present regardless</p>
      </Reveal>,
    );
    expect(screen.getByText("Present regardless")).toBeInTheDocument();
  });

  it("the mobile drawer still opens and lists every destination", () => {
    render(
      <EnquiryProvider>
        <MobileNav open onClose={vi.fn()} />
      </EnquiryProvider>,
    );
    expect(screen.getByRole("dialog", { name: "Menu" })).toBeInTheDocument();

    // Scoped to the primary list: the full site index below repeats several of
    // these deliberately, so an unscoped query matches more than one.
    const nav = within(screen.getByRole("navigation", { name: "Primary" }));
    for (const label of ["Catalogue", "Journal", "Reviews", "Contact"]) {
      expect(nav.getByRole("link", { name: label })).toBeInTheDocument();
    }
  });
});
