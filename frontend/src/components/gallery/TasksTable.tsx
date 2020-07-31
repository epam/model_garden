import React, { useState } from 'react';
import { Table } from 'antd';
import { LabelingTaskStatus } from '../../models';
import { makeStyles } from '@material-ui/core';
import StatusField from '../tasksStatuses/StatusField';

const useStyles = makeStyles((theme) => ({
  table: {
    marginBottom: theme.spacing(3)
  }
}));

export const TasksTable = ({ tasks }: any) => {
  const classes = useStyles();
  const [filterState, setFilterState] = useState(
    JSON.parse(localStorage.getItem('datasetStatusFilter') as any) || [
      'annotation',
      'validation',
      'completed',
      'saved',
      'failed'
    ]
  );

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
        if (record.status !== 'archived') {
          return (
            <a href={record.url} target="_blank" rel="noopener noreferrer">
              {name}
            </a>
          );
        } else {
          return name;
        }
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
      key: 'status',
      sorter: true,
      render: (text: string, record: { error: string; status: string }) => {
        return <StatusField text={text} record={record} />;
      },
      filters: [
        { text: 'annotation', value: 'annotation' },
        { text: 'validation', value: 'validation' },
        { text: 'completed', value: 'completed' },
        { text: 'saved', value: 'saved' },
        { text: 'failed', value: 'failed' },
        { text: 'archived', value: 'archived' }
      ],
      filteredValue: filterState,
      onFilter: (value: any, record: any) => record.status.includes(value)
    }
  ];

  const handleTableChange = (pagination: any, filters: any) => {
    localStorage.setItem('datasetStatusFilter', JSON.stringify(filters.status));
    setFilterState(filters.status);
  };

  return (
    <Table
      columns={TASK_STATUSES_COLUMNS as any}
      dataSource={tasks}
      rowKey={(record) => record.id}
      rowClassName={(record) => `task-status-${record.status}`}
      className={classes.table}
      size="small"
      pagination={false}
      onChange={handleTableChange as any}
    />
  );
};
