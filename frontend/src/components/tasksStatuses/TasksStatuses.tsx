import React, { useEffect } from 'react';
import MUIDataTable from "mui-datatables";
import './TasksStatuses.css';
import { AppState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { getLabelingTasks, getDatasets } from '../../store/labelingTask';
import { TABLE_TITLE, TASK_STATUSES_COLUMNS, TASK_STATUSES } from './constants';

const options = {
  filterType: 'textField' as "checkbox" | "dropdown" | "multiselect" | "textField" | "custom" | undefined,
  download: false,
  print: false,
  selectableRows: 'none' as "none" | "multiple" | "single" | undefined
};

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
      <div className={'task-statuses'}>
          <MUIDataTable
              title={TABLE_TITLE}
              data={TASK_STATUSES}
              columns={TASK_STATUSES_COLUMNS}
              options={options}
          />
      </div>
  );
};
