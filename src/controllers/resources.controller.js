const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { resourceService, mockService } = require('../services');
const { generateFakeDataListByCount } = require('../utils/faker');

const createResource = catchAsync(async (req, res) => {
  const resourceObj = JSON.parse(JSON.stringify(req.body));
  const params = pick(req.params, ['projectId']);
  resourceObj.projectId = params.projectId;
  const { responseSchema } = resourceObj;

  let resource = await resourceService.createResource(resourceObj);

  const response = generateFakeDataListByCount(resourceObj.count, responseSchema);

  const mockObj = {
    response,
    resourceId: resource._id,
  };

  const mock = await mockService.createMockData(mockObj);
  if (!mock) {
    await resourceService.deleteResourceById({ projectId: params.projectId, resourceId: resource._id });
    throw new ApiError(httpStatus.CONFLICT, 'conflict while creating mock data');
  }

  resourceObj.mockId = mock._id;

  Object.assign(params, { resourceId: resource._id });

  resource = await resourceService.updateResourceById(params, resourceObj);
  if (!resource) {
    throw new ApiError(httpStatus.CONFLICT, 'conflict while creating resource');
  }

  const newResource = JSON.parse(JSON.stringify(resource));
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

  let resource = await resourceService.getResourceById(params.resourceId);
  if (!resource) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
  }
  const mock = await mockService.getMockDataByResourceId(params.resourceId);
  if (!mock) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mock not found');
  }
  const { count, responseSchema } = req.body;

  let isCountUpdated = false;
  let isResponseSchemaUpdated = false;
  if (count !== resource.count) {
    isCountUpdated = true;
  }

  if (JSON.stringify(responseSchema) !== JSON.stringify(resource.responseSchema)) {
    isResponseSchemaUpdated = true;
  }
  let { response } = mock;
  if (isCountUpdated && isResponseSchemaUpdated) {
    response = generateFakeDataListByCount(count, responseSchema);
  } else if (isCountUpdated) {
    const countDiff = count - resource.count;
    if (countDiff > 0) {
      response = [...response, ...generateFakeDataListByCount(countDiff, responseSchema, resource.count)];
    } else if (countDiff < 0) {
      response.length = count;
    }
  } else if (isResponseSchemaUpdated) {
    response = generateFakeDataListByCount(resource.count, responseSchema);
  }

  const newMock = JSON.parse(JSON.stringify(mock));
  newMock.response = response;

  await mockService.updateMockDataResponseById(resource.id, newMock);

  resource = await resourceService.updateResourceById(params, req.body);
  const updatedResource = JSON.parse(JSON.stringify(resource));
  updatedResource.response = response;

  res.send(updatedResource);
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
