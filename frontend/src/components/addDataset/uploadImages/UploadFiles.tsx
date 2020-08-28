import React from 'react';
import { DropZone } from '../../shared/dropzone';
import './styles.scss';

export interface ExtendedFile extends File {
  preview: string;
}

interface UploadFilesProps {
  files: ExtendedFile[];
  setFiles: Function;
}

export const UploadFiles: React.FC<UploadFilesProps> = ({
  files,
  setFiles
}: UploadFilesProps) => {
  const tumbs = files.map((file) => {
    return (
      <div className="mg-thumb" key={file.name}>
        <img
          src={file.preview}
          alt="Uploaded file preview"
          className="mg-thumb-image"
        />
      </div>
    );
  });
  return (
    <section className="mg-dropzone">
      <DropZone setFiles={setFiles} />
      <aside className="mg-thumbs-container">{tumbs}</aside>
    </section>
  );
};
