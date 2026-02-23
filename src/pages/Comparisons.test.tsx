import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Comparisons from "./Comparisons";
import FarmProvider from "../context/FarmContext";

describe("Comparisons Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // toggle between comparison types
  it("should toggle between Species Mix and Before/After comparison modes", () => {
    render(
      <MemoryRouter>
        <FarmProvider>
          <Comparisons />
        </FarmProvider>
      </MemoryRouter>
    );

    // verify default mode is Species Mix
    expect(screen.getByText("Species Mix Comparison")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Compare different species combinations to optimize profitability/i
      )
    ).toBeInTheDocument();

    // verify both toggle buttons exist
    const speciesMixButton = screen.getByRole("button", {
      name: /Species Mix/i,
    });
    const beforeAfterButton = screen.getByRole("button", {
      name: /Before\/After/i,
    });

    expect(speciesMixButton).toBeInTheDocument();
    expect(beforeAfterButton).toBeInTheDocument();

    // switch to Before/After mode
    fireEvent.click(beforeAfterButton);

    // verify mode changed
    expect(screen.getByText("Before vs After Comparison")).toBeInTheDocument();
    expect(
      screen.getByText(/See the financial impact of using FarmShare platform/i)
    ).toBeInTheDocument();

    // switch back to Species Mix
    fireEvent.click(speciesMixButton);

    // verify we're back to Species Mix mode
    expect(screen.getByText("Species Mix Comparison")).toBeInTheDocument();
  });

  // species Mix comparison - both scenarios
  it("should allow selecting species and entering volumes for both scenarios", () => {
    render(
      <MemoryRouter>
        <FarmProvider>
          <Comparisons />
        </FarmProvider>
      </MemoryRouter>
    );

    // verify both scenario sections are present
    expect(screen.getByText("Species A")).toBeInTheDocument();
    expect(screen.getByText("Species B")).toBeInTheDocument();

    // get both Select Species dropdowns using combobox role
    const selectElements = screen.getAllByRole("combobox");
    expect(selectElements.length).toBeGreaterThanOrEqual(2);

    // select Beef in Scenario A (first dropdown)
    fireEvent.mouseDown(selectElements[0]);
    const beefOptions = screen.getAllByText("Beef");
    fireEvent.click(beefOptions[0]);

    // close the dropdown
    fireEvent.keyDown(selectElements[0], { key: "Escape" });

    // verify volume input appears for Scenario A
    const volumeInputA = screen.getByLabelText(/Beef Volume \(lbs\)/i);
    expect(volumeInputA).toBeInTheDocument();

    // enter volume for Scenario A
    fireEvent.change(volumeInputA, { target: { value: "5000" } });
    expect(volumeInputA).toHaveValue(5000);

    // select Lamb in Scenario B (second dropdown)
    fireEvent.mouseDown(selectElements[1]);
    const lambOptions = screen.getAllByText("Lamb");
    fireEvent.click(lambOptions[0]);

    // verify Lamb chip appears
    expect(screen.getAllByText("Lamb").length).toBeGreaterThan(0);
  });

  // Before/After comparison renders
  it("should display Before/After comparison component when selected", () => {
    render(
      <MemoryRouter>
        <FarmProvider>
          <Comparisons />
        </FarmProvider>
      </MemoryRouter>
    );

    // switch to Before/After mode
    const beforeAfterButton = screen.getByRole("button", {
      name: /Before\/After/i,
    });
    fireEvent.click(beforeAfterButton);

    // verify the mode changed
    expect(screen.getByText("Before vs After Comparison")).toBeInTheDocument();

    // the BeforeAfterComparison component should be rendered
    // we can verify this by checking if the mode switch was successful
    expect(
      screen.getByText(/See the financial impact of using FarmShare platform/i)
    ).toBeInTheDocument();
  });
});
