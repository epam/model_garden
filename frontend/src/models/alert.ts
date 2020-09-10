export type TSeverity = 'success' | 'info' | 'warning' | 'error' | undefined;

export interface IAlert {
  show: boolean;
  severity: TSeverity;
  message: string;
}
