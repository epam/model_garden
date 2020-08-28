import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import zipSvg from '../../../assets/zip.svg';
import { ConformationDialog } from '../conformationDialog';
import { isArchive, accept, DropZoneProps } from './utils';
import './styles.scss';

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

  return (
    <>
      <section
        {...getRootProps({
          className: `mg-drop-field ${isDragReject ? 'rejected' : ''}`
        })}
      >
        <input {...getInputProps()} />
        {isDragAccept && (
          <p className="mg-drop-text">All files will be accepted</p>
        )}
        {isDragReject && (
          <p className="mg-drop-text">
            Some files will be rejected because of wrong format.
          </p>
        )}
        {!isDragActive && (
          <p className="mg-drop-text">Drop some files here ...</p>
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
