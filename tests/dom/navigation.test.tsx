import { describe, expect, it, vi } from "vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { EnquiryProvider } from "@/lib/enquiry";

/**
 * The navigation as a visitor meets it.
 *
 * `next/navigation` is stubbed rather than mocked deeply: the header only
 * reads `usePathname` and pushes on search submit, so a fixed path and a spy
 * are the whole surface.
 */

const push = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push, replace: vi.fn(), prefetch: vi.fn() }),
}));

function renderHeader() {
  return render(
    <EnquiryProvider>
      <Header />
    </EnquiryProvider>,
  );
}

describe("primary bar", () => {
  it("renders the seven destinations", () => {
    renderHeader();
    const primary = screen.getByRole("navigation", { name: "Primary" });
    const labels = within(primary)
      .getAllByRole("link")
      .concat(within(primary).getAllByRole("button"))
      .map((el) => el.textContent?.trim());

    for (const label of [
      "Catalogue",
      "Journal",
      "Lab Results",
      "Reviews",
      "About",
      "Contact",
    ]) {
      expect(labels.some((l) => l?.startsWith(label))).toBe(true);
    }
    expect(
      within(primary).getByRole("button", { name: /science/i }),
    ).toBeInTheDocument();
  });

  it("offers a skip link before anything else", () => {
    renderHeader();
    const skip = screen.getByRole("link", { name: /skip to content/i });
    expect(skip).toHaveAttribute("href", "#main");
  });

  it("names the wordmark for assistive technology", () => {
    renderHeader();
    expect(
      screen.getByRole("link", { name: /evohn — home/i }),
    ).toHaveAttribute("href", "/");
  });
});

