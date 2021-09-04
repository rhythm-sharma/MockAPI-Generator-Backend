// const httpStatus = require('http-status');
// const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { mockService } = require('../services');

const getMockApiData = catchAsync(async (req, res) => {
  const params = pick(req.params, ['prefix', 'projectId', 'resource']);
  // req.params.route
  // ['api/v1', 'project id', 'resourse name']
  // const { route } = req.params;

  // let params = route.split('/');
  // const resourseName = params[params.length - 1];
  // const projectId = params[params.length - 2];

  // let prefix = '';
  // if (params.length >= 2) {
  //   params.forEach((item, index) => {
  //     if (index < params.length - 2) {
  //       prefix += item;
  //     }
  //   });
  // }

  // params = [prefix, projectId, resourseName];

  const result = await mockService.queryMockData(params);
  res.send(result);
});

module.exports = {
  getMockApiData,
};
