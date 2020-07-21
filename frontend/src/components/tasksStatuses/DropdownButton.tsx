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
    SelectedTasks.some((task) => task.status === 'archived');

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
  selectedRowKeys: number[];
}

export const DropdownButton: React.FC<DropdownButtonProps> = ({
  handleArchive,
  handleRetry,
  selectedRowKeys
}) => {
  const tasks = useTypedSelector((state) => state.tasksStatuses.tasks);

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
