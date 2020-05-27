import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Highlighter from 'react-highlight-words';
import {SearchOutlined} from '@ant-design/icons';
import {Table, Input, Button, Space} from 'antd';
import 'antd/dist/antd.css';
import './TasksStatuses.css';
import {AppState} from '../../store';
import {getDatasets, getLabelingTasks} from '../../store/labelingTask';

export const TasksStatusesAntDesign: React.FC = () => {
  const [pageValue, setPage] = useState(1);
  const [rowsPerPageValue, setRowsPerPage] = useState(7);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [filterMap, setFilterMap] = useState({});

  const dispatch = useDispatch();
  const currentBucketId = useSelector((state: AppState) => state.labelingTask.currentBucketId);
  const currentDatasetId = useSelector((state: AppState) => state.labelingTask.currentDatasetId);
  const tasks = useSelector(
    (state: AppState) => state.labelingTask.labelingTasksStatuses.tasks
  );
  const tasksCount = useSelector(
    (state: AppState) => state.labelingTask.labelingTasksStatuses.count
  );
  const areTasksLoading = useSelector((state: AppState) => state.labelingTask.isLabelingTasksStatusesLoading);

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
      },
      ...getColumnSearchProps('url')
    },
    {
      title: 'Status',
      dataIndex: 'status',
      ...getColumnSearchProps('status')
    }
  ];

  useEffect(() => {
    if (currentBucketId) {
      dispatch(getDatasets(currentBucketId));
    }
  }, [dispatch, currentBucketId]);

  useEffect(() => {
    dispatch(getLabelingTasks(currentBucketId, currentDatasetId, pageValue, rowsPerPageValue, filterMap));
  }, []);

  const handleTableChange = (pagination: {pageSize: number, current: number, total: number}) => {
    setPage(pagination.current)
    dispatch(getLabelingTasks(currentBucketId, currentDatasetId, pagination.current, pagination.pageSize, filterMap));
  };

  const handleSearch = (selectedKeys: Array<string>, confirm: any, dataIndex: string) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setPage(1);

    setFilterMap((prevState: any) => ({
      ...prevState, [dataIndex]: selectedKeys[0]
    }));

    dispatch(getLabelingTasks(currentBucketId, currentDatasetId, 1, rowsPerPageValue,
      {...filterMap, [dataIndex]: selectedKeys[0]}));
  };
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setPage(1);
    setSearchText('');

    setFilterMap({});

    dispatch(getLabelingTasks(currentBucketId, currentDatasetId, 1, rowsPerPageValue, {}));
  };

  return (
      <div className={'task-statuses'}>
        <Table
          columns={TASK_STATUSES_COLUMNS as any}
          rowKey={record => record.id}
          dataSource={tasks}
          pagination={{
            pageSize: rowsPerPageValue,
            current: pageValue,
            total: tasksCount
          }}
          loading={areTasksLoading}
          onChange={handleTableChange as any}
        />
      </div>
  );
};
