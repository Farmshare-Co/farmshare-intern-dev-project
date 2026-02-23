import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Calculator from "./pages/Calculator";
import FarmProvider from "./context/FarmContext";
import * as exportCSVModule from "./utils/exportCSV";
import * as exportPDFModule from "./utils/exportPDF";

describe("Meat Processor Value Calculator", () => {
  beforeEach(() => {
    // Clear localStorage before each test to ensure clean state
    localStorage.clear();
  });

  it("renders the calculator title", () => {
    render(
      <FarmProvider>
        <Calculator />
      </FarmProvider>
    );
    expect(screen.getByText("Value Calculator")).toBeInTheDocument();
  });

  it("displays the multi-select dropdown and summary", () => {
    render(
      <FarmProvider>
        <Calculator />
      </FarmProvider>
    );
    expect(screen.getAllByRole("combobox")[0]).toBeInTheDocument();
    expect(screen.getByText("Summary")).toBeInTheDocument();
    expect(screen.getByText("Total Annual Savings")).toBeInTheDocument();
    expect(screen.getByText("Total Annual Cost")).toBeInTheDocument();
  });

  it("shows volume inputs when species are selected", () => {
    render(
      <FarmProvider>
        <Calculator />
      </FarmProvider>
    );

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
    render(
      <FarmProvider>
        <Calculator />
      </FarmProvider>
    );

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
    render(
      <FarmProvider>
        <Calculator />
      </FarmProvider>
    );

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
    render(
      <FarmProvider>
        <Calculator />
      </FarmProvider>
    );

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
    render(
      <FarmProvider>
        <Calculator />
      </FarmProvider>
    );

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

  it("should clear all data when Clear All is confirmed", () => {
    render(
      <FarmProvider>
        <Calculator />
      </FarmProvider>
    );

    const selectElement = screen.getAllByRole("combobox")[0];

    // select beef
    fireEvent.mouseDown(selectElement);
    const beefOption = screen.getByRole("option", { name: /Beef/i });
    fireEvent.click(beefOption);
    fireEvent.keyDown(screen.getByRole("listbox"), { key: "Escape" });

    // enter the beef volume
    const volumeInput = screen.getByLabelText(
      /Total Annual Hanging Weight \(lbs\)/i
    );
    fireEvent.change(volumeInput, { target: { value: "1000" } });

    // verify beef is selected and volume is entered
    expect(
      screen.getByText("Beef", { selector: ".MuiChip-label" })
    ).toBeInTheDocument();
    expect(volumeInput).toHaveValue(1000);

    // click Clear All button
    const clearAllButton = screen.getByRole("button", { name: /Clear All/i });
    fireEvent.click(clearAllButton);

    // verify dialog appears
    expect(screen.getByText("Clear All Data?")).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to clear all selected species/i)
    ).toBeInTheDocument();

    // click confirm in dialog
    const confirmButton = screen.getByRole("button", { name: /Clear All/i });
    fireEvent.click(confirmButton);

    // verify data is cleared
    expect(
      screen.queryByText("Beef", { selector: ".MuiChip-label" })
    ).not.toBeInTheDocument();
  });

  it("should cancel clear all when Cancel is clicked", () => {
    render(
      <FarmProvider>
        <Calculator />
      </FarmProvider>
    );

    const selectElement = screen.getAllByRole("combobox")[0];

    // select Beef
    fireEvent.mouseDown(selectElement);
    const beefOption = screen.getByRole("option", { name: /Beef/i });
    fireEvent.click(beefOption);
    fireEvent.keyDown(screen.getByRole("listbox"), { key: "Escape" });

    // enter volume for beef
    const volumeInput = screen.getByLabelText(
      /Total Annual Hanging Weight \(lbs\)/i
    );
    fireEvent.change(volumeInput, { target: { value: "1000" } });

    // click Clear All button
    const clearAllButton = screen.getByRole("button", { name: /Clear All/i });
    fireEvent.click(clearAllButton);

    // verify dialog appears
    expect(screen.getByText("Clear All Data?")).toBeInTheDocument();

    // click Cancel in dialog
    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelButton);

    // verify data is NOT cleared
    expect(
      screen.getByText("Beef", { selector: ".MuiChip-label" })
    ).toBeInTheDocument();
    expect(volumeInput).toHaveValue(1000);
  });

  describe("Input Validation", () => {
    it("should show error for negative volume values", () => {
      render(
        <FarmProvider>
          <Calculator />
        </FarmProvider>
      );

      const selectElement = screen.getAllByRole("combobox")[0];

      // select Beef
      fireEvent.mouseDown(selectElement);
      const beefOption = screen.getByRole("option", { name: /Beef/i });
      fireEvent.click(beefOption);
      fireEvent.keyDown(screen.getByRole("listbox"), { key: "Escape" });

      // enter negative volume
      const volumeInput = screen.getByLabelText(
        /Total Annual Hanging Weight \(lbs\)/i
      );
      fireEvent.change(volumeInput, { target: { value: "-100" } });

      // verify error message appears
      expect(
        screen.getByText("Enter a value between 0 and 10,000,000")
      ).toBeInTheDocument();
    });

    it("should show error for volume exceeding maximum value", () => {
      render(
        <FarmProvider>
          <Calculator />
        </FarmProvider>
      );

      const selectElement = screen.getAllByRole("combobox")[0];

      // select Beef
      fireEvent.mouseDown(selectElement);
      const beefOption = screen.getByRole("option", { name: /Beef/i });
      fireEvent.click(beefOption);
      fireEvent.keyDown(screen.getByRole("listbox"), { key: "Escape" });

      // enter volume exceeding max
      const volumeInput = screen.getByLabelText(
        /Total Annual Hanging Weight \(lbs\)/i
      );
      fireEvent.change(volumeInput, { target: { value: "10000001" } });

      // verify error message appears
      expect(
        screen.getByText("Enter a value between 0 and 10,000,000")
      ).toBeInTheDocument();
    });

    it("should not show error for valid volume values", () => {
      render(
        <FarmProvider>
          <Calculator />
        </FarmProvider>
      );

      const selectElement = screen.getAllByRole("combobox")[0];

      // select Beef
      fireEvent.mouseDown(selectElement);
      const beefOption = screen.getByRole("option", { name: /Beef/i });
      fireEvent.click(beefOption);
      fireEvent.keyDown(screen.getByRole("listbox"), { key: "Escape" });

      // enter valid volume
      const volumeInput = screen.getByLabelText(
        /Total Annual Hanging Weight \(lbs\)/i
      );
      fireEvent.change(volumeInput, { target: { value: "5000" } });

      // verify no error message
      expect(
        screen.queryByText("Enter a value between 0 and 10,000,000")
      ).not.toBeInTheDocument();
    });

    it("should show error for time per animal below minimum", () => {
      render(
        <FarmProvider>
          <Calculator />
        </FarmProvider>
      );

      // open advanced settings
      const expandButton = screen.getByRole("button", { name: "" });
      fireEvent.click(expandButton);

      // enter time below minimum
      const timeInput = screen.getByLabelText(/Time Savings per Animal/i);
      fireEvent.change(timeInput, { target: { value: "0" } });

      // verify error message appears
      expect(
        screen.getByText("Enter a value between 1 minute and 480 minutes")
      ).toBeInTheDocument();
    });

    it("should show error for time per animal above maximum", () => {
      render(
        <FarmProvider>
          <Calculator />
        </FarmProvider>
      );

      // open advanced settings
      const expandButton = screen.getByRole("button", { name: "" });
      fireEvent.click(expandButton);

      // enter time above maximum
      const timeInput = screen.getByLabelText(/Time Savings per Animal/i);
      fireEvent.change(timeInput, { target: { value: "500" } });

      // verify error message appears
      expect(
        screen.getByText("Enter a value between 1 minute and 480 minutes")
      ).toBeInTheDocument();
    });

    it("should show error for hourly wage below minimum", () => {
      render(
        <FarmProvider>
          <Calculator />
        </FarmProvider>
      );

      // open advanced settings
      const expandButton = screen.getByRole("button", { name: "" });
      fireEvent.click(expandButton);

      // enter wage below minimum
      const wageInput = screen.getByLabelText(/Average Hourly Wage/i);
      fireEvent.change(wageInput, { target: { value: "0" } });

      // verify error message appears
      expect(
        screen.getByText("Enter a value between $7.25 and $200")
      ).toBeInTheDocument();
    });

    it("should show error for hourly wage above maximum", () => {
      render(
        <FarmProvider>
          <Calculator />
        </FarmProvider>
      );

      // open advanced settings
      const expandButton = screen.getByRole("button", { name: "" });
      fireEvent.click(expandButton);

      // enter wage above maximum
      const wageInput = screen.getByLabelText(/Average Hourly Wage/i);
      fireEvent.change(wageInput, { target: { value: "250" } });

      // verify error message appears
      expect(
        screen.getByText("Enter a value between $7.25 and $200")
      ).toBeInTheDocument();
    });

    it("should not show error for valid advanced settings values", () => {
      render(
        <FarmProvider>
          <Calculator />
        </FarmProvider>
      );

      // open advanced settings
      const expandButton = screen.getByRole("button", { name: "" });
      fireEvent.click(expandButton);

      // enter valid time
      const timeInput = screen.getByLabelText(/Time Savings per Animal/i);
      fireEvent.change(timeInput, { target: { value: "45" } });

      // enter valid wage
      const wageInput = screen.getByLabelText(/Average Hourly Wage/i);
      fireEvent.change(wageInput, { target: { value: "25" } });

      // verify no error messages
      expect(
        screen.queryByText("Enter a value between 1 minute and 480 minutes")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Enter a value between $7.25 and $200")
      ).not.toBeInTheDocument();
    });
  });

  describe("Export Functionality", () => {
    it("should show error when trying to export CSV without selecting species", () => {
      render(
        <FarmProvider>
          <Calculator />
        </FarmProvider>
      );

      // try to export without selecting species
      const exportCSVButton = screen.getByRole("button", {
        name: /Export CSV/i,
      });
      fireEvent.click(exportCSVButton);

      // verify error message appears
      expect(
        screen.getByText("Please select at least one species before exporting.")
      ).toBeInTheDocument();
    });

    it("should show error when trying to export PDF without selecting species", () => {
      render(
        <FarmProvider>
          <Calculator />
        </FarmProvider>
      );

      // try to export without selecting species
      const exportPDFButton = screen.getByRole("button", {
        name: /Export PDF/i,
      });
      fireEvent.click(exportPDFButton);

      // verify error message appears
      expect(
        screen.getByText("Please select at least one species before exporting.")
      ).toBeInTheDocument();
    });

    it("should show error when trying to export CSV with empty volume data", () => {
      render(
        <FarmProvider>
          <Calculator />
        </FarmProvider>
      );

      const selectElement = screen.getAllByRole("combobox")[0];

      // select Beef but don't enter volume
      fireEvent.mouseDown(selectElement);
      const beefOption = screen.getByRole("option", { name: /Beef/i });
      fireEvent.click(beefOption);
      fireEvent.keyDown(screen.getByRole("listbox"), { key: "Escape" });

      // try to export
      const exportCSVButton = screen.getByRole("button", {
        name: /Export CSV/i,
      });
      fireEvent.click(exportCSVButton);

      // verify error message appears
      expect(
        screen.getByText("Volume data can't be empty.")
      ).toBeInTheDocument();
    });

    it("should show error when trying to export PDF with empty volume data", () => {
      render(
        <FarmProvider>
          <Calculator />
        </FarmProvider>
      );

      const selectElement = screen.getAllByRole("combobox")[0];

      // select Beef but don't enter volume
      fireEvent.mouseDown(selectElement);
      const beefOption = screen.getByRole("option", { name: /Beef/i });
      fireEvent.click(beefOption);
      fireEvent.keyDown(screen.getByRole("listbox"), { key: "Escape" });

      // try to export
      const exportPDFButton = screen.getByRole("button", {
        name: /Export PDF/i,
      });
      fireEvent.click(exportPDFButton);

      // verify error message appears
      expect(
        screen.getByText("Volume data can't be empty.")
      ).toBeInTheDocument();
    });

    it("should successfully export CSV with valid data", async () => {
      const exportCSVSpy = vi.spyOn(exportCSVModule, "exportCSV");

      render(
        <FarmProvider>
          <Calculator />
        </FarmProvider>
      );

      const selectElement = screen.getAllByRole("combobox")[0];

      // select Beef and enter volume
      fireEvent.mouseDown(selectElement);
      const beefOption = screen.getByRole("option", { name: /Beef/i });
      fireEvent.click(beefOption);
      fireEvent.keyDown(screen.getByRole("listbox"), { key: "Escape" });

      const volumeInput = screen.getByLabelText(
        /Total Annual Hanging Weight \(lbs\)/i
      );
      fireEvent.change(volumeInput, { target: { value: "1000" } });

      // export CSV
      const exportCSVButton = screen.getByRole("button", {
        name: /Export CSV/i,
      });
      fireEvent.click(exportCSVButton);

      // verify export function was called
      expect(exportCSVSpy).toHaveBeenCalled();

      // verify success message appears
      await waitFor(() => {
        expect(
          screen.getByText("CSV exported successfully!")
        ).toBeInTheDocument();
      });

      exportCSVSpy.mockRestore();
    });

    it("should successfully export PDF with valid data", async () => {
      const exportPDFSpy = vi
        .spyOn(exportPDFModule, "exportPDF")
        .mockResolvedValue();

      render(
        <FarmProvider>
          <Calculator />
        </FarmProvider>
      );

      const selectElement = screen.getAllByRole("combobox")[0];

      // select Beef and enter volume
      fireEvent.mouseDown(selectElement);
      const beefOption = screen.getByRole("option", { name: /Beef/i });
      fireEvent.click(beefOption);
      fireEvent.keyDown(screen.getByRole("listbox"), { key: "Escape" });

      const volumeInput = screen.getByLabelText(
        /Total Annual Hanging Weight \(lbs\)/i
      );
      fireEvent.change(volumeInput, { target: { value: "1000" } });

      // export PDF
      const exportPDFButton = screen.getByRole("button", {
        name: /Export PDF/i,
      });
      fireEvent.click(exportPDFButton);

      // verify export function was called
      expect(exportPDFSpy).toHaveBeenCalled();

      // verify success message appears
      await waitFor(() => {
        expect(
          screen.getByText("PDF exported successfully!")
        ).toBeInTheDocument();
      });

      exportPDFSpy.mockRestore();
    });

    it("should show error when trying to export with invalid volume data", () => {
      render(
        <FarmProvider>
          <Calculator />
        </FarmProvider>
      );

      const selectElement = screen.getAllByRole("combobox")[0];

      // select Beef and enter invalid volume
      fireEvent.mouseDown(selectElement);
      const beefOption = screen.getByRole("option", { name: /Beef/i });
      fireEvent.click(beefOption);
      fireEvent.keyDown(screen.getByRole("listbox"), { key: "Escape" });

      const volumeInput = screen.getByLabelText(
        /Total Annual Hanging Weight \(lbs\)/i
      );
      fireEvent.change(volumeInput, { target: { value: "-100" } });

      // try to export CSV
      const exportCSVButton = screen.getByRole("button", {
        name: /Export CSV/i,
      });
      fireEvent.click(exportCSVButton);

      // verify error message appears
      expect(
        screen.getByText("Please fix validation errors.")
      ).toBeInTheDocument();
    });
  });

  describe("LocalStorage Persistence", () => {
    it("should save custom preset to localStorage", async () => {
      render(
        <FarmProvider>
          <Calculator />
        </FarmProvider>
      );

      const selectElement = screen.getAllByRole("combobox")[0];

      // select Beef and enter volume
      fireEvent.mouseDown(selectElement);
      const beefOption = screen.getByRole("option", { name: /Beef/i });
      fireEvent.click(beefOption);
      fireEvent.keyDown(screen.getByRole("listbox"), { key: "Escape" });

      const volumeInput = screen.getByLabelText(
        /Total Annual Hanging Weight \(lbs\)/i
      );
      fireEvent.change(volumeInput, { target: { value: "5000" } });

      // click Save button to open dialog
      const saveButton = screen.getByRole("button", { name: /Save/i });
      fireEvent.click(saveButton);

      // enter preset name
      const presetNameInput = screen.getByLabelText(/Preset Name/i);
      fireEvent.change(presetNameInput, {
        target: { value: "My Test Preset" },
      });

      // save the preset
      const savePresetButton = screen.getByRole("button", {
        name: /Save Preset/i,
      });
      fireEvent.click(savePresetButton);

      // verify localStorage was updated
      const savedPresets = localStorage.getItem("farmshare-custom-presets");
      expect(savedPresets).toBeTruthy();

      const presets = JSON.parse(savedPresets!);
      expect(presets).toHaveLength(1);
      expect(presets[0].name).toBe("My Test Preset");
      expect(presets[0].species).toContain("beef");
      expect(presets[0].volumes.beef).toBe("5000");

      // verify success message
      await waitFor(() => {
        expect(
          screen.getByText(/Preset "My Test Preset" saved successfully!/i)
        ).toBeInTheDocument();
      });
    });

    it("should load custom presets from localStorage on mount", () => {
      // pre-populate localStorage with a custom preset
      const mockPreset = {
        name: "Existing Preset",
        species: ["lamb"],
        volumes: { lamb: "2000" },
      };
      localStorage.setItem(
        "farmshare-custom-presets",
        JSON.stringify([mockPreset])
      );

      render(
        <FarmProvider>
          <Calculator />
        </FarmProvider>
      );

      // open the Quick Start Templates menu
      const templatesButton = screen.getByText("Quick Start Templates");
      fireEvent.click(templatesButton);

      // verify the custom preset appears in the menu
      expect(screen.getByText("Your Templates")).toBeInTheDocument();
      expect(screen.getByText("Existing Preset")).toBeInTheDocument();
    });
  });

  describe("Species Presets", () => {
    // loading Default Presets
    it("should load preset data when selecting a default preset", async () => {
      render(
        <FarmProvider>
          <Calculator />
        </FarmProvider>
      );

      // open Quick Start Templates menu
      const templatesButton = screen.getByText("Quick Start Templates");
      fireEvent.click(templatesButton);

      // select "Beef-Focused Processor" preset
      const beefPreset = screen.getByText("Beef-Focused Processor");
      fireEvent.click(beefPreset);

      // verify success message appears
      await waitFor(() => {
        expect(
          screen.getByText("Preset applied successfully!")
        ).toBeInTheDocument();
      });

      // verify Beef species chip appears
      expect(
        screen.getByText("Beef", { selector: ".MuiChip-label" })
      ).toBeInTheDocument();

      // verify volume input has the preset value (10000)
      const volumeInput = screen.getByLabelText(
        /Total Annual Hanging Weight \(lbs\)/i
      );
      expect(volumeInput).toHaveValue(10000);
    });

    // preset Menu Display
    it("should display all default preset options in menu", () => {
      render(
        <FarmProvider>
          <Calculator />
        </FarmProvider>
      );

      // open Quick Start Templates menu
      const templatesButton = screen.getByText("Quick Start Templates");
      fireEvent.click(templatesButton);

      // verify "Default Templates" section header
      expect(screen.getByText("Default Templates")).toBeInTheDocument();

      // verify all default presets appear
      expect(screen.getByText("Beef-Focused Processor")).toBeInTheDocument();
      expect(screen.getByText("Mixed Operation")).toBeInTheDocument();
      expect(screen.getByText("Small Farm Processor")).toBeInTheDocument();
      expect(screen.getByText("Large Commercial")).toBeInTheDocument();

      // verify "None - Start from scratch" option
      expect(screen.getByText("None - Start from scratch")).toBeInTheDocument();
    });

    // custom Preset Creation
    it("should save and display custom presets", async () => {
      render(
        <FarmProvider>
          <Calculator />
        </FarmProvider>
      );

      const selectElement = screen.getAllByRole("combobox")[0];

      // select Lamb and enter volume
      fireEvent.mouseDown(selectElement);
      const lambOption = screen.getByRole("option", { name: /Lamb/i });
      fireEvent.click(lambOption);
      fireEvent.keyDown(screen.getByRole("listbox"), { key: "Escape" });

      const volumeInput = screen.getByLabelText(
        /Total Annual Hanging Weight \(lbs\)/i
      );
      fireEvent.change(volumeInput, { target: { value: "3000" } });

      // click Save button to open dialog
      const saveButton = screen.getByRole("button", { name: /Save/i });
      fireEvent.click(saveButton);

      // enter preset name
      const presetNameInput = screen.getByLabelText(/Preset Name/i);
      fireEvent.change(presetNameInput, {
        target: { value: "My Lamb Setup" },
      });

      // save the preset
      const savePresetButton = screen.getByRole("button", {
        name: /Save Preset/i,
      });
      fireEvent.click(savePresetButton);

      // verify success message
      await waitFor(() => {
        expect(
          screen.getByText(/Preset "My Lamb Setup" saved successfully!/i)
        ).toBeInTheDocument();
      });

      // open Quick Start Templates menu
      const templatesButton = screen.getByText("Quick Start Templates");
      fireEvent.click(templatesButton);

      // verify custom preset appears in "Your Templates" section
      expect(screen.getByText("Your Templates")).toBeInTheDocument();
      expect(screen.getByText("My Lamb Setup")).toBeInTheDocument();
    });
  });

  // Monthly/Annual View Mode
  describe("Monthly/Annual View Mode", () => {
    it("should toggle between annual and monthly view modes", () => {
      render(
        <FarmProvider>
          <Calculator />
        </FarmProvider>
      );

      // verify both view mode buttons exist
      const annualButton = screen.getByRole("button", { name: /Annual/i });
      const monthlyButton = screen.getByRole("button", { name: /Monthly/i });

      expect(annualButton).toBeInTheDocument();
      expect(monthlyButton).toBeInTheDocument();

      // click monthly button
      fireEvent.click(monthlyButton);
      expect(monthlyButton).toBeInTheDocument();

      // click annual button
      fireEvent.click(annualButton);
      expect(annualButton).toBeInTheDocument();
    });

    it("should display monthly values as 1/12 of annual when in monthly mode", () => {
      render(
        <FarmProvider>
          <Calculator />
        </FarmProvider>
      );

      const selectElement = screen.getAllByRole("combobox")[0];

      // select Beef
      fireEvent.mouseDown(selectElement);
      const beefOption = screen.getByRole("option", { name: /Beef/i });
      fireEvent.click(beefOption);
      fireEvent.keyDown(screen.getByRole("listbox"), { key: "Escape" });

      // enter volume (12000 lbs for easy division)
      const volumeInput = screen.getByLabelText(
        /Total Annual Hanging Weight \(lbs\)/i
      );
      fireEvent.change(volumeInput, { target: { value: "12000" } });

      // get annual savings value (easier to find than net benefit)
      const annualSavingsText = screen.getByText(/Total Annual Savings/i);
      const annualSavingsContainer = annualSavingsText.parentElement;
      const annualSavingsValue = annualSavingsContainer?.querySelector(
        ".MuiTypography-root:not(:first-child)"
      )?.textContent;
      const annualAmount = parseFloat(
        annualSavingsValue?.replace(/[$,]/g, "") || "0"
      );

      // switch to monthly view
      const monthlyButton = screen.getByRole("button", { name: /Monthly/i });
      fireEvent.click(monthlyButton);

      // get monthly savings value
      const monthlySavingsText = screen.getByText(/Total Monthly Savings/i);
      const monthlySavingsContainer = monthlySavingsText.parentElement;
      const monthlySavingsValue = monthlySavingsContainer?.querySelector(
        ".MuiTypography-root:not(:first-child)"
      )?.textContent;
      const monthlyAmount = parseFloat(
        monthlySavingsValue?.replace(/[$,]/g, "") || "0"
      );

      // verify monthly value is 1/12 of annual value (with small tolerance for rounding)
      expect(monthlyAmount).toBeCloseTo(annualAmount / 12, 2);
    });

    it("should export data with correct view mode", async () => {
      const exportCSVSpy = vi.spyOn(
        await import("./utils/exportCSV"),
        "exportCSV"
      );
      const exportPDFSpy = vi.spyOn(
        await import("./utils/exportPDF"),
        "exportPDF"
      );

      render(
        <FarmProvider>
          <Calculator />
        </FarmProvider>
      );

      const selectElement = screen.getAllByRole("combobox")[0];

      // select Beef and enter volume
      fireEvent.mouseDown(selectElement);
      const beefOption = screen.getByRole("option", { name: /Beef/i });
      fireEvent.click(beefOption);
      fireEvent.keyDown(screen.getByRole("listbox"), { key: "Escape" });

      const volumeInput = screen.getByLabelText(
        /Total Annual Hanging Weight \(lbs\)/i
      );
      fireEvent.change(volumeInput, { target: { value: "10000" } });

      // switch to monthly view
      const monthlyButton = screen.getByRole("button", { name: /Monthly/i });
      fireEvent.click(monthlyButton);

      // export CSV in monthly mode
      const exportCSVButton = screen.getByRole("button", {
        name: /Export CSV/i,
      });
      fireEvent.click(exportCSVButton);

      // verify exportCSV was called with viewMode: "monthly"
      await waitFor(() => {
        expect(exportCSVSpy).toHaveBeenCalled();
        const callArgs = exportCSVSpy.mock.calls[0][0] as { viewMode: string };
        expect(callArgs.viewMode).toBe("monthly");
      });

      // export PDF in monthly mode
      const exportPDFButton = screen.getByRole("button", {
        name: /Export PDF/i,
      });
      fireEvent.click(exportPDFButton);

      // verify exportPDF was called with viewMode: "monthly"
      await waitFor(() => {
        expect(exportPDFSpy).toHaveBeenCalled();
        const callArgs = exportPDFSpy.mock.calls[0][0] as { viewMode: string };
        expect(callArgs.viewMode).toBe("monthly");
      });

      // switch to annual view
      const annualButton = screen.getByRole("button", { name: /Annual/i });
      fireEvent.click(annualButton);

      // export CSV in annual mode
      fireEvent.click(exportCSVButton);

      // verify exportCSV was called with viewMode: "annual"
      await waitFor(() => {
        const callArgs = exportCSVSpy.mock.calls[1][0] as { viewMode: string };
        expect(callArgs.viewMode).toBe("annual");
      });

      exportCSVSpy.mockRestore();
      exportPDFSpy.mockRestore();
    });
  });
});
