import React from 'react';
import { Menu, Dropdown, Button } from 'antd';
import 'antd/dist/antd.css';
import './TasksStatuses.css';

const menu: any = (
  handleArchive: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  handleRetry: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
) => {
  return (
    <Menu>
      <Menu.Item className="action-menu-item">
        <Button onClick={handleArchive}>Archive</Button>
      </Menu.Item>
      <Menu.Item className="action-menu-item">
        <Button onClick={handleRetry}>Retry</Button>
      </Menu.Item>
    </Menu>
  );
};

interface DropdownButtonProps {
  onArchive: () => void;
  onRetry: () => void;
}

export const DropdownButton: React.FC<DropdownButtonProps> = ({
  onArchive,
  onRetry
}) => {
  return (
    <Dropdown
      className="action-button"
      overlay={menu(onArchive, onRetry)}
      placement="bottomLeft"
    >
      <Button>Actions</Button>
    </Dropdown>
  );
};
