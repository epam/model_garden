import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createTask } from '../store/tasks';
import { Task } from '../models';
import { login } from '../store/auth';

const taskData: Task = {
  task_data: {
      name: "NewTask",
      owner: 1,
      assignee: 1,
      labels: [
          {
              name: "newLabel",
              attributes: []
          }
      ],
      image_quality: 70,
      z_order: false,
      segment_size: "10",
      overlap: "1",
      // start_frame: "1",
      // stop_frame: "1",
      // frame_filter: "step=1",
      segments: []
  },
  images_data: {
      remote_files: [
          "https://cdn.pixabay.com/photo/2015/06/19/21/24/the-road-815297__340.jpg",
          "https://cdn.cnn.com/cnnnext/dam/assets/191203174105-edward-whitaker-1-large-169.jpg",
          "https://www.gettyimages.com/gi-resources/images/500px/983794168.jpg"
      ]
  }
};

export const MainPage: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(login('epam_labler', 'epam_mlcv'));
  }, []);

  const handleCreateTask = () => {
    dispatch(createTask(taskData));
  };

  return (
    <div>
      <button onClick={handleCreateTask}>Create Task</button>
    </div>
  );
};