const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { mockService } = require('../services');

const getMockApiData = catchAsync(async (req, res) => {
  const params = pick(req.params, ['prefix', 'projectId', 'resource']);

  const result = await mockService.queryMockData(params);
  res.send(result);
});

const getMockApiDataById = catchAsync(async (req, res) => {
  const params = pick(req.params, ['prefix', 'projectId', 'resource', 'id']);
  const result = await mockService.queryMockDataByResponseObjectId(params);
  res.send(result);
});

const deletMockApiDataById = catchAsync(async (req, res) => {
  const params = pick(req.params, ['prefix', 'projectId', 'resource', 'id']);
  const result = await mockService.deleteMockDataByResponseObjectId(params);
  res.send(result);
});

const appendMockApiDataById = catchAsync(async (req, res) => {
  const params = pick(req.params, ['prefix', 'projectId', 'resource']);
  const result = await mockService.appendMockDataByResponseObjectId(params);
  res.send(result);
});

const getAndCreateMockApiDataById = catchAsync(async (req, res) => {
  const { body } = req;
  const params = pick(req.params, ['prefix', 'projectId', 'resource', 'id']);
  const result = await mockService.getAndCreateMockDataByResponseObjectId(body, params);
  res.send(result);
});

module.exports = {
  getMockApiData,
  getMockApiDataById,
  getAndCreateMockApiDataById,
  deletMockApiDataById,
  appendMockApiDataById,
};
