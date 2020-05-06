export interface LabelingTaskLabel {
  name: string;
  attributes: [];
}

export interface LabelingTaskData {
  name: string;
  owner: number;
  assignee: number;
  labels: LabelingTaskLabel[];
  image_quality: number,
  z_order?: boolean,
  segment_size?: string,
  overlap?: string,
  start_frame?: string,
  stop_frame?: string,
  frame_filter?: string,
  segments?: []
}

export interface LabelingTaskImagesData {
  remote_files: string[];
}

export interface LabelingTask {
  task_data: LabelingTaskData;
  images_data: LabelingTaskImagesData;
}

export type LabelingTaskRequestData  = {
  task_name: string;
  dataset_id: string;
  assignee_id: string;
  files_in_task: number;
  count_of_tasks: number;
};

export type LabelingTaskStatus = {
  userName: string;
  taskName: string;
  cvatInstance: string;
  status: string;
};
