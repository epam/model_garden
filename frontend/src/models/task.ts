export interface TaskLabel {
  name: string;
  attributes: [];
}

export interface TaskData {
  name: string;
  owner: number;
  assignee: number;
  labels: TaskLabel[];
  image_quality: number,
  z_order?: boolean,
  segment_size?: string,
  overlap?: string,
  start_frame?: string,
  stop_frame?: string,
  frame_filter?: string,
  segments?: []
}

export interface TaskImagesData {
  remote_files: string[];
}

export interface Task {
  task_data: TaskData;
  images_data: TaskImagesData;
}
