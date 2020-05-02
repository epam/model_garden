const { ErrorHandler } = require("../../utils/errorHandler");
// const userServices = require("./services");
const cvatServices = require("../../libs/cvat/services");

const getLabelingToolUsers = async (request, response, next) => {
  try {
    const cvatUsers = await cvatServices.getUsers();
    console.log("CVAT users: ", cvatUsers);
    const users = cvatUsers.results.map((user) => ({
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
    }));
    // const dbResult = await userServices.getLabelingToolUsers();
    response.send(users);
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }
};

module.exports = {
  getLabelingToolUsers,
};
