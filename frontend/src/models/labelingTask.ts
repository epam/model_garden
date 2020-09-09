export interface ILabelingTaskLabel {
  name: string;
  attributes: [];
}

export interface ILabelingTaskData {
  name: string;
  owner: number;
  assignee: number;
  labels: ILabelingTaskLabel[];
  image_quality: number;
  z_order?: boolean;
  segment_size?: string;
  overlap?: string;
  start_frame?: string;
  stop_frame?: string;
  frame_filter?: string;
  segments?: [];
}

export interface ILabelingTaskImagesData {
  remote_files: string[];
}

export interface ILabelingTask {
  task_data: ILabelingTaskData;
  images_data: ILabelingTaskImagesData;
}

export interface ILabelingTaskRequestData {
  task_name: string;
  dataset_id: string;
  assignee_id: string;
  files_in_task: number;
  count_of_tasks: number;
}

export interface ILabelingTaskStatus {
  id: number;
  url: string;
  name: string;
  mode: string;
  size?: number;
  owner?: number;
  assignee?: number;
  created_date: string;
  updated_date: string;
  overlap?: number;
  segment_size?: number;
  z_order?: boolean;
  status: string;
  labels?: object;
  segments?: object;
  image_quality?: number;
  start_frame?: number;
  stop_frame?: number;
  frame_filter?: string;
  project?: number;
}
