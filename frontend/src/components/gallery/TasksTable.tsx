import React from 'react';
import { Table } from 'antd';
import { LabelingTaskStatus } from '../../models';
import { makeStyles } from '@material-ui/core';

const TASK_STATUSES_COLUMNS = [
  {
    title: 'Tool',
    dataIndex: 'tool',
    key: 'tool',
    render: () => 'CVAT'
  },
  {
    title: 'Task name',
    dataIndex: 'name',
    key: 'name',
    render: (name: string, record: LabelingTaskStatus) => {
      return (
        <a href={record.url} target="_blank" rel="noopener noreferrer">
          {name}
        </a>
      );
    }
  },
  {
    title: 'Labeler',
    dataIndex: 'labeler',
    key: 'labeler'
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status'
  }
];

const useStyles = makeStyles((theme) => ({
  table: {
    marginBottom: theme.spacing(3)
  }
}));

export const TasksTable = ({ tasks }: any) => {
  const classes = useStyles();
  return (
    <Table
      columns={TASK_STATUSES_COLUMNS as any}
      dataSource={tasks}
      rowKey={(record) => record.id}
      rowClassName={(record) => `task-status-${record.status}`}
      className={classes.table}
      size="small"
      pagination={false}
    />
  );
};
