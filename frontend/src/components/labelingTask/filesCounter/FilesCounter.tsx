import React from "react";
import { Typography } from "@material-ui/core";
import "./FilesCounter.css";

interface FilesCounterProps {
  filesCount: number;
  className: string;
}

export const FilesCounter: React.FC<FilesCounterProps> = ({
  filesCount,
  className,
}: FilesCounterProps) => {
  return (
    <div className={`files-counter ${className}`}>
      <Typography
        className="files-counter__description"
        variant="body1"
        component="div"
      >
        Files in Queue:
      </Typography>
      <Typography className="files-counter__count">&nbsp;{filesCount}</Typography>
    </div>
  );
};
