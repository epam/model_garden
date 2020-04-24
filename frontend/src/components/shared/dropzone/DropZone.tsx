import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { LinearProgress } from "@material-ui/core";
import zipSvg from "../../../assets/zip.svg";
import incorrectSvg from "../../../assets/incorrect.svg";
import "./DropZone.css";

interface ExtendedFile extends File {
  preview: string;
}

interface DropZoneProps {
  isUploading: boolean;
  handleDrop: (files: File[]) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({
  handleDrop,
  isUploading,
}: DropZoneProps) => {
  const [files, setFiles] = useState<ExtendedFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
    const formattedFiles = acceptedFiles.map((file: File) => {
      let preview = "";
      let isCorrect = true;
      switch (file.type) {
        case "application/x-zip-compressed":
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
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const tumbs = files.map((file) => (
    <div className="dropzone__thumb" key={file.name}>
      <div className="dropzone__thumb-inner">
        <img src={file.preview} className="dropzone__thumb-image" />
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
        <div {...getRootProps({ className: "dropzone__field" })}>
          <input {...getInputProps()} />
          <div
            className="dropzone__text"
            style={{ width: "100%", textAlign: "center" }}
          >
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag 'n' drop some files here, or click to select files</p>
            )}
          </div>
        </div>
        <aside className="dropzone__tumbs-container">{tumbs}</aside>
        {isUploading && <LinearProgress />}
      </section>
    </>
  );
};
