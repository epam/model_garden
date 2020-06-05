import React, { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import zipSvg from '../../../assets/zip.svg';
import incorrectSvg from '../../../assets/incorrect.svg';
import './DropZone.css';

export interface ExtendedFile extends File {
  preview: string;
}

interface DropZoneProps {
  handleDrop: (files: File[]) => void;
  files: ExtendedFile[];
  setFiles: Function;
}

export const DropZone: React.FC<DropZoneProps> = ({ handleDrop, files, setFiles }: DropZoneProps) => {
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
      setFiles(formattedFiles);
      handleDrop(formattedFiles.filter((file) => file.isCorrect));
    },
    [handleDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const tumbs = files.map((file) => (
    <div className="dropzone__thumb" key={file.name}>
      <div className="dropzone__thumb-inner">
        <img src={file.preview} alt="dropzone" className="dropzone__thumb-image" />
      </div>
    </div>
  ));

  useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <>
      <section className="dropzone">
        <div {...getRootProps({ className: 'dropzone__field' })}>
          <input {...getInputProps()} />
          <p className="dropzone__text">
            {isDragActive ? <>Drop the files here ...</> : <>Drag 'n' drop some files here, or click to select files</>}
          </p>
        </div>
        <aside className="dropzone__tumbs-container">{tumbs}</aside>
      </section>
    </>
  );
};
