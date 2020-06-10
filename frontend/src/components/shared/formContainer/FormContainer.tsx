import React from 'react';
import { Container, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    paddingTop: '2.5rem',
    paddingBottom: '2.5rem'
  }
});

interface FormContainerProps {
  children: React.ReactNode | React.ReactNode[];
}

export const FormContainer: React.FC<FormContainerProps> = ({
  children
}: FormContainerProps) => {
  const classes = useStyles();
  return (
    <Container
      component={Paper}
      maxWidth="sm"
      className={classes.root}
      elevation={5}
    >
      {children}
    </Container>
  );
};
