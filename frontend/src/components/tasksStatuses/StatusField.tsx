import React, { useState, FC } from 'react';
import { Tooltip } from 'antd';
import { IconButton } from '@material-ui/core';
import { FileCopy } from '@material-ui/icons';

interface Props {
  record: { error: string; status: string };
  text: string;
}

const StatusField: FC<Props> = ({ record, text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(record.error);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (record.status !== 'failed') {
    return <>{text}</>;
  }

  return (
    <Tooltip title={record.error}>
      <span className="task-tooltip">
        {copied ? 'copied!' : text}
        <IconButton
          aria-label="delete"
          style={{ margin: '-12px 0 ' }}
          onClick={handleCopy}
        >
          <FileCopy fontSize="small" htmlColor="hsl(351, 100%, 75%)" />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default StatusField;
