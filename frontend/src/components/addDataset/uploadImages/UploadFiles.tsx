import React from 'react';
import { makeStyles } from '@material-ui/core';
import { DropZone } from '../../shared/dropzone';

export interface IExtendedFile extends File {
  preview: string;
}

interface IUploadFilesProps {
  files: IExtendedFile[];
  setFiles: Function;
}

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
    marginTop: '0.5rem'
  },
  thumb: {
    display: 'inline-flex',
    borderRadius: '2px',
    border: `1px solid ${theme.palette.grey[200]}`,
    width: '6.25rem',
    height: '6.25rem',
    padding: '0.25rem',
    margin: '0.25rem',
    boxSizing: 'border-box'
  },
  thumbImage: {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  }
}));

export const UploadFiles: React.FC<IUploadFilesProps> = ({
  files,
  setFiles
}: IUploadFilesProps) => {
  const classes = useStyles();

  const tumbs = files.map((file) => {
    return (
      <div className={classes.thumb} key={file.name}>
        <img src={file.preview} alt="dropzone" className={classes.thumbImage} />
      </div>
    );
  });
  return (
    <section className={classes.dropzone}>
      <DropZone setFiles={setFiles} />
      <aside className={classes.thumbsContainer}>{tumbs}</aside>
    </section>
  );
};
