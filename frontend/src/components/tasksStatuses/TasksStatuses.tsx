import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'antd';
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import 'antd/dist/antd.css';
import './TasksStatuses.css';
import { DropdownButton } from './DropdownButton';
import { AppState } from '../../store';
import {
  archiveLabelingTask,
  getLabelingTasks,
  retryLabelingTask
} from '../../store/labelingTask';
import { tableStateProps } from '../../interface';
import { ROWS_PER_PAGE } from './constants';
import { GetColumnSearchProps } from './GetColumnSearchProps';

export const TasksStatuses: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [tableState, setTableState] = useState<tableStateProps>({
    page: 1,
    rowsPerPage: ROWS_PER_PAGE,
    searchProps: {},
    filterStatus: ['annotation', 'validation', 'completed', 'saved'],
    sortOrder: undefined,
    sortField: undefined
  });

  const areTasksLoading = useSelector(
    (state: AppState) => state.labelingTask.isLabelingTasksStatusesLoading
  );
  const tasks = useSelector(
    (state: AppState) => state.labelingTask.labelingTasksStatuses.tasks
  );
  const tasksCount = useSelector(
    (state: AppState) => state.labelingTask.labelingTasksStatuses.count
  );

  const dispatch = useDispatch();
  useEffect(() => {
    console.log('useEffect', tableState);
    dispatch(getLabelingTasks(tableState));
  }, [tableState, dispatch]);

  const updateSearchState = (newSearchProps: Object) => {
    setTableState((prevState: any) => {
      let updatedSearchProps = {};

      if (newSearchProps !== {}) {
        updatedSearchProps = {
          ...prevState.searchProps,
          ...newSearchProps
        };
      }

      return {
        ...prevState,
        searchProps: {
          ...updatedSearchProps
        },
        page: 1
      };
    });
  };

  const TASK_STATUSES_COLUMNS = [
    {
      title: 'Task Name',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      sorter: true,
      ...GetColumnSearchProps('name', updateSearchState)
    },
    {
      title: 'Dataset',
      dataIndex: 'dataset',
      key: 'dataset',
      width: '20%',
      sorter: true,
      ...GetColumnSearchProps('dataset', updateSearchState)
    },
    {
      title: 'Labeler',
      dataIndex: 'labeler',
      key: 'labeler',
      sorter: true,
      ...GetColumnSearchProps('labeler', updateSearchState)
    },
    {
      title: 'Url',
      dataIndex: 'url',
      key: 'url',
      render: (value: string) => {
        let hostname = value;
        let res = /https?:\/\/(.+?)\/.*/.exec(value);
        if (res && res.length === 2) {
          hostname = res[1];
        }
        return (
          <a href={value} target="_blank" rel="noopener noreferrer">
            {hostname}
          </a>
        );
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      filters: [
        { text: 'annotation', value: 'annotation' },
        { text: 'validation', value: 'validation' },
        { text: 'completed', value: 'completed' },
        { text: 'saved', value: 'saved' },
        { text: 'archived', value: 'archived' },
        { text: 'failed', value: 'failed' }
      ],
      filteredValue: tableState.filterStatus
    }
  ];

  const handleTableChange = (
    pagination: { pageSize: number; current: number; total: number },
    filter: any,
    sorter: {
      column?: any;
      order?: 'ascend' | 'descend';
      field?: string;
      columnKey?: any;
    }
  ) => {
    setTableState((prevState: tableStateProps) => ({
      ...prevState,
      page: pagination.current,
      filterStatus: filter.status,
      sortOrder: sorter.order,
      sortField: sorter.field
    }));
  };

  const onSelectChange = (values: Array<number & never>) => {
    setSelectedRowKeys(values);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };

  const handleArchive: any = () => {
    if (selectedRowKeys.length > 0) {
      (dispatch(
        archiveLabelingTask(selectedRowKeys, tableState)
      ) as any).finally(() => {
        setSelectedRowKeys([]);
      });
    }
  };

  const handleRetry: any = () => {
    if (selectedRowKeys.length > 0) {
      (dispatch(retryLabelingTask(selectedRowKeys, tableState)) as any).finally(
        () => {
          setSelectedRowKeys([]);
        }
      );
    }
  };
  const handleRefresh = () => {
    dispatch(getLabelingTasks(tableState));
  };

  return (
    <div className={'task-statuses'}>
      <DropdownButton onArchive={handleArchive} onRetry={handleRetry} />
      <IconButton aria-label="refresh" onClick={handleRefresh}>
        <RefreshIcon />
      </IconButton>
      <Table
        columns={TASK_STATUSES_COLUMNS as any}
        rowKey={(record) => record.id}
        rowSelection={rowSelection as any}
        rowClassName={(record) => `task-status-${record.status}`}
        dataSource={tasks}
        pagination={{
          pageSize: ROWS_PER_PAGE,
          current: tableState.page,
          total: tasksCount
        }}
        loading={areTasksLoading}
        onChange={handleTableChange as any}
      />
    </div>
  );
};
