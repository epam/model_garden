import React from 'react';
import './FormContainer.css';
import { Container, Paper } from '@material-ui/core';

interface FormContainerProps {
  children: React.ReactNode | React.ReactNode[];
}

export const FormContainer: React.FC<FormContainerProps> = ({ children }: FormContainerProps) => {
  return (
    <Container component={Paper} maxWidth="sm" className="form-container" elevation={5}>
      {children}
    </Container>
  );
};
