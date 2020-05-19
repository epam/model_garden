import React, {useEffect} from 'react';
import MUIDataTable from "mui-datatables";
import './TasksStatuses.css';
import { TABLE_TITLE, TASK_STATUSES_COLUMNS } from './constants';
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../store";
import {getDatasets, getLabelingTasks} from "../../store/labelingTask";

const options = {
  filterType: 'textField' as "checkbox" | "dropdown" | "multiselect" | "textField" | "custom" | undefined,
  download: false,
  print: false,
  selectableRows: 'none' as "none" | "multiple" | "single" | undefined,
  rowsPerPageOptions: [10, 25, 50]
};

export const TasksStatuses: React.FC = () => {
  const dispatch = useDispatch();
  const currentBucketId = useSelector((state: AppState) => state.labelingTask.currentBucketId);
  const currentDatasetId = useSelector((state: AppState) => state.labelingTask.currentDatasetId);

  const tasks = useSelector(
    (state: AppState) => state.labelingTask.labelingTasksStatuses
  );

  useEffect(() => {
    if (currentBucketId) {
      dispatch(getDatasets(currentBucketId));
    }
  }, [dispatch, currentBucketId]);

  useEffect(() => {
    dispatch(getLabelingTasks(currentBucketId, currentDatasetId));
  }, []);

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
