import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppBar, Tabs, Tab } from "@material-ui/core";
import { UploadImages, LabelingTask, TasksStatuses, ErrorAlert } from "../components";
import { setSelectedMenuItem, getBuckets } from "../store/main";
import { AppState } from "../store";

export const MainPage: React.FC = () => {
  const dispatch = useDispatch();
  const selectedMenuItem = useSelector(
    (state: AppState) => state.main.selectedMenuItemIndex
  );
  const errorMessage = useSelector(
    (state: AppState) => state.error.errorMessage
  );

  // get buckets
  useEffect(() => {
    dispatch(getBuckets());
  }, [dispatch]);

  const handleSelectMenuItem = (
    event: React.ChangeEvent<{}>,
    newValue: number
  ) => {
    dispatch(setSelectedMenuItem(newValue));
  };

  return (
    <>
      {errorMessage && <ErrorAlert />}
      <AppBar position="static">
        <Tabs value={selectedMenuItem} onChange={handleSelectMenuItem}>
          <Tab label="Upload Images" />
          <Tab label="Create Labeling Task" />
          <Tab label="Tasks statuses" />
        </Tabs>
      </AppBar>
      {selectedMenuItem === 0 && <UploadImages />}
      {selectedMenuItem === 1 && <LabelingTask />}
      {selectedMenuItem === 2 && <TasksStatuses />}
    </>
  );
};
