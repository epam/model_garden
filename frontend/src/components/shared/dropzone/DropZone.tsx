import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import zipSvg from '../../../assets/zip.svg';
import incorrectSvg from '../../../assets/incorrect.svg';
import blue from '@material-ui/core/colors/blue';

export interface DropZoneProps {
  setFiles: Function;
}

const useStyles = makeStyles((theme) => ({
  dropField: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '1.5rem',
    borderWidth: '2px',
    borderRadius: '2px',
    borderColor: blue[500],
    borderStyle: 'dashed',
    backgroundColor: blue[50],
    color: blue[500],
    outline: 'none',
    transition: 'border 0.24s ease-in-out',
    cursor: 'pointer'
  },
  dropText: {
    width: '100%',
    textAlign: 'center',
    margin: '0'
  }
}));

export const DropZone: React.FC<DropZoneProps> = ({
  setFiles
}: DropZoneProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const formattedFiles = acceptedFiles.map((file: File) => {
        let preview = '';
        let isCorrect = true;
        switch (file.type) {
          case 'application/x-zip-compressed':
          case 'application/zip':
            preview = zipSvg;
            break;
          case String(file.type.match(/image\/.*/)):
            preview = URL.createObjectURL(file);
            break;
          default:
            preview = incorrectSvg;
            isCorrect = false;
        }
        return Object.assign(file, { preview, isCorrect });
      });
      setFiles(formattedFiles.filter((file) => file.isCorrect));
    },
    [setFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const classes = useStyles();

  return (
    <section {...getRootProps({ className: classes.dropField })}>
      <input {...getInputProps()} />
      <p className={classes.dropText}>
        {isDragActive ? (
          <>Drop the files here ...</>
        ) : (
          <>Drag 'n' drop some files here, or click to select files</>
        )}
      </p>
    </section>
  );
};
