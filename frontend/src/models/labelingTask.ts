export interface LabelingTaskLabel {
  name: string;
  attributes: [];
}

export interface LabelingTaskData {
  name: string;
  owner: number;
  assignee: number;
  labels: LabelingTaskLabel[];
  image_quality: number;
  z_order?: boolean;
  segment_size?: string;
  overlap?: string;
  start_frame?: string;
  stop_frame?: string;
  frame_filter?: string;
  segments?: [];
}

export interface LabelingTaskImagesData {
  remote_files: string[];
}

export interface LabelingTask {
  task_data: LabelingTaskData;
  images_data: LabelingTaskImagesData;
}

export interface LabelingTaskRequestData {
  task_name: string;
  dataset_id: string;
  assignee_id: string;
  files_in_task: number;
  count_of_tasks: number;
}

export interface LabelingTaskStatus {
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
