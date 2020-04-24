const LabelingToolUser = require('./LabelingToolUser');

const getLabelingToolUsers = async () => {
  const dbResult = await LabelingToolUser.find();
  return dbResult;
};

module.exports = {
  getLabelingToolUsers
};
