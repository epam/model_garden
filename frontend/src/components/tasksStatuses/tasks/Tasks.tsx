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
              <TableRow key={task.id} style={task.status === 'completed' ? { backgroundColor: 'lightgreen', color: 'white' } : {}}>
                <TableCell component="th" scope="row">
                  {task.assignee}
                </TableCell>
                <TableCell align="right">{task.name}</TableCell>
                <TableCell align="right">-</TableCell>
                <TableCell align="right" >
                  {task.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </FormContainer>
    </div>
  );
};
