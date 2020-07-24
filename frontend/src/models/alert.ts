export type Severity = 'success' | 'info' | 'warning' | 'error' | undefined;

export type Alert = {
  show: boolean;
  severity: Severity;
  message: string;
};
