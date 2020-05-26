import React, { useEffect, useState } from "react";
import { Snackbar, Link } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

interface NotificationProps {
  newTask: {location: string};
  onClose: () => void,
}

export const Notification: React.FC<NotificationProps> = ({
  newTask,
  onClose,
}: NotificationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(
    () => setIsOpen(newTask.location !== ""),
    [newTask]
  );

  return (
    <Snackbar open={isOpen}
              autoHideDuration={6000}
              onClose={onClose}
              anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
      <Alert onClose={onClose} severity="success">
        <Link href={newTask.location} color="inherit" underline="always" target="_blank" rel="noopener">
        A new task
        </Link>
        &nbsp;has been created
      </Alert>
    </Snackbar>
  );
};
