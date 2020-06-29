import React from 'react';
import { Menu, Dropdown, Button } from 'antd';
import 'antd/dist/antd.css';
import './TasksStatuses.css';

const menu: any = (
  handleArchive: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  handleRetry: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  isArchiveDisabled: any
) => {
  return (
    <Menu>
      <Menu.Item className="action-menu-item">
        <Button onClick={handleArchive} disabled={isArchiveDisabled}>
          Archive
        </Button>
      </Menu.Item>
      <Menu.Item className="action-menu-item">
        <Button onClick={handleRetry} disabled={isArchiveDisabled}>
          Retry
        </Button>
      </Menu.Item>
    </Menu>
  );
};

interface DropdownButtonProps {
  onArchive: () => void;
  onRetry: () => void;
  disabled: any;
}

export const DropdownButton: React.FC<DropdownButtonProps> = ({
  onArchive,
  onRetry,
  disabled
}) => {
  return (
    <Dropdown
      className="action-button"
      overlay={menu(onArchive, onRetry, disabled)}
      placement="bottomLeft"
    >
      <Button>Actions</Button>
    </Dropdown>
  );
};
