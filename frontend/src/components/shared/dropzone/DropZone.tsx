import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import zipSvg from '../../../assets/zip.svg';
import { toast } from 'react-toastify';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';

export interface DropZoneProps {
  setFiles?: Function;
  onDrop?: Function;
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
  dropFieldError: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '1.5rem',
    borderWidth: '2px',
    borderRadius: '2px',
    borderColor: red[500], //only difference
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
  },
  dropTextError: {
    width: '100%',
    textAlign: 'center',
    margin: '0',
    color: 'red' //only difference
  }
}));

export const DropZone: React.FC<DropZoneProps> = ({
  setFiles,
  onDrop
}: DropZoneProps) => {
  const isArchive = (file: any) =>
    file.type === 'application/zip' ||
    file.type === 'application/x-zip-compressed';

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop: (acceptedFiles, fileRejections: any) => {
      if (fileRejections.length) {
        // option 1
        toast.info(
          `${
            fileRejections.length > 1
              ? `${fileRejections.length} files were ignored.
              ${acceptedFiles.length} ${
                  acceptedFiles.length === 1 ? 'was' : 'were'
                } accepted.`
              : `File "${fileRejections[0].file.name}" was ignored. Invalid format`
          } `
        );
        //  //option2
        //       toast.info(
        //         `${acceptedFiles.length} files out of ${
        //           acceptedFiles.length + fileRejections.length
        //         } were accepted.Invalid format.`
        //       );
      }
      if (onDrop) {
        onDrop(acceptedFiles);
      }
      if (setFiles) {
        setFiles(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: isArchive(file) ? zipSvg : URL.createObjectURL(file)
            })
          )
        );
      }
    },
    accept: `
    image/bmp,
    image/gif,
    image/png,
    image/jpeg,
    image/svg,
    image/tiff,
    application/zip,
    application/x-zip-compressed`
  });
  const classes = useStyles();

  return (
    <section
      {...getRootProps({
        className: isDragReject ? classes.dropFieldError : classes.dropField
      })}
    >
      <input {...getInputProps()} />
      {isDragAccept && (
        <p className={classes.dropText}>All files will be accepted</p>
      )}
      {isDragReject && (
        <p className={classes.dropTextError}> Some files will be rejected</p>
      )}
      {!isDragActive && (
        <p className={classes.dropText}>Drop some files here ...</p>
      )}
    </section>
  );
};
