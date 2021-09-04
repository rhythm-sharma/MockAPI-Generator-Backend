const httpStatus = require('http-status');
const { Mock, Resource } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Mock Data
 * @param {Object} mockBody
 * @returns {Promise<Project>}
 */
const createMockData = async (mockBody) => Mock.create(mockBody);

/**
 * Get Mock Data by Resource id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getMockDataResourceById = async (id) => Mock.find({ resourceId: id });

/**
 * Get Mock Data by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getMockDataById = async (id) => Mock.findById({ _id: id });

/**
 * Delete Mock Data by Resource id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const deleteMockDataByResourceId = async (id) => Mock.deleteMany({ resourceId: id });

/**
 * Query for Mock Data
 * @param {Object} params - Query options
 * @param {number} [params.projectId] - Project Id
 * @param {number} [params.prefix] - prefix
 * @param {number} [params.resource] - Resource Name
 * @returns {Promise<QueryResult>}
 */
const queryMockData = async (params) => {
  const resource = await Resource.findOne({ projectId: params.projectId, name: params.resource });
  if (resource.length <= 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Data does exits');
  }
  const mockData = await getMockDataById(resource.mockId);
  const { response } = mockData;
  return response;
};

module.exports = {
  createMockData,
  getMockDataResourceById,
  deleteMockDataByResourceId,
  queryMockData,
  getMockDataById,
};
