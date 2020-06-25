import React from "react";
import { Menu, Dropdown, Button } from "antd";
import "antd/dist/antd.css";
import "./TasksStatuses.css";

const menu: any = (
  handleArchive: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  handleRetry: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  enabled: any
) => {
  return (
    <Menu>
      <Menu.Item>
        <Button
          className={enabled ? "disabled" : ""}
          onClick={handleArchive}
          disabled={enabled}
        >
          Archive
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button
          className={enabled ? "disabled" : ""}
          onClick={handleRetry}
          disabled={enabled}
        >
          Retry
        </Button>
      </Menu.Item>
    </Menu>
  );
};

interface DropdownButtonProps {
  onArchive: () => void;
  onRetry: () => void;
  className: any;
  disabled: any;
}

export const DropdownButton: React.FC<DropdownButtonProps> = ({
  onArchive,
  onRetry,
  className,
  disabled
}) => {
  return (
    <Dropdown
      overlay={menu(onArchive, onRetry, className, disabled)}
      placement="bottomLeft"
    >
      <Button>Actions</Button>
    </Dropdown>
  );
};
