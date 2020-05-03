const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LabelingTaskSchema = new Schema({
  taskName: {
    type: String
  },
  imagesPaths: {
    type: Array,
    required: true
  },
  xmlsPaths: {
    type: Array,
    required: true
  }
});

module.exports = LabelingTask = mongoose.model('labeling_task', LabelingTaskSchema);