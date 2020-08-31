import React from 'react';
import './styles.scss';

interface FilesCounterProps {
  filesCount: number;
}

export const FilesCounter: React.FC<FilesCounterProps> = ({
  filesCount
}: FilesCounterProps) => {
  return (
    <dl className="mg-file-counter">
      <dt className="mg-file-description"> Files in Queue:</dt>
      <dd className="mg-file-count">{filesCount}</dd>
    </dl>
  );
};
