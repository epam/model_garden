const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  imagesPaths: {
    type: Array,
    required: true
  },
  xmlsPaths: {
    type: Array,
    required: true
  }
});

module.exports = Task = mongoose.model('task', TaskSchema);