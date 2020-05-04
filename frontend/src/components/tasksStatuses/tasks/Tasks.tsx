import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import "./Tasks.css";
import { useSelector } from "react-redux";
import { AppState } from "../../../store";
import { FormContainer } from "../../shared";

export const Tasks: React.FC = () => {
  const tasks = useSelector(
    (state: AppState) => state.labelingTask.labelingTasksStatuses
  );

  const taskStatus = (status: number) => {
    if (status === 1) return 'in progress';
    if (status === 2) return 'completed';
  };

  return (
    <div className="tasks">
      <FormContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell align="right">Task Name</TableCell>
              <TableCell align="right">CVAT Instance</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.taskName} style={+task.status === 2 ? { backgroundColor: 'lightgreen', color: 'white' } : {}}>
                <TableCell component="th" scope="row">
                  {task.userName}
                </TableCell>
                <TableCell align="right">{task.taskName}</TableCell>
                <TableCell align="right">{task.cvatInstance}</TableCell>
                <TableCell align="right" >
                  {taskStatus(+task.status)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </FormContainer>
    </div>
  );
};
