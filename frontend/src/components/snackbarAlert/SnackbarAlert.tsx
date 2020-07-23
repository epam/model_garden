import React from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

export interface SnackbarAlertProps {
  open: boolean;
  onClose: Function;
  severity: 'success' | 'info' | 'warning' | 'error' | undefined;
  children: React.ReactNode | React.ReactNode[];
}

export const SnackbarAlert: React.FC<SnackbarAlertProps> = ({
  open,
  onClose,
  severity,
  children
}: SnackbarAlertProps) => {
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    onClose(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={handleClose} severity={severity}>
        {children}
      </Alert>
    </Snackbar>
  );
};
