import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppBar, Tabs, Tab } from "@material-ui/core";
import { UploadImages, LabelingTask, TasksStatuses } from "../components";
import { login } from "../store/auth";
import { setSelectedMenuItem, getBucketNames } from "../store/main/actions";
import { AppState } from "../store";

export const MainPage: React.FC = () => {
  const dispatch = useDispatch();
  const selectedMenuItem = useSelector(
    (state: AppState) => state.main.selectedMenuItemIndex
  );
  const errorMessage = useSelector(
    (state: AppState) => state.media.uploadingErrorMessage
  );

  // auto login to the CVAT
  useEffect(() => {
    dispatch(login("", ""));
    dispatch(getBucketNames());
  }, [dispatch]);

  const handleSelectMenuItem = (
    event: React.ChangeEvent<{}>,
    newValue: number
  ) => {
    dispatch(setSelectedMenuItem(newValue));
  };

  return (
    <>
      <AppBar position="static">
        <Tabs value={selectedMenuItem} onChange={handleSelectMenuItem}>
          <Tab label="Upload Images" />
          <Tab label="Create Labeling Task" />
          <Tab label="Tasks statuses" />
        </Tabs>
      </AppBar>
      {errorMessage && <h1>{errorMessage}</h1>}
      {selectedMenuItem === 0 && <UploadImages />}
      {selectedMenuItem === 1 && <LabelingTask />}
      {selectedMenuItem === 2 && <TasksStatuses />}
    </>
  );
};
