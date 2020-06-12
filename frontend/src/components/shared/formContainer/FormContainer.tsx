import React from 'react';
import { Container, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    padding: 0
  },
  paper: {
    padding: '2.5rem 1.5rem'
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
    <Container maxWidth="sm" className={classes.root}>
      <Paper className={classes.paper} elevation={5}>
        {children}
      </Paper>
    </Container>
  );
};
