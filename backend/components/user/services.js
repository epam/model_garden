const LabelingToolUser = require('./LabelingToolUser');

const getLabelingToolUsers = async () => {
  try {
    const dbResult = await LabelingToolUser.find();
    return dbResult;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

module.exports = {
  getLabelingToolUsers
};
