const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LabelingToolUserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
  },
});

module.exports = LabelingToolUser = mongoose.model(
  "labeling_tool_users",
  LabelingToolUserSchema
);
