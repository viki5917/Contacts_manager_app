const { constants } = require("../constants");
const errorHandler = (error, request, response, next) => {
  const statusCode = response.statusCode ? response.statusCode : 500;
  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      response.json({
        title: "Validation Failed",
        message: error.message,
        strackTrace: error.stack,
      });
      break;
    case constants.NOT_FOUND:
      response.json({
        title: "Not Found",
        message: error.message,
        strackTrace: error.stack,
      });
      break;
    case constants.UNAUTHORIZED:
      response.json({
        title: "unauthorized",
        message: error.message,
        strackTrace: error.stack,
      });
      break;
    case constants.FORBIDDEN:
      response.json({
        title: "forbidden",
        message: error.message,
        strackTrace: error.stack,
      });
      break;
    case constants.SERVER_ERROR:
      response.json({
        title: "server error",
        message: error.message,
        strackTrace: error.stack,
      });
      break;
    default:
      console.log("No Error,All good!");
      break;
  }
};

module.exports = errorHandler;
