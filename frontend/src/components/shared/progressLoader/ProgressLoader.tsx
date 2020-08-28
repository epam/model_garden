import React from 'react';
import { Spin } from 'antd';
import { useTypedSelector } from '../../../store';
import './styles.scss';

export const ProgressLoader: React.FC = () => {
  const showLoader = useTypedSelector(({ ui }) => ui.showLoader);
  if (!showLoader) return null;
  return (
    <div className="mg-spin-overlay">
      <Spin size="large" />
    </div>
  );
};
