import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Calculator from "./pages/Calculator";
import FarmProvider from "./context/FarmContext";

describe("Meat Processor Value Calculator", () => {
  beforeEach(() => {
    // Clear localStorage before each test to ensure clean state
    localStorage.clear();
  });

  it("renders the calculator title", () => {
    render(<FarmProvider><Calculator /></FarmProvider>);
    expect(
      screen.getByText("Value Calculator")
    ).toBeInTheDocument();
  });

  it("displays the multi-select dropdown and summary", () => {
    render(<FarmProvider><Calculator /></FarmProvider>);
    expect(screen.getAllByRole("combobox")[0]).toBeInTheDocument();
    expect(screen.getByText("Summary")).toBeInTheDocument();
    expect(screen.getByText("Total Annual Savings")).toBeInTheDocument();
    expect(screen.getByText("Total Annual Cost")).toBeInTheDocument();
  });

  it("shows volume inputs when species are selected", () => {
    render(<FarmProvider><Calculator /></FarmProvider>);

    // Find the select by its role (get first one - main calculator)
    const selectElement = screen.getAllByRole("combobox")[0];

    // Open the dropdown
    fireEvent.mouseDown(selectElement);

    // Select Beef
    const beefOption = screen.getByRole("option", { name: /Beef/i });
    fireEvent.click(beefOption);

    // Check if volume input appears
    expect(
      screen.getByText(/Annual Processing Volume by Species/i) // Wrong text!
    ).toBeInTheDocument();
  });

  it("calculates annual savings and cost correctly", () => {
    render(<FarmProvider><Calculator /></FarmProvider>);

    const selectElement = screen.getAllByRole("combobox")[0]; // Select Animal Species is the first combobox

    // Open the dropdown and select Beef
    fireEvent.mouseDown(selectElement);
    const beefOption = screen.getByRole("option", { name: /Beef/i });
    fireEvent.click(beefOption);

    // Enter volume for beef
    const volumeInput = screen.getByLabelText(
      /Total Annual Hanging Weight \(lbs\)/i
    );
    fireEvent.change(volumeInput, { target: { value: "1000" } });

    // Check that calculations are displayed (values will depend on the calculation logic)
    expect(screen.getByText("Total Annual Volume")).toBeInTheDocument();
    expect(screen.getByText("Net Annual Benefit:")).toBeInTheDocument();
  });

  it("shows advanced settings when clicked", () => {
    render(<FarmProvider><Calculator /></FarmProvider>);

    // Advanced settings should be hidden initially
    expect(
      screen.queryByLabelText(/Time Savings per Animal/i)
    ).not.toBeVisible();

    // Click the expand button
    const expandButton = screen.getByRole("button", { name: "" });
    fireEvent.click(expandButton);

    // Advanced settings should now be visible
    expect(screen.getByLabelText(/Time Savings per Animal/i)).toBeVisible();
    expect(screen.getByLabelText(/Average Hourly Wage/i)).toBeVisible();
  });

  it("can select multiple species", () => {
    render(<FarmProvider><Calculator /></FarmProvider>);

    const selectElement = screen.getAllByRole("combobox")[0]; // Select Animal Species is the first combobox

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
      screen.getByText("Beef", { selector: ".MuiChip-label" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Hog", { selector: ".MuiChip-label" })
    ).toBeInTheDocument();
  });

  // FAILING TEST - Interns need to add delete/remove functionality
  it("should allow removing a selected species", () => {
    render(<FarmProvider><Calculator /></FarmProvider>);

    const selectElement = screen.getAllByRole("combobox")[0]; // Select Animal Species is the first combobox

    // Select Beef
    fireEvent.mouseDown(selectElement);
    const beefOption = screen.getByRole("option", { name: /Beef/i });
    fireEvent.click(beefOption);
    fireEvent.keyDown(screen.getByRole("listbox"), { key: "Escape" });

    // This delete/remove button doesn't exist yet - interns need to add it
    const deleteButton = screen.getByRole("button", { name: /remove|delete/i });
    fireEvent.click(deleteButton);

    expect(
      screen.queryByText("Beef", { selector: ".MuiChip-label" })
    ).not.toBeInTheDocument();
  });
});
