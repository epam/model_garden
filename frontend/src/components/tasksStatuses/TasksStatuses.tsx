import React, { useEffect } from 'react';
import './TasksStatuses.css';
import { ImagesLocation } from '../shared/imagesLocation';
import { AppState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { Tasks } from './tasks';
import { getLabelingTasks, getBucketPaths } from '../../store/labelingTask';

export const TasksStatuses: React.FC = () => {
  const dispatch = useDispatch();
  const buckets = useSelector((state: AppState) => state.main.buckets);
  const currentBucketId = useSelector((state: AppState) => state.labelingTask.currentBucketId);
  const paths = useSelector((state: AppState) => state.labelingTask.paths);
  const currentPath = useSelector((state: AppState) => state.labelingTask.currentPath);

  useEffect(() => {
    if (currentBucketId) {
      dispatch(getBucketPaths(currentBucketId));
    }
  }, [dispatch, currentBucketId]);
  
  const handleImagesLocationSubmit = () => {
    dispatch(getLabelingTasks(currentBucketId, currentPath));
  };

  return (
    <div className="tasks-statuses">
      <ImagesLocation
        title="Select images location"
        buttonName="Get tasks info"
        buckets={buckets}
        paths={paths}
        currentBucketId={currentBucketId}
        currentPath={currentPath}
        handleFormSubmit={handleImagesLocationSubmit}
      />
      <Tasks />
    </div>
  );
};
