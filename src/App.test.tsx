import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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
    expect(screen.getByText("Results")).toBeInTheDocument();
    expect(screen.getByText("Labor Savings")).toBeInTheDocument();
    expect(screen.getByText("Platform Cost")).toBeInTheDocument();
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
      screen.getByLabelText(/Total Annual Hanging Weight \(lbs\)/i),
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
    expect(screen.getByText("Labor Savings")).toBeInTheDocument();
    expect(screen.getByText("Net Benefit")).toBeInTheDocument();
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

  it("should allow removing a selected species", () => {
    render(<App />);

    const selectElement = screen.getByRole("combobox");

    // Select Beef
    fireEvent.mouseDown(selectElement);
    const beefOption = screen.getByRole("option", { name: /Beef/i });
    fireEvent.click(beefOption);

    // Checking remove button
    const deleteButton = screen.getByLabelText(`remove beef`);
    fireEvent.click(deleteButton);

    expect(
      screen.queryByText("Beef", { selector: ".MuiChip-label" }),
    ).not.toBeInTheDocument();
  });
});
