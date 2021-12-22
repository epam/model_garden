import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { ITableStateProps, ILabelingTaskStatus } from '../../../models';
import { makeStyles } from '@material-ui/core';
import StatusField from '../../tasksStatuses/StatusField';
import { GetColumnSearchProps } from '../../tasksStatuses/GetColumnSearchProps';
import { useAppDispatch } from '../../../store';
import { getDatasetsTasks } from '../../../store/gallery';

const useStyles = makeStyles((theme) => ({
  table: {
    marginBottom: theme.spacing(3)
  }
}));

export const TasksTable = ({ tasks, datasetId }: any): JSX.Element => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const [tableState, setTableState] = useState<ITableStateProps>({
    page: 1,
    rowsPerPage: 10,
    searchProps: {
      dataset_id: datasetId
    },
    filterStatus: JSON.parse(
      localStorage.getItem('taskStatusFilter') as any
    ) || ['annotation', 'validation', 'completed', 'saved', 'failed'],
    sortOrder: undefined,
    sortField: undefined
  });

  useEffect(() => {
    dispatch(getDatasetsTasks(tableState));
  }, [tableState, dispatch]);

  const updateSearchState = (newSearchProps: Object) => {
    setTableState((prevState: any) => {
      return {
        ...prevState,
        searchProps: {
          ...prevState.searchProps,
          ...newSearchProps
        },
        page: 1
      };
    });
  };

  const resetSearchState = () => {
    setTableState((prevState: any) => {
      return {
        ...prevState,
        searchProps: {},
        page: 1
      };
    });
  };

  const StatusFieldComp = Object.assign(
    (text: string, record: { error: string; status: string }) => {
      return <StatusField text={text} record={record} />;
    },
    { displayName: 'StatusFieldComp' }
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
      filtered: tableState.searchProps.name,
      ...GetColumnSearchProps('name', updateSearchState, resetSearchState),
      render: (name: string, record: ILabelingTaskStatus) => {
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
      render: StatusFieldComp,
      filters: [
        { text: 'annotation', value: 'annotation' },
        { text: 'validation', value: 'validation' },
        { text: 'completed', value: 'completed' },
        { text: 'saved', value: 'saved' },
        { text: 'failed', value: 'failed' },
        { text: 'archived', value: 'archived' }
      ],
      filteredValue: tableState.filterStatus,
      onFilter: (value: any, record: any) => record.status.includes(value)
    }
  ];

  const handleTableChange = (
    pagination: {
      pageSize: number;
      current: number;
      total: number;
    },
    filter: any,
    sorter: {
      column?: any;
      order?: 'ascend' | 'descend';
      field?: string;
      columnKey?: any;
    }
  ) => {
    localStorage.setItem('taskStatusFilter', JSON.stringify(filter.status));
    setTableState((prevState: ITableStateProps) => ({
      ...prevState,
      page: pagination.current,
      filterStatus: filter.status,
      sortOrder: sorter.order,
      sortField: sorter.field
    }));
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
