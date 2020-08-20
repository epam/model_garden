import React from 'react';
import { useDispatch } from 'react-redux';
import { IconButton, Container, Paper } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import { clearError } from '../../../store/error';
import { useTypedSelector } from '../../../store';
import './ErrorAlert.css';

export const ErrorAlert: React.FC = () => {
  const dispatch = useDispatch();
  const errorMessage = useTypedSelector(({ error }) => error);

  const close = () => {
    dispatch(clearError());
  };

  if (!errorMessage) {
    return null;
  }

  return (
    <div className="error-alert-container">
      <Container
        className="error-alert"
        component={Paper}
        maxWidth="sm"
        elevation={15}
      >
        <Alert
          variant="filled"
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={close}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {errorMessage}
        </Alert>
      </Container>
    </div>
  );
};
