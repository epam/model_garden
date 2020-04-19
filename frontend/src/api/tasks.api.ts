import { Task } from "../models";

export const createTaskRequest = (taskData: Task) => {
  return fetch('http://localhost:9000/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(taskData)
  })
    .then(response => response.body)
    .catch(error => error.message);
};