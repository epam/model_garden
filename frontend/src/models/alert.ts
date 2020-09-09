export type Severity = 'success' | 'info' | 'warning' | 'error' | undefined;

export interface Alert {
  show: boolean;
  severity: Severity;
  message: string;
}
