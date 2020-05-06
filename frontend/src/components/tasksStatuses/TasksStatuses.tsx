import React, { useEffect } from 'react';
import './TasksStatuses.css';
import { ImagesLocation } from '../shared/imagesLocation';
import { AppState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { Tasks } from './tasks';
import { getLabelingTasks, getDatasets } from '../../store/labelingTask';

export const TasksStatuses: React.FC = () => {
  const dispatch = useDispatch();
  const buckets = useSelector((state: AppState) => state.main.buckets);
  const currentBucketId = useSelector((state: AppState) => state.labelingTask.currentBucketId);
  const datasets = useSelector((state: AppState) => state.labelingTask.datasets);
  const currentDatasetId = useSelector((state: AppState) => state.labelingTask.currentDatasetId);

  useEffect(() => {
    if (currentBucketId) {
      dispatch(getDatasets(currentBucketId));
    }
  }, [dispatch, currentBucketId]);
  
  const handleImagesLocationSubmit = () => {
    dispatch(getLabelingTasks(currentBucketId, currentDatasetId));
  };

  return (
    <div className="tasks-statuses">
      <ImagesLocation
        title="Select images location"
        buttonName="Get tasks info"
        buckets={buckets}
        datasets={Array.from(datasets.values())}
        currentBucketId={currentBucketId}
        handleFormSubmit={handleImagesLocationSubmit}
      />
      <Tasks />
    </div>
  );
};
