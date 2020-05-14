import React from 'react';
import MUIDataTable from "mui-datatables";
import './TasksStatuses.css';
import { TABLE_TITLE, TASK_STATUSES_COLUMNS, TASK_STATUSES } from './constants';

const options = {
  filterType: 'textField' as "checkbox" | "dropdown" | "multiselect" | "textField" | "custom" | undefined,
  download: false,
  print: false,
  selectableRows: 'none' as "none" | "multiple" | "single" | undefined
};

export const TasksStatuses: React.FC = () => {
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
