import jsPDF from "jspdf";
import { AVG_HANGING_WEIGHTS, type EAnimalSpecies } from "../types";
import { calculateHeads, calculateLaborValue } from "./calculations";
import { COST_PER_LB } from "./statics";

import farmShareLogo from "../assets/farmshare_text.svg";

interface ExportPDFParams {
  selectedSpecies: EAnimalSpecies[];
  volumes: Record<EAnimalSpecies, string>;
  timePerAnimal: string;
  hourlyWage: string;
  getTotalVolume: () => number;
  calculateTotalAnnualSavings: () => number;
  calculateTotalAnnualCost: () => number;
}

export const exportPDF = async ({
  selectedSpecies,
  volumes,
  timePerAnimal,
  hourlyWage,
  getTotalVolume,
  calculateTotalAnnualSavings,
  calculateTotalAnnualCost,
}: ExportPDFParams) => {
  const doc = new jsPDF();
  const totalSavings = calculateTotalAnnualSavings();
  const totalCost = calculateTotalAnnualCost();
  const netBenefit = totalSavings - totalCost;
  const pageWidth = doc.internal.pageSize.getWidth();
  const green: [number, number, number] = [0, 107, 60];
  const lightGreen: [number, number, number] = [235, 247, 241];
  const white: [number, number, number] = [255, 255, 255];
  const darkGray: [number, number, number] = [50, 50, 50];
  const lightGray: [number, number, number] = [245, 245, 245];

  // Green header banner
  doc.setFillColor(...green);
  doc.rect(0, 0, pageWidth, 65, "F");

  // Text logo in header — wait for SVG to load before drawing
  const logoW = 80;
  const logoH = 20; // SVG aspect ratio ~4:1
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 200;
  const ctx = canvas.getContext("2d")!;
  await new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 800, 200);
      resolve();
    };
    img.src = farmShareLogo;
  });
  const logoX = (pageWidth - logoW) / 2;
  doc.addImage(canvas.toDataURL("image/png"), "PNG", logoX, 8, logoW, logoH);

  // Title in header
  doc.setTextColor(...white);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Meat Processor Annual Projections", pageWidth / 2, 40, {
    align: "center",
  });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 52, {
    align: "center",
  });

  let y = 78;

  // Table header row
  doc.setFillColor(...green);
  doc.rect(14, y - 5, 182, 9, "F");
  doc.setTextColor(...white);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Species", 16, y);
  doc.text("Weight (lbs)", 55, y);
  doc.text("Heads", 95, y);
  doc.text("Savings ($)", 120, y);
  doc.text("Cost ($)", 152, y);
  doc.text("Net ($)", 178, y);
  y += 9;

  // Data rows with alternating background
  selectedSpecies.forEach((species, i) => {
    const volume = parseFloat(volumes[species] || "0");
    const avgWeight = AVG_HANGING_WEIGHTS[species];
    const heads = calculateHeads(volume, avgWeight);
    const savings = calculateLaborValue(
      heads,
      parseFloat(timePerAnimal),
      parseFloat(hourlyWage)
    );
    const cost = volume * COST_PER_LB;
    const net = savings - cost;

    doc.setFillColor(...(i % 2 === 0 ? white : lightGreen));
    doc.rect(14, y - 5, 182, 9, "F");
    doc.setTextColor(...darkGray);
    doc.setFont("helvetica", "normal");
    doc.text(species.charAt(0).toUpperCase() + species.slice(1), 16, y);
    doc.text(volume.toLocaleString(), 55, y);
    doc.text(heads.toString(), 95, y);
    doc.setTextColor(0, 140, 70);
    doc.text(savings.toFixed(2), 120, y);
    doc.setTextColor(200, 50, 50);
    doc.text(cost.toFixed(2), 152, y);
    doc.setTextColor(
      net >= 0 ? 0 : 200,
      net >= 0 ? 140 : 50,
      net >= 0 ? 70 : 50
    );
    doc.text(net.toFixed(2), 178, y);
    y += 9;
  });

  // Totals row
  y += 2;
  doc.setFillColor(...lightGray);
  doc.rect(14, y - 5, 182, 10, "F");
  doc.setDrawColor(...green);
  doc.rect(14, y - 5, 182, 10, "S");
  doc.setTextColor(...darkGray);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("TOTALS", 16, y + 1);
  doc.text(getTotalVolume().toLocaleString(), 55, y + 1);
  doc.setTextColor(0, 140, 70);
  doc.text(totalSavings.toFixed(2), 120, y + 1);
  doc.setTextColor(200, 50, 50);
  doc.text(totalCost.toFixed(2), 152, y + 1);
  doc.setTextColor(
    netBenefit >= 0 ? 0 : 200,
    netBenefit >= 0 ? 140 : 50,
    netBenefit >= 0 ? 70 : 50
  );
  doc.text(netBenefit.toFixed(2), 178, y + 1);

  // Summary section
  y += 20;
  doc.setFillColor(...lightGreen);
  doc.rect(14, y - 5, 182, 40, "F");
  doc.setTextColor(...darkGray);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Annual Summary", 16, y + 1);
  y += 9;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Total Volume:`, 16, y);
  doc.text(`${getTotalVolume().toLocaleString()} lbs`, 70, y);
  y += 7;
  doc.setTextColor(0, 140, 70);
  doc.text(`Total Savings:`, 16, y);
  doc.text(`$${totalSavings.toFixed(2)}`, 70, y);
  y += 7;
  doc.setTextColor(200, 50, 50);
  doc.text(`Total Cost:`, 16, y);
  doc.text(`$${totalCost.toFixed(2)}`, 70, y);
  y += 7;
  doc.setTextColor(...green);
  doc.setFont("helvetica", "bold");
  doc.text(`Net Benefit:`, 16, y);
  doc.text(`$${netBenefit.toFixed(2)}`, 70, y);

  doc.save("annual_projections.pdf");
};
