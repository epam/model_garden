import React from 'react';
import { makeStyles } from '@material-ui/core';

import { DropZone } from '../../shared/dropzone';
import { IFilePreview } from '../../../store/media/types';

interface IUploadFilesProps {
  files: IFilePreview[];
  setFiles: Function;
}

const DIALOG_BODY_HEIGHT = 715;
const IMAGE_SIZE = 6.25;

const useStyles = makeStyles((theme) => ({
  dropzone: {
    display: 'flex',
    flexDirection: 'column',
    margin: '1.25rem'
  },
  thumbsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '0.5rem',
    maxHeight: `calc(100vh - ${DIALOG_BODY_HEIGHT}px)`,
    overflow: 'auto'
  },
  thumbImage: {
    borderRadius: '2px',
    border: `1px solid ${theme.palette.grey[200]}`,
    width: `${IMAGE_SIZE}rem`,
    height: `${IMAGE_SIZE}rem`,
    padding: '0.25rem',
    margin: '0.25rem',
    objectFit: 'cover'
  }
}));

export const UploadFiles: React.FC<IUploadFilesProps> = ({
  files,
  setFiles
}: IUploadFilesProps) => {
  const classes = useStyles();

  return (
    <section className={classes.dropzone}>
      <DropZone setFiles={setFiles} />
      <div className={classes.thumbsContainer}>
        {files.map((file) => (
          <img
            key={file.name}
            className={classes.thumbImage}
            src={file.preview}
            alt="preview"
          />
        ))}
      </div>
    </section>
  );
};
