import React from 'react';
import { makeStyles, Container, Paper } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    padding: 0
  },
  paper: {
    padding: '2.5rem 1.5rem',
    marginBottom: '2rem'
  }
});

interface IFormContainerProps {
  children: React.ReactNode | React.ReactNode[];
}

export const FormContainer: React.FC<IFormContainerProps> = ({
  children
}: IFormContainerProps) => {
  const classes = useStyles();
  return (
    <Container maxWidth="sm" className={classes.root}>
      <Paper className={classes.paper} elevation={5}>
        {children}
      </Paper>
    </Container>
  );
};
