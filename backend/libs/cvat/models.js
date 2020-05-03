// class LabelingTaskData {
//   constructor(
//     name,
//     assignee,
//     owner,
//     segments = [],
//     labels = [],
//     image_quality = 70,
//     z_order,
//     segment_size,
//     overlap,
//     start_frame,
//     stop_frame,
//   ) {
//     this.name = name;
//     this.assignee = assignee;
//     this.owner = owner;
//     this.segments = segments;
//     this.labels = labels;
//     this.image_quality = image_quality;
//     this.z_order = z_order;
//     this.segment_size = segment_size;
//     this.overlap = overlap;
//     this.start_frame = start_frame;
//     this.stop_frame = stop_frame;
//   }

//   toJson() {
//     return {
//       name = this.name,
//       assignee = this.assignee,
//       owner = this.owner,
//       segments = this.segments,
//       labels = this.labels,
//       image_quality = this.image_quality,
//       z_order = this.z_order,
//       segment_size = this.segment_size,
//       overlap = this.overlap,
//       start_frame = this.start_frame,
//       stop_frame = this.stop_frame,
//     }
//   }
// }

// class LabelingTaskImages {
//   constructor(remote_files) {
//     this.remote_files = remote_files;
//   }
// }

// module.exports = {
//   LabelingTaskData,
//   LabelingTaskImages
// };