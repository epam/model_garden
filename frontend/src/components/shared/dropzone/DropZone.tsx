import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import zipSvg from '../../../assets/zip.svg';
import { blue, red } from '@material-ui/core/colors';
import { ConformationDialog } from '../conformationDialog';
import { isArchive, accept, DropZoneProps } from './utils';
export const DropZone: React.FC<DropZoneProps> = ({
  setFiles,
  onDrop
}: DropZoneProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length) {
        setIsDialogOpen(true);
      }
      if (acceptedFiles.length) {
        onDrop?.(acceptedFiles); // eslint-disable-line
        // eslint-disable-next-line
        setFiles?.(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: isArchive(file) ? zipSvg : URL.createObjectURL(file)
            })
          )
        );
      }
    },
    accept
  });

  const classes = makeStyles((theme) => ({
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
      borderColor: isDragReject ? red[500] : blue[500],
      borderStyle: 'dashed',
      backgroundColor: isDragReject ? red[50] : blue[50],
      color: isDragReject ? red[500] : blue[500],
      outline: 'none',
      transition: 'border 0.24s ease-in-out',
      cursor: 'pointer'
    },
    dropText: {
      width: '100%',
      textAlign: 'center',
      margin: '0'
    }
  }))();

  return (
    <>
      <section
        {...getRootProps({
          className: classes.dropField
        })}
      >
        <input {...getInputProps()} />
        {isDragAccept && (
          <p className={classes.dropText}>All files will be accepted</p>
        )}
        {isDragReject && (
          <p className={classes.dropText}>
            Some files will be rejected because of wrong format.
          </p>
        )}
        {!isDragActive && (
          <p className={classes.dropText}>Drop some files here ...</p>
        )}
      </section>
      <ConformationDialog
        title="There is a Problem Uploading Your File"
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        closeButton="Close"
      >
        <p>
          Looks like you are trying to upload file with the unsupported format.
          <br />
          Supported file formats are:
        </p>

        <ul>
          <li>jpeg</li>
          <li>png</li>
          <li>gif</li>
          <li>tiff</li>
          <li>svg</li>
          <li>bmp</li>
          <li>zip</li>
        </ul>
      </ConformationDialog>
    </>
  );
};
