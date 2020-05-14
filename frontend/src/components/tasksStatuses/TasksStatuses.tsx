import React, {useEffect} from 'react';
import MUIDataTable from "mui-datatables";
import './TasksStatuses.css';
import { TABLE_TITLE, TASK_STATUSES_COLUMNS, TASK_STATUSES } from './constants';
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../store";
import {getDatasets, getLabelingTasks} from "../../store/labelingTask";

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

  const tasks = useSelector(
    (state: AppState) => state.labelingTask.labelingTasksStatuses
  );

  useEffect(() => {
    if (currentBucketId) {
      dispatch(getDatasets(currentBucketId));
      getTasks();
    }
  }, [dispatch, currentBucketId]);

  const getTasks = () => {
    dispatch(getLabelingTasks(currentBucketId, currentDatasetId));
  };


  return (
      <div className={'task-statuses'}>
          <MUIDataTable
              title={TABLE_TITLE}
              data={tasks}
              columns={TASK_STATUSES_COLUMNS}
              options={options}
          />
      </div>
  );
};
