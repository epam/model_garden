import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Paper,
  Typography,
  Select,
  TextField,
  Button,
  MenuItem,
} from "@material-ui/core";
import { DropZone } from "../index";
import "./UploadImages.css";

type FormData = {
  bucketName: string;
  path: string;
};

type UploadImagesProps = {
  bucketNames: string[];
  isFilesUploading: boolean;
  handleUploadImagesSubmit: (bucketName: string, path: string) => void;
  handleDropFiles: (files: File[]) => void;
};

export const UploadImages: React.FC<UploadImagesProps> = ({
  bucketNames,
  isFilesUploading,
  handleUploadImagesSubmit,
  handleDropFiles,
}: UploadImagesProps) => {
  const [formData, setFormData] = useState<FormData>({
    bucketName: "",
    path: "",
  });
  const { register, handleSubmit, control } = useForm<FormData>({
    defaultValues: formData,
  });

  const onSubmit = handleSubmit(({ bucketName, path }) => {
    setFormData({ bucketName, path });
    handleUploadImagesSubmit(bucketName, path);
  });

  const selectOptions = bucketNames.map((bucketName) => (
    <MenuItem key={bucketName} value={bucketName}>
      {bucketName}
    </MenuItem>
  ));

  return (
    <div className="upload-images">
      <Typography variant="h5" component="h1" className="upload-images__title">
        UPLOAD IMAGES
      </Typography>
      <form onSubmit={onSubmit} className="upload-images__form">
        <div className="upload-images__dropzone">
          <DropZone
            isUploading={isFilesUploading}
            handleDrop={handleDropFiles}
          />
        </div>
        <div className="upload-images__settings">
          <Controller
            control={control}
            name="bucketName"
            label="S3 Bucket name"
            className="upload-images__settings-item"
            variant="outlined"
            as={<Select>{selectOptions}</Select>}
          />
          <Controller
            className="upload-images__settings-item"
            name="path"
            inputRef={register}
            variant="outlined"
            label="Path"
            defaultValue=""
            control={control}
            as={<TextField />}
          />
          <Button
            className="upload-images__settings-item"
            color="primary"
            variant="contained"
            type="submit"
          >
            Upload
          </Button>
        </div>
      </form>
    </div>
  );
};
