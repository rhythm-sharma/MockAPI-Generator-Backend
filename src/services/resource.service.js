const httpStatus = require('http-status');
const { Resource } = require('../models');
const { projectService } = require('./index');
const ApiError = require('../utils/ApiError');

/**
 * Create a Resource
 * @param {Object} resourceBody
 * @returns {Promise<User>}
 */
const createResource = async (resourceBody) => {
  if (await Resource.isResourceNameAlreadyExists(resourceBody.name, resourceBody.projectId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Resource name already taken');
  }
  return Resource.create(resourceBody);
};

/**
 * Get Resource by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getResourceById = async (id) => {
  return Resource.findById(id);
};

/**
 * Query for Resources
 * @param {id} options - Projects's Id
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryResources = async (id, options) => {
  const resource = await Resource.paginate({ projectId: id }, options);
  return resource;
};

/**
 * Update Resource by id
 * @param {Object} params - Params options
 * @param {String} [params.resourceId] - Resource Id
 * @param {String} [params.projectId] - Projects Id
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateResourceById = async (params, updateBody) => {
  const { projectId, resourceId } = params;
  const project = await projectService.getProjectById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  const resource = await getResourceById(resourceId);
  if (!resource) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
  }
  Object.assign(resource, updateBody);
  await resource.save();
  return resource;
};

/**
 * Delete Resource by id
 * @param {Object} params - Params options
 * @param {String} [params.resourceId] - Resource Id
 * @param {String} [params.projectId] - Projects Id
 * @returns {Promise<User>}
 */
const deleteResourceById = async (params) => {
  const { projectId, resourceId } = params;
  const project = await projectService.getProjectById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  const resource = await getResourceById(resourceId);
  if (!resource) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
  }
  await resource.remove();
  return resource;
};

module.exports = {
  createResource,
  queryResources,
  updateResourceById,
  getResourceById,
  deleteResourceById,
};
