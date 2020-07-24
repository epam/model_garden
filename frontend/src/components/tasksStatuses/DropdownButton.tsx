import React from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { useTypedSelector } from '../../store';
import 'antd/dist/antd.css';
import './TasksStatuses.css';

const menu: any = (
  handleArchive: any,
  handleRetry: any,
  selectedRowKeys: number[],
  tasks: any[]
) => {
  const SelectedTasks = tasks.filter((task) =>
    selectedRowKeys.includes(task.id)
  );
  const isArchiveDisabled =
    !SelectedTasks.length ||
    SelectedTasks.some((task) => task.status === 'archived') ||
    SelectedTasks.some((task) => task.status !== 'saved');

  const isRetryDisabled =
    !SelectedTasks.length ||
    SelectedTasks.some((task) => task.status !== 'failed');

  return (
    <Menu>
      <Menu.Item className="action-menu-item">
        <Button onClick={handleArchive} disabled={isArchiveDisabled}>
          Archive
        </Button>
      </Menu.Item>
      <Menu.Item className="action-menu-item">
        <Button onClick={handleRetry} disabled={isRetryDisabled}>
          Retry
        </Button>
      </Menu.Item>
    </Menu>
  );
};

interface DropdownButtonProps {
  handleArchive: () => void;
  handleRetry: () => void;
}

export const DropdownButton: React.FC<DropdownButtonProps> = ({
  handleArchive,
  handleRetry
}) => {
  const tasks = useTypedSelector(({ tasksStatuses }) => tasksStatuses.tasks);
  const selectedRowKeys = useTypedSelector(
    ({ tasksStatuses }) => tasksStatuses.selectedRowKeys
  );

  return (
    <Dropdown
      className="action-button"
      overlay={menu(handleArchive, handleRetry, selectedRowKeys, tasks)}
      placement="bottomLeft"
    >
      <Button>Actions</Button>
    </Dropdown>
  );
};
