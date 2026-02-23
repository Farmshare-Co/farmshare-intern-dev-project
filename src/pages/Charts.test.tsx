import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Charts from "./Charts";
import FarmProvider from "../context/FarmContext";

describe("Charts Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // test for empty state
  it("should show empty state when no species selected", () => {
    render(
      <MemoryRouter>
        <FarmProvider>
          <Charts />
        </FarmProvider>
      </MemoryRouter>
    );

    // verify empty state is displayed
    expect(screen.getByText("No charts to display")).toBeInTheDocument();
    expect(
      screen.getByText(
        /In order for you to see the charts, please select at least one species and enter volume data from the Calculator page/i
      )
    ).toBeInTheDocument();

    // verify the icon is present
    const icon = screen.getByTestId("Inventory2Icon");
    expect(icon).toBeInTheDocument();

    // verify the button to go to calculator is present
    const calculatorButton = screen.getByRole("button", {
      name: /Value Calculator/i,
    });
    expect(calculatorButton).toBeInTheDocument();
  });

  // test for view Mode Toggle (buttons exist and are clickable)
  it("should have annual and monthly toggle buttons", () => {
    render(
      <MemoryRouter>
        <FarmProvider>
          <Charts />
        </FarmProvider>
      </MemoryRouter>
    );

    // verify both toggle buttons exist
    const annualButton = screen.getByRole("button", { name: /Annual/i });
    const monthlyButton = screen.getByRole("button", { name: /Monthly/i });

    expect(annualButton).toBeInTheDocument();
    expect(monthlyButton).toBeInTheDocument();

    // verify buttons are clickable
    fireEvent.click(monthlyButton);
    expect(monthlyButton).toBeInTheDocument();

    fireEvent.click(annualButton);
    expect(annualButton).toBeInTheDocument();
  });

  // test for chart title and structure
  it("should render chart page structure with title and controls", () => {
    render(
      <MemoryRouter>
        <FarmProvider>
          <Charts />
        </FarmProvider>
      </MemoryRouter>
    );

    // verify page title
    expect(screen.getByText("Charts & Analytics")).toBeInTheDocument();

    // verify description
    expect(
      screen.getByText(
        /Visualize your savings and costs with interactive charts/i
      )
    ).toBeInTheDocument();

    // verify view mode buttons are present
    expect(screen.getByRole("button", { name: /Annual/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Monthly/i })
    ).toBeInTheDocument();
  });
});
