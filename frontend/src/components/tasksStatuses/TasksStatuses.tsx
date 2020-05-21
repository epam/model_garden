import React, {useEffect, useState} from 'react';
import MUIDataTable from "mui-datatables";
import './TasksStatuses.css';
import { TABLE_TITLE } from './constants';
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../store";
import {getDatasets, getLabelingTasks} from "../../store/labelingTask";

export const TasksStatuses: React.FC = () => {
  const TASK_STATUSES_COLUMNS = [
    {
      name: 'name',
      label: 'Task Name'
    },
    {
      name: 'dataset',
      label: 'Dataset'
    },
    {
      name: 'labeler',
      label: 'Labeler'
    },
    {
      name: 'url',
      label: 'Url',
      options: {
        filter: false,
        customBodyRender: (value: string) => {
          let hostname = value;
          let res = /https?:\/\/(.+?)\/.*/.exec(value);
          if (res && res.length === 2) {
            hostname = res[1];
          }
          return (
            <a href={value} target="_blank" rel="noopener noreferrer">{hostname}</a>
          );
        }
      }
    },
    {
      name: 'status',
      label: 'Status'
    },
  ];


  const dispatch = useDispatch();
  const currentBucketId = useSelector((state: AppState) => state.labelingTask.currentBucketId);
  const currentDatasetId = useSelector((state: AppState) => state.labelingTask.currentDatasetId);
  const tasks = useSelector(
    (state: AppState) => state.labelingTask.labelingTasksStatuses.tasks
  );
  const tasksCount = useSelector(
    (state: AppState) => state.labelingTask.labelingTasksStatuses.count
  );

  const [pageValue, setPage] = useState(1);
  const [rowsPerPageValue, setRowsPerPage] = useState(10);

  const options = {
    page: pageValue - 1,
    count: tasksCount,
    serverSide: true,
    onTableChange: (action: string, tableState: any) => {
      switch (action) {

        case 'changePage':
          setPage(tableState.page + 1);
          dispatch(getLabelingTasks(
            currentBucketId,
            currentDatasetId,
            tableState.page + 1,
            rowsPerPageValue
          ));
          break;

        case 'changeRowsPerPage': {
          setRowsPerPage(tableState.rowsPerPage);
          dispatch(getLabelingTasks(
            currentBucketId,
            currentDatasetId,
            pageValue,
            tableState.rowsPerPage,
            undefined
          ));
        }
      }
    },
    filterType: 'textField' as "checkbox" | "dropdown" | "multiselect" | "textField" | "custom" | undefined,
    download: false,
    print: false,
    selectableRows: 'none' as "none" | "multiple" | "single" | undefined,
    rowsPerPageOptions: [10, 25, 50]
  }

  useEffect(() => {
    if (currentBucketId) {
      dispatch(getDatasets(currentBucketId));
    }
  }, [dispatch, currentBucketId]);

  useEffect(() => {
    dispatch(getLabelingTasks(currentBucketId, currentDatasetId, pageValue, rowsPerPageValue, undefined));
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
