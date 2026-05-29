export type ItrPayload = {
  readonly taxpayer: {
    readonly pan: string;
  };
};

export function buildItrPayload(pan: string): ItrPayload {
  return {
    taxpayer: {
      pan
    }
  };
}
