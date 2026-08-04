import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SplitText } from "@/components/motion/SplitText";
import { TableOfContents } from "@/components/common/TableOfContents";
import { SearchResults } from "@/components/search/SearchResults";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));


describe("split text", () => {
  it("announces the whole phrase as one string, not word by word", () => {
    render(<SplitText as="h1" text={"Scientific\nPrecision."} />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveAttribute("aria-label", "Scientific Precision.");
    // Every animated fragment is hidden, so the label is what is read.
    for (const line of heading.querySelectorAll(":scope > span")) {
      expect(line).toHaveAttribute("aria-hidden");
    }
  });

  // The reduced-motion branch is covered in `reduced-motion.test.tsx`, which
  // mocks the hook. framer-motion resolves the preference once into a
  // module-level value on first import, so changing the matchMedia stub
  // afterwards cannot reach it.
});

describe("table of contents", () => {
  const entries = [
    { id: "one", label: "First clause" },
    { id: "two", label: "Second clause" },
  ];

  it("is a labelled navigation landmark", () => {
    render(<TableOfContents entries={entries} label="Clauses" />);
    expect(
      screen.getByRole("navigation", { name: "Clauses" }),
    ).toBeInTheDocument();
  });

  it("links each entry to its own anchor", () => {
    render(<TableOfContents entries={entries} />);
    expect(screen.getByRole("link", { name: /first clause/i })).toHaveAttribute(
      "href",
      "#one",
    );
  });

  it("renders nothing when there is nothing to index", () => {
    const { container } = render(<TableOfContents entries={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("is hidden from print, where a jump list is useless", () => {
    render(<TableOfContents entries={entries} />);
    expect(screen.getByRole("navigation")).toHaveAttribute(
      "data-print",
      "hide",
    );
  });
});

describe("search results", () => {
  it("prompts rather than showing an empty list for a one-character query", () => {
    render(<SearchResults query="a" kind={null} />);
    expect(screen.getByText(/at least two characters/i)).toBeInTheDocument();
  });

  it("offers a route out when nothing matches", () => {
    render(<SearchResults query="qqzzxxwv" kind={null} />);
    expect(screen.getByText(/nothing matches/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /full catalogue/i }),
    ).toHaveAttribute("href", "/catalogue");
  });

  it("finds a compound and links it at its own address", () => {
    render(<SearchResults query="semaglutide" kind={null} />);
    const first = screen.getAllByRole("link")[0];
    expect(first).toHaveAttribute("href", "/products/semaglutide");
  });

  it("announces the result count politely", () => {
    const { container } = render(<SearchResults query="peptide" kind={null} />);
    const live = container.querySelector('[aria-live="polite"]');
    expect(live).not.toBeNull();
    expect(live?.textContent).toMatch(/results for peptide/i);
  });

  it("filters by kind when one is chosen", () => {
    const { rerender } = render(<SearchResults query="peptide" kind={null} />);
    const all = screen.getAllByRole("link").length;
    rerender(<SearchResults query="peptide" kind="Compound" />);
    const compounds = screen.getAllByRole("link");
    expect(compounds.length).toBeLessThanOrEqual(all);
    for (const link of compounds) {
      expect(link.getAttribute("href")).toMatch(/^\/products\//);
    }
  });

  it("offers kind filters as pressable controls", async () => {
    const user = userEvent.setup();
    const onKindChange = vi.fn();
    render(
      <SearchResults query="peptide" kind={null} onKindChange={onKindChange} />,
    );
    const group = screen.getByRole("group", { name: /filter results by type/i });
    expect(group).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^compound/i }));
    expect(onKindChange).toHaveBeenCalledWith("Compound");
  });
});
