import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import 'antd/dist/antd.css';
import './TasksStatuses.css';
import { TaskActions } from './TaskActions';
import { useAppDispatch, useTypedSelector } from '../../store';
import {
  getLabelingTasks,
  setSelectedRowKeys
} from '../../store/tasksStatuses';
import { ITableStateProps, ILabelingTaskStatus } from '../../models';
import { GetColumnSearchProps } from './GetColumnSearchProps';
import StatusField from './StatusField';

import { Box, IconButton } from '@material-ui/core';
import { Refresh } from '@material-ui/icons';

export const TasksStatuses: React.FC = () => {
  const dispatch = useAppDispatch();
  const areTasksLoading = useTypedSelector(
    ({ tasksStatuses }) => tasksStatuses.loading
  );
  const tasks = useTypedSelector(({ tasksStatuses }) => tasksStatuses.tasks);
  const tasksCount = useTypedSelector(
    ({ tasksStatuses }) => tasksStatuses.count
  );
  const tableUpdated = useTypedSelector(
    ({ tasksStatuses }) => tasksStatuses.actualView
  );
  const selectedRowKeys = useTypedSelector(
    ({ tasksStatuses }) => tasksStatuses.selectedRowKeys
  );

  const [tableState, setTableState] = useState<ITableStateProps>({
    page: 1,
    rowsPerPage: 10,
    searchProps: {},
    filterStatus: JSON.parse(
      localStorage.getItem('taskStatusFilter') as any
    ) || ['annotation', 'validation', 'completed', 'saved', 'failed'],
    sortOrder: undefined,
    sortField: undefined
  });

  useEffect(() => {
    dispatch(getLabelingTasks(tableState));
  }, [tableState, dispatch, tableUpdated]);

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

  const TaskStatusComp = Object.assign(
    (text: string, record: { error: string; status: string }) => (
      <StatusField text={text} record={record} />
    ),
    { displayName: 'TaskStatusComp' }
  );

  const TASK_STATUSES_COLUMNS = [
    {
      title: 'Task Name',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      sorter: true,
      showSorterTooltip: false,
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
      title: 'Dataset',
      dataIndex: 'dataset',
      key: 'dataset',
      sorter: true,
      filtered: tableState.searchProps.dataset,
      ...GetColumnSearchProps('dataset', updateSearchState, resetSearchState)
    },
    {
      title: 'Labeler',
      dataIndex: 'labeler',
      key: 'labeler',
      sorter: true,
      filtered: tableState.searchProps.labeler,
      ...GetColumnSearchProps('labeler', updateSearchState, resetSearchState)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      render: TaskStatusComp,
      filters: [
        { text: 'annotation', value: 'annotation' },
        { text: 'validation', value: 'validation' },
        { text: 'completed', value: 'completed' },
        { text: 'saved', value: 'saved' },
        { text: 'failed', value: 'failed' },
        { text: 'archived', value: 'archived' }
      ],
      filteredValue: tableState.filterStatus
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

  const onShowSizeChange = (current: any, pageSize: any) => {
    setTableState((prevState: any) => {
      return {
        ...prevState,
        page: current,
        rowsPerPage: pageSize
      };
    });
  };

  return (
    <div className={'task-statuses'}>
      <Box display="flex" justifyContent="space-between" marginBottom={1}>
        <TaskActions />

        <IconButton
          aria-label="refresh"
          onClick={() => {
            dispatch(getLabelingTasks(tableState));
          }}
        >
          <Refresh />
        </IconButton>
      </Box>

      <Table
        columns={TASK_STATUSES_COLUMNS as any}
        rowKey={({ id }) => id}
        rowSelection={{
          selectedRowKeys,
          onChange: (values) => dispatch(setSelectedRowKeys(values))
        }}
        rowClassName={({ status }) => `task-status-${status}`}
        dataSource={tasks}
        pagination={{
          pageSize: tableState.rowsPerPage,
          current: tableState.page,
          total: tasksCount,
          showSizeChanger: true,
          onShowSizeChange
        }}
        loading={areTasksLoading}
        onChange={handleTableChange as any}
      />
    </div>
  );
};