describe("science dropdown", () => {
  it("is collapsed to begin with", () => {
    renderHeader();
    expect(screen.getByRole("button", { name: /science/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("opens on hover and lists the four tools", async () => {
    const user = userEvent.setup();
    renderHeader();
    await user.hover(screen.getByRole("button", { name: /science/i }));

    for (const label of [
      "Calculator",
      "Peptide Pedia",
      "Reconstitution Guide",
      "Storage & Handling Guide",
    ]) {
      expect(screen.getByRole("link", { name: new RegExp(label, "i") }))
        .toBeInTheDocument();
    }
  });

  it("opens on a touch tap, without a phantom hover closing it again", () => {
    renderHeader();
    const trigger = screen.getByRole("button", { name: /science/i });
    expect(trigger).toHaveAttribute("aria-haspopup", "true");

    // A tap synthesises pointerenter before click. Were the hover-open not
    // guarded to a mouse, this sequence would open the panel and the click
    // would immediately toggle it shut, leaving it unreachable by tap.
    // fireEvent, not userEvent: userEvent.click always synthesises a *mouse*
    // pointerenter first, which is the one case this guard exists to exclude.
    fireEvent.pointerEnter(trigger, { pointerType: "touch" });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("points each tool at its own route", async () => {
    const user = userEvent.setup();
    renderHeader();
    await user.hover(screen.getByRole("button", { name: /science/i }));

    const expected: [RegExp, string][] = [
      [/calculator/i, "/calculator"],
      [/peptide pedia/i, "/peptide-pedia"],
      [/reconstitution guide/i, "/reconstitution-guide"],
      [/storage & handling guide/i, "/storage-handling"],
    ];
    for (const [name, href] of expected) {
      expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
    }
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    renderHeader();
    const trigger = screen.getByRole("button", { name: /science/i });
    await user.hover(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("opens on keyboard focus, so it is reachable without a mouse", async () => {
    renderHeader();
    const trigger = screen.getByRole("button", { name: /science/i });
    await act(async () => {
      trigger.focus();
    });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });
});

describe("utility controls", () => {
  it("offers search, the enquiry list and a menu", () => {
    renderHeader();
    expect(screen.getByRole("button", { name: /^search$/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /enquiry list/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /open site index/i }),
    ).toBeInTheDocument();
  });

  it("announces an empty enquiry list as zero rather than hiding it", () => {
    renderHeader();
    expect(
      screen.getByRole("button", { name: /enquiry list, 0 compounds/i }),
    ).toBeInTheDocument();
  });

  it("reads a persisted list and announces the count", () => {
    window.localStorage.setItem(
      "evohn.enquiry.v1",
      JSON.stringify([
        { slug: "bpc-157", name: "BPC-157", subtitle: "Recovery", dosage: "5 mg" },
      ]),
    );
    renderHeader();
    expect(
      screen.getByRole("button", { name: /enquiry list, 1 compound/i }),
    ).toBeInTheDocument();
  });

  it("opens the search sheet and focuses the field", async () => {
    const user = userEvent.setup();
    renderHeader();
    await user.click(screen.getByRole("button", { name: /^search$/i }));

    const dialog = await screen.findByRole("dialog", { name: /search evohn/i });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole("searchbox")).toBeInTheDocument();
  });

  it("hands a submitted query to /search", async () => {
    const user = userEvent.setup();
    push.mockClear();
    renderHeader();
    await user.click(screen.getByRole("button", { name: /^search$/i }));

    const dialog = await screen.findByRole("dialog", { name: /search evohn/i });
    await user.type(within(dialog).getByRole("searchbox"), "semaglutide{Enter}");
    expect(push).toHaveBeenCalledWith("/search?q=semaglutide");
  });

  it("does not navigate on a query too short to mean anything", async () => {
    const user = userEvent.setup();
    push.mockClear();
    renderHeader();
    await user.click(screen.getByRole("button", { name: /^search$/i }));

    const dialog = await screen.findByRole("dialog", { name: /search evohn/i });
    await user.type(within(dialog).getByRole("searchbox"), "a{Enter}");
    expect(push).not.toHaveBeenCalled();
  });

  it("closes the search sheet on Escape", async () => {
    const user = userEvent.setup();
    renderHeader();
    await user.click(screen.getByRole("button", { name: /^search$/i }));
    await screen.findByRole("dialog", { name: /search evohn/i });

    await user.keyboard("{Escape}");
    // AnimatePresence keeps the node mounted for the exit transition.
    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: /search evohn/i }),
      ).not.toBeInTheDocument(),
    );
  });

  it("opens the enquiry drawer as a modal dialog", async () => {
    const user = userEvent.setup();
    renderHeader();
    await user.click(screen.getByRole("button", { name: /enquiry list/i }));

    const drawer = await screen.findByRole("dialog", { name: /enquiry list/i });
    expect(drawer).toHaveAttribute("aria-modal", "true");
  });

  it("opens the site index and lists the demoted sections", async () => {
    const user = userEvent.setup();
    renderHeader();
    await user.click(screen.getByRole("button", { name: /open site index/i }));

    const index = await screen.findByRole("dialog", { name: /site index/i });
    // These four left the primary bar; the index is where they went.
    for (const label of ["Research Stacks", "Pocket Strips", "Quality", "FAQ"]) {
      expect(
        within(index).getByRole("link", { name: label }),
      ).toBeInTheDocument();
    }
  });
});

describe("mobile drawer", () => {
  const renderDrawer = () =>
    render(
      <EnquiryProvider>
        <MobileNav open onClose={vi.fn()} />
      </EnquiryProvider>,
    );

  it("is a labelled modal dialog", () => {
    renderDrawer();
    const dialog = screen.getByRole("dialog", { name: "Menu" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("keeps every primary destination one tap away", () => {
    renderDrawer();
    const primary = screen.getByRole("navigation", { name: "Primary" });
    for (const [label, href] of [
      ["Catalogue", "/catalogue"],
      ["Journal", "/journal"],
      ["Lab Results", "/lab-results"],
      ["Reviews", "/reviews"],
      ["About", "/about"],
      ["Contact", "/contact"],
    ]) {
      expect(
        within(primary).getByRole("link", { name: label }),
      ).toHaveAttribute("href", href);
    }
  });

  it("collapses the Science accordion to begin with", () => {
    renderDrawer();
    expect(screen.getByRole("button", { name: "Science" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("expands Science to reveal the four tools", async () => {
    const user = userEvent.setup();
    renderDrawer();
    await user.click(screen.getByRole("button", { name: "Science" }));

    expect(screen.getByRole("button", { name: "Science" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    // Scoped to the accordion: the full index below the fold lists the same
    // four tools again, which is deliberate, not a duplicate.
    const primary = screen.getByRole("navigation", { name: "Primary" });
    expect(
      within(primary).getByRole("link", { name: /calculator/i }),
    ).toHaveAttribute("href", "/calculator");
  });

  it("surfaces the enquiry list and search as their own rows", () => {
    renderDrawer();
    // Both also appear in the full index further down; every occurrence must
    // resolve to the same address.
    for (const link of screen.getAllByRole("link", { name: /enquiry list/i })) {
      expect(link).toHaveAttribute("href", "/enquiry");
    }
    for (const link of screen.getAllByRole("link", { name: /^search$/i })) {
      expect(link).toHaveAttribute("href", "/search");
    }
  });

  it("carries the full index and the legal list", () => {
    renderDrawer();
    expect(
      screen.getByRole("navigation", { name: "Legal" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Research Use Only" }),
    ).toHaveAttribute("href", "/research-use-only");
  });
});
