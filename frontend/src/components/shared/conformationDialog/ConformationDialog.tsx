import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/core/styles';
import amber from '@material-ui/core/colors/amber';

interface ConformationDialogProps {
  title: string;
  children?: React.ReactNode | React.ReactNode[] | undefined;
  closeButton?: string | undefined;
  confirmButton?: string | undefined;
  handleConfirm?: any;
  open: boolean;
  setOpen: Function;
}

const useStyles = makeStyles(() => ({
  actions: {
    justifyContent: 'flex-end'
  },
  dangerButton: {
    backgroundColor: amber[800],
    '&:hover': {
      backgroundColor: amber[900]
    }
  },
  warningIcon: {
    color: amber[800],
    fontSize: '2.8rem',
    marginRight: '0.8rem',
    verticalAlign: 'middle'
  }
}));

export const ConformationDialog: React.FC<ConformationDialogProps> = ({
  title,
  children,
  closeButton,
  confirmButton,
  handleConfirm,
  open,
  setOpen
}: ConformationDialogProps) => {
  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-content"
      maxWidth="xs"
    >
      <DialogTitle id="dialog-title">
        <WarningIcon className={classes.warningIcon} />
        {title}
      </DialogTitle>
      <DialogContent id="dialog-content">{children}</DialogContent>
      <DialogActions className={classes.actions}>
        {closeButton && (
          <Button onClick={handleClose} variant="contained" color="primary">
            {closeButton}
          </Button>
        )}

        {confirmButton && (
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="secondary"
            autoFocus
            className={classes.dangerButton}
          >
            {confirmButton}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
