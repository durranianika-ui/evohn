import { describe, expect, it } from "vitest";
import { footerNav, menuIndex, nav } from "@/data/site";
import { legalDocuments } from "@/data/legal";
import { indexableRoutes, staticRoutePaths, staticRoutes } from "@/data/routes";

/**
 * The information architecture, asserted.
 *
 * These tests are the reason the primary bar cannot quietly grow back to
 * eleven items, and the reason a footer link cannot outlive the route it
 * points at.
 */

/** The seven the brief specifies, in the order it specifies. */
const PRIMARY = [
  "Catalogue",
  "Science",
  "Journal",
  "Lab Results",
  "Reviews",
  "About",
  "Contact",
];

/** The four research tools the Science dropdown must carry. */
const SCIENCE_TOOLS = [
  { label: "Calculator", href: "/calculator" },
  { label: "Peptide Pedia", href: "/peptide-pedia" },
  { label: "Reconstitution Guide", href: "/reconstitution-guide" },
  { label: "Storage & Handling Guide", href: "/storage-handling" },
];

describe("primary navigation", () => {
  it("carries exactly the seven specified destinations, in order", () => {
    expect(nav.map((item) => item.label)).toEqual(PRIMARY);
  });

  it("gives every plain item a destination", () => {
    for (const item of nav) {
      // An item is either a link or a dropdown trigger — never neither.
      expect(Boolean(item.href) || Boolean(item.menu)).toBe(true);
    }
  });

  it("opens a dropdown under Science and nowhere else", () => {
    const withMenus = nav.filter((item) => item.menu).map((item) => item.label);
    expect(withMenus).toEqual(["Science"]);
  });
});

describe("Science dropdown", () => {
  const science = nav.find((item) => item.label === "Science");

  it("exists", () => {
    expect(science?.menu).toBeDefined();
  });

  it("carries the four research tools in the specified order", () => {
    expect(
      science!.menu!.links.map(({ label, href }) => ({ label, href })),
    ).toEqual(SCIENCE_TOOLS);
  });

  it("gives every row a one-line description for the panel", () => {
    for (const link of science!.menu!.links) {
      expect(link.description?.trim()).toBeTruthy();
    }
  });
});

describe("route registry", () => {
  it("registers every address exactly once", () => {
    expect(new Set(staticRoutePaths).size).toBe(staticRoutePaths.length);
  });

  it("starts every path with a slash", () => {
    for (const path of staticRoutePaths) {
      expect(path.startsWith("/")).toBe(true);
    }
  });

  it("keeps the two utility surfaces out of the sitemap", () => {
    const indexed = indexableRoutes.map((r) => r.path);
    expect(indexed).not.toContain("/search");
    expect(indexed).not.toContain("/enquiry");
  });

  it("keeps every other route in the sitemap", () => {
    const noindexed = staticRoutes.filter((r) => r.noindex).map((r) => r.path);
    expect(noindexed.sort()).toEqual(["/enquiry", "/search"]);
  });

  it("registers all eight legal documents", () => {
    for (const doc of legalDocuments) {
      expect(staticRoutePaths).toContain(doc.path);
    }
  });

  it("gives every route a priority between 0 and 1", () => {
    for (const route of staticRoutes) {
      expect(route.priority).toBeGreaterThan(0);
      expect(route.priority).toBeLessThanOrEqual(1);
    }
  });
});

describe("every navigation link resolves", () => {
  /** Dynamic segments are generated from data and are checked separately. */
  const isDynamic = (href: string) =>
    /^\/(products|journal|stacks|lab-results)\/[^/]+$/.test(href);

  const check = (href: string, source: string) => {
    const [path] = href.split(/[?#]/);
    if (isDynamic(path)) return;
    expect(
      staticRoutePaths,
      `${source} points at ${path}, which is not a registered route`,
    ).toContain(path);
  };

  it("from the primary bar", () => {
    for (const item of nav) {
      if (item.href) check(item.href, `nav: ${item.label}`);
      for (const link of item.menu?.links ?? []) {
        check(link.href, `nav dropdown: ${link.label}`);
      }
    }
  });

  it("from the utility index", () => {
    for (const column of menuIndex) {
      for (const link of column.links) {
        check(link.href, `menuIndex ${column.heading}: ${link.label}`);
      }
    }
  });

  it("from the footer", () => {
    for (const column of footerNav) {
      for (const link of column.links) {
        check(link.href, `footer ${column.heading}: ${link.label}`);
      }
    }
  });

  it("from the legal documents", () => {
    for (const doc of legalDocuments) {
      check(doc.path, `legal: ${doc.label}`);
    }
  });
});

describe("no reference-site residue", () => {
  const everyLink = [
    ...nav.flatMap((i) => [i.href, ...(i.menu?.links.map((l) => l.href) ?? [])]),
    ...menuIndex.flatMap((c) => c.links.map((l) => l.href)),
    ...footerNav.flatMap((c) => c.links.map((l) => l.href)),
  ].filter((href): href is string => Boolean(href));

  it("links to no external host at all from the navigation", () => {
    for (const href of everyLink) {
      expect(href.startsWith("/")).toBe(true);
    }
  });

  it("mentions neither reference brand in any label or address", () => {
    const everyLabel = [
      ...nav.map((i) => i.label),
      ...nav.flatMap((i) => i.menu?.links.map((l) => l.label) ?? []),
      ...menuIndex.flatMap((c) => [c.heading, ...c.links.map((l) => l.label)]),
      ...footerNav.flatMap((c) => [c.heading, ...c.links.map((l) => l.label)]),
    ];
    for (const text of [...everyLabel, ...everyLink]) {
      expect(text).not.toMatch(/roehn|reviva/i);
    }
  });
});

describe("everything the demoted sections need stays reachable", () => {
  const reachable = new Set([
    ...menuIndex.flatMap((c) => c.links.map((l) => l.href)),
    ...footerNav.flatMap((c) => c.links.map((l) => l.href)),
    ...nav.flatMap((i) => [
      i.href,
      ...(i.menu?.links.map((l) => l.href) ?? []),
    ]),
    ...legalDocuments.map((d) => d.path),
  ]);

  it("reaches every registered route from somewhere in the chrome", () => {
    // `/` is the wordmark, which is not in any link list.
    const unreachable = staticRoutePaths.filter(
      (path) => path !== "/" && !reachable.has(path),
    );
    expect(unreachable).toEqual([]);
  });
});
