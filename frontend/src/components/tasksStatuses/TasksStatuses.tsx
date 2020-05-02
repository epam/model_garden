import React, { useEffect } from 'react';
import './TasksStatuses.css';
import { ImagesLocation } from '../shared/imagesLocation';
import { AppState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { Tasks } from './tasks';
import { getLabelingTasks, getBucketPaths } from '../../store/labelingTask';

export const TasksStatuses: React.FC = () => {
  const dispatch = useDispatch();
  const bucketNames = useSelector((state: AppState) => state.main.bucketNames);
  const currentBucketName = useSelector(
    (state: AppState) => state.labelingTask.currentBucketName
  );
  const paths = useSelector((state: AppState) => state.labelingTask.paths);
  const currentPath = useSelector(
    (state: AppState) => state.labelingTask.currentPath
  );

  useEffect(() => {
    if (currentBucketName) {
      dispatch(getBucketPaths(currentBucketName));
    }
  }, [dispatch, currentBucketName]);
  
  const handleImagesLocationSubmit = () => {
    dispatch(getLabelingTasks(currentBucketName, currentPath));
  };

  return (
    <div className="tasks-statuses">
      <ImagesLocation
        title="Select images location"
        buttonName="Get tasks info"
        bucketNames={bucketNames}
        paths={paths}
        currentBucketName={currentBucketName}
        currentPath={currentPath}
        handleFormSubmit={handleImagesLocationSubmit}
      />
      <Tasks />
    </div>
  );
};
