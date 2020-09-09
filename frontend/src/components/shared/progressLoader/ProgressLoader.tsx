import React from 'react';
import { Spin } from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import { useTypedSelector } from '../../../store';

const useStyles = makeStyles({
  root: {
    position: 'fixed',
    zIndex: 1300,
    right: '0',
    bottom: '0',
    top: '0',
    left: '0',
    padding: '2rem',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export const ProgressLoader: React.FC = () => {
  const showLoader = useTypedSelector(({ ui }) => ui.showLoader);
  const classes = useStyles();
  if (!showLoader) {
    return null;
  }
  return (
    <div className={classes.root}>
      <Spin size="large" />
    </div>
  );
};
