import React from 'react';
import './ErrorAlert.css';
import { IconButton, Container, Paper } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import { clearError } from '../../../store/error';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../store';

export const ErrorAlert: React.FC = () => {
  const dispatch = useDispatch();
  const errorMessage = useSelector((state: AppState) => state.error.errorMessage);

  const close = () => {
    dispatch(clearError());
  };

  if (!errorMessage) {
    return null;
  }

  return (
    <div className="error-alert-container">
      <Container className="error-alert" component={Paper} maxWidth="sm" elevation={15}>
        <Alert
          variant="filled"
          severity="error"
          action={
            <IconButton aria-label="close" color="inherit" size="small" onClick={close}>
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
