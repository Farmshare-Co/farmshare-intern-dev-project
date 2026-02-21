
interface AnnualSummaryProps {
  totalVolume: number;
  totalSavings: number;
  totalCost: number;
}

export default function AnnualSummary({
  totalVolume,
  totalSavings,
  totalCost,
}: AnnualSummaryProps) {
  const netBenefit = totalSavings - totalCost;
  const netIsNegative = netBenefit < 0;

  return (
    <div className="summary">
      <p className="summary__title">Annual Summary</p>

      <div className="summary__rows">
        <div className="summary__row">
          <span className="summary__row-label">Total Annual Volume:</span>
          <span className="summary__row-value">
            {totalVolume.toLocaleString()} lbs
          </span>
        </div>
        <div className="summary__row">
          <span className="summary__row-label">Total Annual Savings:</span>
          <span className="summary__row-value summary__row-value--savings">
            +${totalSavings.toLocaleString()}
          </span>
        </div>
        <div className="summary__row">
          <span className="summary__row-label">Total Annual Cost:</span>
          <span className="summary__row-value summary__row-value--cost">
            −${totalCost.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="summary__net">
        <span className="summary__net-label">Net Annual Benefit:</span>
        <span
          className={`summary__net-value${netIsNegative ? " summary__net-value--negative" : ""}`}
        >
          {netIsNegative ? "−" : "+"}${Math.abs(netBenefit).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
