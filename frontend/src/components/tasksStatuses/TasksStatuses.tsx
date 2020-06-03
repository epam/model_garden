import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Highlighter from 'react-highlight-words';
import {Table, Input, Button, Space} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import 'antd/dist/antd.css';
import './TasksStatuses.css';
import {DropdownButton} from './DropdownButton';
import {AppState} from '../../store';
import {archiveLabelingTask, getLabelingTasks, retryLabelingTask} from '../../store/labelingTask';
import {ROWS_PER_PAGE} from './constants';

export const TasksStatuses: React.FC = () => {
  const [pageValue, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [filterMap, setFilterMap] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const areTasksLoading = useSelector((state: AppState) => state.labelingTask.isLabelingTasksStatusesLoading);
  const tasks = useSelector(
    (state: AppState) => state.labelingTask.labelingTasksStatuses.tasks
  );
  const tasksCount = useSelector(
    (state: AppState) => state.labelingTask.labelingTasksStatuses.count
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getLabelingTasks(pageValue, ROWS_PER_PAGE, filterMap));
  }, []);

  let searchInput: Input | null;
  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value: string, record: any) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => searchInput && searchInput.select());
      }
    },
    render: (text: string) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  const TASK_STATUSES_COLUMNS = [
    {
      title: 'Task Name',
      dataIndex: 'name',
      width: '20%',
    ...getColumnSearchProps('name')
    },
    {
      title: 'Dataset',
      dataIndex: 'dataset',
      width: '20%',
      ...getColumnSearchProps('dataset')
    },
    {
      title: 'Labeler',
      dataIndex: 'labeler',
      ...getColumnSearchProps('labeler')
    },
    {
      title: 'Url',
      dataIndex: 'url',
      render: (value: string) => {
        let hostname = value;
        let res = /https?:\/\/(.+?)\/.*/.exec(value);
        if (res && res.length === 2) {
          hostname = res[1];
        }
        return (
          <a href={value} target="_blank" rel="noopener noreferrer">{hostname}</a>
        );
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      ...getColumnSearchProps('status')
    }
  ];

  const handleTableChange = (pagination: {pageSize: number, current: number, total: number}) => {
    setPage((prevState: any) => {
      if (prevState !== pagination.current) {
        dispatch(getLabelingTasks(pagination.current, pagination.pageSize, filterMap));
        return pagination.current;
      }
      return prevState;
    });
  };

  const handleSearch = (selectedKeys: Array<string>, confirm: any, dataIndex: string) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setPage(1);

    setFilterMap((prevState: any) => ({
      ...prevState, [dataIndex]: selectedKeys[0]
    }));
    dispatch(getLabelingTasks(1, ROWS_PER_PAGE,
      {...filterMap, [dataIndex]: selectedKeys[0]}));
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setPage(1);
    setSearchText('');
    setFilterMap({});
    dispatch(getLabelingTasks(1, ROWS_PER_PAGE, {}));
  };

  const onSelectChange = (values: Array<number & never>) => {
    setSelectedRowKeys(values);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleArchive: any = () => {
    if (selectedRowKeys.length > 0) {
    (dispatch(archiveLabelingTask(selectedRowKeys)) as any)
      .finally(() => {
        setSelectedRowKeys([]);
      })
    }
  }

  const handleRetry: any = () => {
    if (selectedRowKeys.length > 0) {
      (dispatch(retryLabelingTask(selectedRowKeys)) as any)
        .finally(() => {
          setSelectedRowKeys([]);
        })
    }
  }

  return (
      <div className={'task-statuses'}>
        <DropdownButton onArchive={handleArchive} onRetry={handleRetry}/>
        <Table
          columns={TASK_STATUSES_COLUMNS as any}
          rowKey={record => record.id}
          rowSelection={rowSelection as any}
          rowClassName={(record) => `task-status-${record.status}`}
          dataSource={tasks}
          pagination={{
            pageSize: ROWS_PER_PAGE,
            current: pageValue,
            total: tasksCount
          }}
          loading={areTasksLoading}
          onChange={handleTableChange as any}
        />
      </div>
  );
};
