import type { CalculatorInputs } from "../types";
import type { ProjectionResult } from "./projection";

const formatNumber = (value: number): string =>
  value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const toHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export const printProjectionReport = (
  projection: ProjectionResult,
  inputs: CalculatorInputs,
): void => {
  const reportWindow = window.open("", "_blank", "width=1100,height=900");
  if (!reportWindow) {
    return;
  }

  const rowsHtml = projection.rows
    .map(
      (row) => `
        <tr>
          <td>${toHtml(row.species)}</td>
          <td class="num">${formatNumber(row.annualHeads)}</td>
          <td class="num">${formatNumber(row.annualVolume)}</td>
          <td class="num">$${formatNumber(row.annualSavings)}</td>
          <td class="num">$${formatNumber(row.annualCost)}</td>
          <td class="num">$${formatNumber(row.annualNetBenefit)}</td>
          <td class="num">${formatNumber(row.monthlyVolume)}</td>
          <td class="num">$${formatNumber(row.monthlySavings)}</td>
          <td class="num">$${formatNumber(row.monthlyCost)}</td>
          <td class="num">$${formatNumber(row.monthlyNetBenefit)}</td>
        </tr>
      `,
    )
    .join("");

  reportWindow.document.write(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Farmshare Projection Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 24px; color: #111; }
          h1, h2 { margin: 0 0 8px; }
          h2 { margin-top: 24px; }
          p { margin: 0 0 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          th, td { border: 1px solid #d9d9d9; padding: 8px; font-size: 13px; }
          th { background: #f4f5f7; text-align: left; }
          .num { text-align: right; white-space: nowrap; }
          .cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
          .card { border: 1px solid #d9d9d9; border-radius: 8px; padding: 12px; }
          @media print {
            body { margin: 12px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>Farmshare Value Calculator Report</h1>
        <p>Generated: ${toHtml(new Date().toLocaleString())}</p>

        <h2>Assumptions</h2>
        <div class="cards">
          <div class="card">
            <strong>Time Savings per Animal:</strong>
            <div>${toHtml(inputs.timePerAnimal)} minutes</div>
          </div>
          <div class="card">
            <strong>Average Hourly Wage:</strong>
            <div>$${toHtml(inputs.hourlyWage)}</div>
          </div>
        </div>

        <h2>Annual Summary</h2>
        <div class="cards">
          <div class="card"><strong>Annual Volume</strong><div>${formatNumber(projection.totals.annualVolume)} lbs</div></div>
          <div class="card"><strong>Annual Savings</strong><div>$${formatNumber(projection.totals.annualSavings)}</div></div>
          <div class="card"><strong>Annual Cost</strong><div>$${formatNumber(projection.totals.annualCost)}</div></div>
          <div class="card"><strong>Annual Net Benefit</strong><div>$${formatNumber(projection.totals.annualNetBenefit)}</div></div>
        </div>

        <h2>Monthly Summary</h2>
        <div class="cards">
          <div class="card"><strong>Monthly Volume</strong><div>${formatNumber(projection.totals.monthlyVolume)} lbs</div></div>
          <div class="card"><strong>Monthly Savings</strong><div>$${formatNumber(projection.totals.monthlySavings)}</div></div>
          <div class="card"><strong>Monthly Cost</strong><div>$${formatNumber(projection.totals.monthlyCost)}</div></div>
          <div class="card"><strong>Monthly Net Benefit</strong><div>$${formatNumber(projection.totals.monthlyNetBenefit)}</div></div>
        </div>

        <h2>Species Breakdown</h2>
        <table>
          <thead>
            <tr>
              <th>Species</th>
              <th class="num">Annual Heads</th>
              <th class="num">Annual Volume</th>
              <th class="num">Annual Savings</th>
              <th class="num">Annual Cost</th>
              <th class="num">Annual Net</th>
              <th class="num">Monthly Volume</th>
              <th class="num">Monthly Savings</th>
              <th class="num">Monthly Cost</th>
              <th class="num">Monthly Net</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || '<tr><td colspan="10" style="text-align:center;">No species selected.</td></tr>'}
          </tbody>
        </table>

        <div class="no-print" style="margin-top: 24px;">
          <button onclick="window.print()">Print</button>
        </div>
      </body>
    </html>
  `);
  reportWindow.document.close();
  reportWindow.focus();
};
