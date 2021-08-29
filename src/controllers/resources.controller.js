const httpStatus = require('http-status');
const pick = require('../utils/pick');
// const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { resourceService } = require('../services');

const createResource = catchAsync(async (req, res) => {
  const resourceObj = JSON.parse(JSON.stringify(req.body));
  const params = pick(req.params, ['projectId']);
  resourceObj.projectId = params.projectId;
  const resource = await resourceService.createResource(resourceObj);
  res.status(httpStatus.CREATED).send(resource);
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
