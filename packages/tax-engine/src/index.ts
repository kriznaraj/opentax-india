export type TaxComputationInput = {
  readonly taxableIncome: number;
  readonly taxRatePercent: number;
};

export function computeFlatTax(input: TaxComputationInput): number {
  return (input.taxableIncome * input.taxRatePercent) / 100;
}
