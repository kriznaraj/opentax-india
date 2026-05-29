export type Form16Summary = {
  readonly grossSalary: number;
};

export function extractGrossSalary(rawText: string): Form16Summary {
  const match = rawText.match(/gross salary[:\s]+(\d+)/i);
  return {
    grossSalary: match ? Number(match[1]) : 0
  };
}
