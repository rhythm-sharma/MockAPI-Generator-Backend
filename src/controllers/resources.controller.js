const httpStatus = require('http-status');
const pick = require('../utils/pick');
// const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { resourceService, mockService } = require('../services');

const createResource = catchAsync(async (req, res) => {
  const resourceObj = JSON.parse(JSON.stringify(req.body));
  const params = pick(req.params, ['projectId']);
  resourceObj.projectId = params.projectId;

  const { responseSchema, response } = resourceObj;

  delete resourceObj.responseSchema;
  delete resourceObj.response;

  let resource = await resourceService.createResource(resourceObj);

  const mockObj = {
    responseSchema,
    response,
    resourceId: resource._id,
  };

  const mock = await mockService.createMockData(mockObj);
  resourceObj.mockId = mock._id;

  Object.assign(params, { resourceId: resource._id });

  resource = await resourceService.updateResourceById(params, resourceObj);

  const newResource = JSON.parse(JSON.stringify(resource));
  newResource.responseSchema = responseSchema;
  newResource.response = response;

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

module.exports = {
  createResource,
  getResources,
  updateResource,
  deleteResource,
};
