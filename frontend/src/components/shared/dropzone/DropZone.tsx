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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length) {
        setIsModalOpen(true);
      }
      if (acceptedFiles.length) {
        onDrop?.(acceptedFiles);
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
        title="Some files were ignored. Wrong format"
        open={isModalOpen}
        setOpen={setIsModalOpen}
        closeButton="Ok"
      >
        The only supported file types are
        <ul>
          <li> bmp</li>
          <li>png</li>
          <li>gif</li>
          <li>jpeg</li>
          <li>tiff</li>
          <li>svg</li>
          <li>zip</li>
        </ul>
      </ConformationDialog>
    </>
  );
};
