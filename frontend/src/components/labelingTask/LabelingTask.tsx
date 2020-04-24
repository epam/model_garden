import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Typography } from "@material-ui/core";
import "./LabelingTask.css";
import { ImagesReceiver } from "./imgaseLocation";
import { Task } from "./task";

interface LabelingTaskProps {}

export const LabelingTask: React.FC = ({}: LabelingTaskProps) => {
  const { handleSubmit, register } = useForm();
  return (
    <>
      <ImagesReceiver bucketNames={[]} paths={[]} />
      <Task users={[]} />
      {/* <div className="labeling-task">
        <Typography
          variant="h5"
          component="h1"
          className="labeling-task__title"
        >
          UPLOAD IMAGES
        </Typography>
        <form onSubmit={onSubmit} className="upload-images__form">
        <div className="upload-images__dropzone">
          <DropZone isUploading={isFilesUploading} handleDrop={handleDropFiles} />
        </div>
        <div className="upload-images__settings">
          <Controller
            control={control}
            name="bucketName"
            label="S3 Bucket name"
            className="upload-images__settings-item"
            variant="outlined"
            as={
              <Select>
                {selectOptions}
              </Select>
            }
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
      </div> */}
    </>
  );
};
