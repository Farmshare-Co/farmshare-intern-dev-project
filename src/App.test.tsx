import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import App from "./App";

describe("Meat Processor Value Calculator", () => {
  it("renders the calculator title", () => {
    render(<App />);
    expect(
      screen.getByText("Meat Processor Value Calculator"),
    ).toBeInTheDocument();
  });

  it("displays the multi-select dropdown and summary", () => {
    render(<App />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Annual Summary")).toBeInTheDocument();
    expect(screen.getByText("Total Annual Savings:")).toBeInTheDocument(); // Wrong text!
    expect(screen.getByText("Total Annual Cost:")).toBeInTheDocument();
  });

  it("shows volume inputs when species are selected", () => {
    render(<App />);

    // Find the select by its role
    const selectElement = screen.getByRole("combobox");

    // Open the dropdown
    fireEvent.mouseDown(selectElement);

    // Select Beef
    const beefOption = screen.getByRole("option", { name: /Beef/i });
    fireEvent.click(beefOption);

    // Check if volume input appears
    expect(
      screen.getByText(/Annual Processing Volume by Species/i), // Wrong text!
    ).toBeInTheDocument();
  });

  it("calculates annual savings and cost correctly", () => {
    render(<App />);

    const selectElement = screen.getByRole("combobox");

    // Open the dropdown and select Beef
    fireEvent.mouseDown(selectElement);
    const beefOption = screen.getByRole("option", { name: /Beef/i });
    fireEvent.click(beefOption);

    // Enter volume for beef
    const volumeInput = screen.getByLabelText(
      /Total Annual Hanging Weight \(lbs\)/i,
    );
    fireEvent.change(volumeInput, { target: { value: "1000" } });

    // Check that calculations are displayed (values will depend on the calculation logic)
    expect(screen.getByText("Total Annual Volume:")).toBeInTheDocument(); // Wrong text!
    expect(screen.getByText("Net Annual Benefit:")).toBeInTheDocument();
  });

  it("shows advanced settings when clicked", () => {
    render(<App />);

    // Advanced settings should be hidden initially
    expect(
      screen.queryByLabelText(/Time Savings per Animal/i),
    ).not.toBeVisible();

    // Click the expand button
    const expandButton = screen.getByRole("button", { name: "" });
    fireEvent.click(expandButton);

    // Advanced settings should now be visible
    expect(screen.getByLabelText(/Time Savings per Animal/i)).toBeVisible();
    expect(screen.getByLabelText(/Average Hourly Wage/i)).toBeVisible();
  });

  it("can select multiple species", () => {
    render(<App />);

    const selectElement = screen.getByRole("combobox");

    // Open the dropdown
    fireEvent.mouseDown(selectElement);

    // Select multiple species
    const beefOption = screen.getByRole("option", { name: /Beef/i });
    fireEvent.click(beefOption);

    fireEvent.mouseDown(selectElement);
    const hogOption = screen.getByRole("option", { name: /Hog/i });
    fireEvent.click(hogOption);

    // Check if chips are displayed for both species
    expect(
      screen.getByText("Beef", { selector: ".MuiChip-label" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Hog", { selector: ".MuiChip-label" }),
    ).toBeInTheDocument();
  });

  // FAILING TEST - Interns need to add delete/remove functionality
  it("should allow removing a selected species", () => {
    render(<App />);

    const selectElement = screen.getByRole("combobox");

    // Select Beef
    fireEvent.mouseDown(selectElement);
    const beefOption = screen.getByRole("option", { name: /Beef/i });
    fireEvent.click(beefOption);

    // This delete/remove button doesn't exist yet - interns need to add it
    const deleteButton = screen.getByRole("button", { name: /remove|delete/i });
    fireEvent.click(deleteButton);

    expect(
      screen.queryByText("Beef", { selector: ".MuiChip-label" }),
    ).not.toBeInTheDocument();
  });
});

function openAndSelectSpecies(label: RegExp) {
  const selectElement = screen.getByRole("combobox");
  fireEvent.mouseDown(selectElement);
  const option = screen.getByRole("option", { name: label });
  fireEvent.click(option);
}

describe("Additional behavior tests", () => {
  beforeEach(() => {
    cleanup();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("Clear all resets selected species and volumes", () => {
    render(<App />);

    // select beef
    openAndSelectSpecies(/Beef/i);

    // volume input should exist now
    const volumeInput = screen.getByLabelText(/Total Annual Hanging Weight \(lbs\)/i);
    fireEvent.change(volumeInput, { target: { value: "1000" } });

    // Clear all
    const clearAll = screen.getByRole("button", { name: /clear all/i });
    fireEvent.click(clearAll);

    // chip should be gone
    expect(
      screen.queryByText("Beef", { selector: ".MuiChip-label" }),
    ).not.toBeInTheDocument();

    // annual volume should be 0 lbs
    expect(screen.getByText(/0 lbs/i)).toBeInTheDocument();
  });

  it("removes an individual species via chip delete button", () => {
    render(<App />);

    openAndSelectSpecies(/Beef/i);

    // There should be a delete icon button for the chip
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons.length).toBeGreaterThan(0);

    fireEvent.click(deleteButtons[0]);

    expect(
      screen.queryByText("Beef", { selector: ".MuiChip-label" }),
    ).not.toBeInTheDocument();
  });

  it("clamps negative volume input to 0 (input validation)", () => {
    render(<App />);
    openAndSelectSpecies(/Beef/i);

    const volumeInput = screen.getByLabelText(/Total Annual Hanging Weight \(lbs\)/i);
    fireEvent.change(volumeInput, { target: { value: "-50" } });

    // If you clamp, it should become "0"
    expect(volumeInput).toHaveValue(0);
  });

  it("allows toggling comparison mode on/off", () => {
    render(<App />);

    const toggle = screen.getByRole("button", { name: /toggle comparison mode/i });

    // start off
    expect(screen.getByText(/Comparison: OFF/i)).toBeInTheDocument();

    fireEvent.click(toggle);
    expect(screen.getByText(/Comparison: ON/i)).toBeInTheDocument();

    fireEvent.click(toggle);
    expect(screen.getByText(/Comparison: OFF/i)).toBeInTheDocument();
  });

  it("exports CSV when clicking Export CSV (creates download link)", () => {
    const createElementSpy = vi.spyOn(document, "createElement");
    const appendSpy = vi.spyOn(document.body, "appendChild");
    const removeSpy = vi.spyOn(HTMLElement.prototype, "remove");

    // mock click so it doesn't actually try to navigate
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    render(<App />);

    // In single scenario mode, there should be an Export CSV button (Scenario A)
    const exportBtn = screen.getByRole("button", { name: /export csv scenario a/i });
    fireEvent.click(exportBtn);

    expect(createElementSpy).toHaveBeenCalledWith("a");
    expect(appendSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
  });
});


describe("Persistence (localStorage)", () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("saves and restores Scenario A state after remount (acts like refresh)", () => {
    // 1) Mount with persistence ENABLED (override)
    const first = render(<App disablePersistence={false} />);

    // select beef
    openAndSelectSpecies(/Beef/i);

    // set volume
    const volumeInput = screen.getByLabelText(/Total Annual Hanging Weight \(lbs\)/i);
    fireEvent.change(volumeInput, { target: { value: "1000" } });

    // sanity check on first mount
    expect(screen.getByText("Beef", { selector: ".MuiChip-label" })).toBeInTheDocument();
    expect(volumeInput).toHaveValue(1000);

    // 2) Unmount (simulate refresh)
    first.unmount();

    // 3) Remount with persistence enabled
    render(<App disablePersistence={false} />);

    // chip should still exist
    expect(screen.getByText("Beef", { selector: ".MuiChip-label" })).toBeInTheDocument();

    // volume input should still be there and still be 1000
    const restoredVolumeInput = screen.getByLabelText(/Total Annual Hanging Weight \(lbs\)/i);
    expect(restoredVolumeInput).toHaveValue(1000);
  });

  it("persists comparison mode enabled across remount", () => {
    const first = render(<App disablePersistence={false} />);

    const toggle = screen.getByRole("button", { name: /toggle comparison mode/i });
    fireEvent.click(toggle);

    // it should now show ON
    expect(screen.getByText(/Comparison: ON/i)).toBeInTheDocument();

    first.unmount();

    render(<App disablePersistence={false} />);

    // should restore ON after remount
    expect(screen.getByText(/Comparison: ON/i)).toBeInTheDocument();
  });
});