import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PeptideCalculator } from "@/components/science/PeptideCalculator";

/**
 * The calculator as a visitor meets it.
 *
 * The arithmetic itself is covered in `tests/unit/calculator.test.ts`; these
 * tests are about whether the interface reaches it — labels, tab semantics,
 * keyboard operation, and whether a wrong number produces a message rather
 * than a silent NaN.
 */

/** Replace a field's contents outright. */
async function setField(
  user: ReturnType<typeof userEvent.setup>,
  label: RegExp | string,
  value: string,
) {
  const field = screen.getByLabelText(label);
  await user.clear(field);
  await user.type(field, value);
}

describe("mode switching", () => {
  it("offers all three modes", () => {
    render(<PeptideCalculator />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs.map((t) => t.textContent)).toEqual([
      "Reconstitute",
      "Mix",
      "Blend",
    ]);
  });

  it("opens on Reconstitute", () => {
    render(<PeptideCalculator />);
    expect(screen.getByRole("tab", { name: "Reconstitute" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("switches to Blend on click", async () => {
    const user = userEvent.setup();
    render(<PeptideCalculator />);
    await user.click(screen.getByRole("tab", { name: "Blend" }));
    expect(screen.getByRole("tab", { name: "Blend" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByLabelText(/total compound quantity/i)).toBeInTheDocument();
  });

  it("moves between modes with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<PeptideCalculator />);
    screen.getByRole("tab", { name: "Reconstitute" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Mix" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("keeps only the selected tab in the tab order", () => {
    render(<PeptideCalculator />);
    expect(screen.getByRole("tab", { name: "Reconstitute" })).toHaveAttribute(
      "tabindex",
      "0",
    );
    expect(screen.getByRole("tab", { name: "Mix" })).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });
});

describe("reconstitute", () => {
  it("computes the default case on first paint", () => {
    render(<PeptideCalculator />);
    // 10 mg in 2 mL = 5 mg/mL, and 0.25 mg draws 0.050 mL.
    expect(screen.getByText("5.000 mg/mL")).toBeInTheDocument();
    expect(screen.getByText("0.050 mL")).toBeInTheDocument();
  });

  it("recomputes when the diluent changes", async () => {
    const user = userEvent.setup();
    render(<PeptideCalculator />);
    await setField(user, /bacteriostatic water/i, "1");
    // 10 mg in 1 mL = 10 mg/mL, so 0.25 mg now draws 0.025 mL.
    expect(screen.getByText("10.000 mg/mL")).toBeInTheDocument();
    expect(screen.getByText("0.025 mL")).toBeInTheDocument();
  });

  it("converts a microgram target against a milligram vial", async () => {
    const user = userEvent.setup();
    render(<PeptideCalculator />);
    await setField(user, /quantity to draw/i, "250");
    await user.click(
      within(
        screen.getByRole("radiogroup", { name: /target quantity unit/i }),
      ).getByRole("radio", { name: "mcg" }),
    );
    // 250 mcg is 0.25 mg, so the answer must not move.
    expect(screen.getByText("0.050 mL")).toBeInTheDocument();
  });

  it("reports an error instead of a number when the diluent is zero", async () => {
    const user = userEvent.setup();
    render(<PeptideCalculator />);
    await setField(user, /bacteriostatic water/i, "0");

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/diluent volume must be greater than zero/i);
    expect(screen.queryByText(/mg\/mL/)).not.toBeInTheDocument();
  });

  it("reports an error when a field is emptied, rather than treating it as zero", async () => {
    const user = userEvent.setup();
    render(<PeptideCalculator />);
    await user.clear(screen.getByLabelText(/compound quantity/i));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /vial quantity is not a number/i,
    );
  });

  it("warns when the draw overruns the selected barrel", async () => {
    const user = userEvent.setup();
    render(<PeptideCalculator />);
    await user.click(
      within(screen.getByRole("radiogroup", { name: /syringe format/i })).getByRole(
        "radio",
        { name: "30 unit" },
      ),
    );
    await setField(user, /quantity to draw/i, "5");
    expect(
      screen.getByText(/exceeds the 30 unit barrel/i),
    ).toBeInTheDocument();
  });

  it("offers all five syringe formats", async () => {
    render(<PeptideCalculator />);
    const group = screen.getByRole("radiogroup", { name: /syringe format/i });
    expect(
      within(group)
        .getAllByRole("radio")
        .map((r) => r.textContent),
    ).toEqual(["30 unit", "50 unit", "100 unit", "1 mL", "3 mL"]);
  });

  it("shows the working on request", async () => {
    const user = userEvent.setup();
    render(<PeptideCalculator />);
    await user.click(screen.getByText(/show the working/i));
    expect(
      screen.getByText(/concentration = compound in vial ÷ diluent volume/i),
    ).toBeInTheDocument();
  });

  it("restores the defaults on reset", async () => {
    const user = userEvent.setup();
    render(<PeptideCalculator />);
    await setField(user, /bacteriostatic water/i, "8");
    expect(screen.queryByText("5.000 mg/mL")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /reset reconstitute/i }));
    expect(screen.getByText("5.000 mg/mL")).toBeInTheDocument();
  });

  it("announces the result region politely", () => {
    const { container } = render(<PeptideCalculator />);
    expect(container.querySelector('[aria-live="polite"]')).not.toBeNull();
  });
});

describe("mix", () => {
  it("starts with two rows and computes them", async () => {
    const user = userEvent.setup();
    render(<PeptideCalculator />);
    await user.click(screen.getByRole("tab", { name: "Mix" }));
    // 5 mg/mL × 1 mL + 2 mg/mL × 1 mL over 2 mL total.
    expect(screen.getByText("2.00 mL")).toBeInTheDocument();
    expect(screen.getByText("7.000 mg")).toBeInTheDocument();
  });

  it("adds a row", async () => {
    const user = userEvent.setup();
    render(<PeptideCalculator />);
    await user.click(screen.getByRole("tab", { name: "Mix" }));
    await user.click(screen.getByRole("button", { name: /add another vial/i }));
    expect(screen.getByLabelText(/^vial 3$/i)).toBeInTheDocument();
  });

  it("removes a row once there are more than two", async () => {
    const user = userEvent.setup();
    render(<PeptideCalculator />);
    await user.click(screen.getByRole("tab", { name: "Mix" }));
    await user.click(screen.getByRole("button", { name: /add another vial/i }));
    await user.click(screen.getByRole("button", { name: /remove vial 3/i }));
    expect(screen.queryByLabelText(/^vial 3$/i)).not.toBeInTheDocument();
  });

  it("offers no remove control at the two-row minimum", async () => {
    const user = userEvent.setup();
    render(<PeptideCalculator />);
    await user.click(screen.getByRole("tab", { name: "Mix" }));
    expect(screen.queryByRole("button", { name: /remove vial/i })).toBeNull();
  });

  it("names the offending row when a value is invalid", async () => {
    const user = userEvent.setup();
    render(<PeptideCalculator />);
    await user.click(screen.getByRole("tab", { name: "Mix" }));
    await user.clear(screen.getByLabelText(/^Vial B concentration$/));
    expect(await screen.findByRole("alert")).toHaveTextContent(/Vial B/);
  });
});

describe("blend", () => {
  it("splits the vial by ratio and solves the draw", async () => {
    const user = userEvent.setup();
    render(<PeptideCalculator />);
    await user.click(screen.getByRole("tab", { name: "Blend" }));
    // 30 mg at 2:1 in 3 mL: A is 20 mg at 6.667 mg/mL, so 200 mcg is 0.030 mL.
    expect(screen.getByText("0.030 mL")).toBeInTheDocument();
  });

  it("reports what the draw carries of every component", async () => {
    const user = userEvent.setup();
    render(<PeptideCalculator />);
    await user.click(screen.getByRole("tab", { name: "Blend" }));
    expect(screen.getByText("200.0 mcg")).toBeInTheDocument();
    // At 2:1, 200 mcg of A necessarily carries 100 mcg of B.
    expect(screen.getByText("100.0 mcg")).toBeInTheDocument();
  });

  it("changes the answer when a different component is targeted", async () => {
    const user = userEvent.setup();
    render(<PeptideCalculator />);
    await user.click(screen.getByRole("tab", { name: "Blend" }));
    await user.click(
      within(
        screen.getByRole("radiogroup", { name: "Target component" }),
      ).getByRole("radio", { name: "Component B" }),
    );
    // Solving for B doubles the volume at a 2:1 ratio.
    expect(screen.getByText("0.060 mL")).toBeInTheDocument();
  });

  it("adds and removes components", async () => {
    const user = userEvent.setup();
    render(<PeptideCalculator />);
    await user.click(screen.getByRole("tab", { name: "Blend" }));
    await user.click(
      screen.getByRole("button", { name: /add another component/i }),
    );
    expect(screen.getByLabelText(/^Component 3 ratio$/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /remove component 3/i }));
    expect(screen.queryByLabelText(/^Component 3 ratio$/)).toBeNull();
  });

  it("states that the components cannot be varied independently", async () => {
    const user = userEvent.setup();
    render(<PeptideCalculator />);
    await user.click(screen.getByRole("tab", { name: "Blend" }));
    expect(
      screen.getByText(/cannot be varied independently/i),
    ).toBeInTheDocument();
  });
});

describe("accessibility", () => {
  it("labels every numeric field", () => {
    const { container } = render(<PeptideCalculator />);
    for (const input of container.querySelectorAll("input")) {
      const labelled =
        input.getAttribute("aria-label") ??
        (input.id ? container.querySelector(`label[for="${input.id}"]`) : null);
      expect(labelled, `input #${input.id} has no label`).toBeTruthy();
    }
  });

  it("gives the panel a name from its tab", () => {
    render(<PeptideCalculator />);
    const panel = screen.getByRole("tabpanel");
    const tab = screen.getByRole("tab", { name: "Reconstitute" });
    expect(panel.getAttribute("aria-labelledby")).toBe(tab.id);
  });

  it("marks an invalid field for assistive technology", async () => {
    const user = userEvent.setup();
    render(<PeptideCalculator />);
    await user.clear(screen.getByLabelText(/bacteriostatic water/i));
    // The value is gone, so the calculation fails and an alert is announced.
    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });
});
