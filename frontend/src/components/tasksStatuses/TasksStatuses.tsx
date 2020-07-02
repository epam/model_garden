import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { Box, IconButton } from '@material-ui/core';
import { Refresh } from '@material-ui/icons';
import 'antd/dist/antd.css';
import './TasksStatuses.css';
import { DropdownButton } from './DropdownButton';
import { useAppDispatch, useTypedSelector } from '../../store';
import {
  archiveLabelingTask,
  getLabelingTasks,
  retryLabelingTask
} from '../../store/tasksStatuses';
import { TableStateProps } from '../../models';
import { GetColumnSearchProps } from './GetColumnSearchProps';
import StatusField from './StatusField';
import { ConformationDialog } from '../shared';

export const TasksStatuses: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [openConformationDialog, setOpenConformationDialog] = React.useState(
    false
  );

  const [tableState, setTableState] = useState<TableStateProps>({
    page: 1,
    rowsPerPage: 10,
    searchProps: {},
    filterStatus: JSON.parse(
      localStorage.getItem('taskStatusFilter') as any
    ) || ['annotation', 'validation', 'completed', 'saved', 'failed'],
    sortOrder: undefined,
    sortField: undefined
  });

  const areTasksLoading = useTypedSelector(
    (state) => state.tasksStatuses.tasksLoading
  );
  const tasks = useTypedSelector((state) => state.tasksStatuses.tasks);
  const tasksCount = useTypedSelector((state) => state.tasksStatuses.count);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getLabelingTasks(tableState));
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

  const TASK_STATUSES_COLUMNS = [
    {
      title: 'Task Name',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      sorter: true,
      showSorterTooltip: false,
      filtered: tableState.searchProps.name,
      ...GetColumnSearchProps('name', updateSearchState, resetSearchState)
    },
    {
      title: 'Dataset',
      dataIndex: 'dataset',
      key: 'dataset',
      width: '20%',
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
      render: (text: string, record: { error: string; status: string }) => (
        <StatusField text={text} record={record} />
      ),
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
    setTableState((prevState: TableStateProps) => ({
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
        setOpenConformationDialog(false);
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

  const handleDisabled = selectedRowKeys.length <= 0;

  const handleRefresh = () => {
    dispatch(getLabelingTasks(tableState));
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

  const handleDialogOpen = () => {
    setOpenConformationDialog(true);
  };

  return (
    <div className={'task-statuses'}>
      <Box display="flex" alignItems="center" marginBottom={1}>
        <DropdownButton
          onArchive={handleDialogOpen}
          onRetry={handleRetry}
          disabled={handleDisabled}
        />
        <IconButton aria-label="refresh" onClick={handleRefresh}>
          <Refresh />
        </IconButton>
      </Box>

      <Table
        columns={TASK_STATUSES_COLUMNS as any}
        rowKey={(record) => record.id}
        rowSelection={rowSelection as any}
        rowClassName={(record) => `task-status-${record.status}`}
        dataSource={tasks}
        pagination={{
          pageSize: tableState.rowsPerPage,
          current: tableState.page,
          total: tasksCount,
          showSizeChanger: true,
          onShowSizeChange: onShowSizeChange
        }}
        loading={areTasksLoading}
        onChange={handleTableChange as any}
      />

      <ConformationDialog
        title="Archive Confirmation"
        closeButton="No, Keep Task(s)"
        confirmButton="Yes, Archive Task(s)"
        open={openConformationDialog}
        setOpen={setOpenConformationDialog}
        handleConfirm={handleArchive}
      >
        <p>Are you sure you want to archive selected tasks?</p>
      </ConformationDialog>
    </div>
  );
};
