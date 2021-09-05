const httpStatus = require('http-status');
const pick = require('../utils/pick');
// const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { resourceService, mockService } = require('../services');
const { generateFakeDataListByCount } = require('../utils/faker');

const createResource = catchAsync(async (req, res) => {
  const resourceObj = JSON.parse(JSON.stringify(req.body));
  const params = pick(req.params, ['projectId']);
  resourceObj.projectId = params.projectId;

  const { responseSchema } = resourceObj;

  delete resourceObj.responseSchema;

  let resource = await resourceService.createResource(resourceObj);

  const mockObj = {
    responseSchema,
    resourceId: resource._id,
  };

  const mock = await mockService.createMockData(mockObj);
  resourceObj.mockId = mock._id;

  Object.assign(params, { resourceId: resource._id });

  resource = await resourceService.updateResourceById(params, resourceObj);

  const newResource = JSON.parse(JSON.stringify(resource));
  newResource.responseSchema = responseSchema;

  res.status(httpStatus.CREATED).send(newResource);
});

const getResources = catchAsync(async (req, res) => {
  const params = pick(req.params, ['projectId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await resourceService.queryResources(params.projectId, options);
  res.send(result);
});

const updateResource = catchAsync(async (req, res) => {
  const params = pick(req.params, ['projectId', 'resourceId']);
  const project = await resourceService.updateResourceById(params, req.body);
  res.send(project);
});

const deleteResource = catchAsync(async (req, res) => {
  const params = pick(req.params, ['projectId', 'resourceId']);
  await resourceService.deleteResourceById(params);
  res.status(httpStatus.NO_CONTENT).send();
});

const generateMockResponseData = catchAsync(async (req, res) => {
  const params = pick(req.params, ['projectId', 'resourceId']);
  const { count } = req.body;
  const mock = await mockService.getMockDataResourceById(params.resourceId);
  const fakeList = generateFakeDataListByCount(count, mock.responseSchema);
  const newMock = JSON.parse(JSON.stringify(mock));
  newMock.response = fakeList;
  const updatedMock = await mockService.updateMockDataResponseById(params.resourceId, newMock);
  const resource = await resourceService.getResourceById(params.resourceId);
  const responseObj = JSON.parse(JSON.stringify(resource));
  responseObj.responseSchema = updatedMock.responseSchema;
  responseObj.response = updatedMock.response;
  res.send(responseObj);
});

module.exports = {
  createResource,
  getResources,
  updateResource,
  deleteResource,
  generateMockResponseData,
};
