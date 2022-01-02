const httpStatus = require('http-status');
const { Mock, Resource } = require('../models');
const ApiError = require('../utils/ApiError');
const { generateFakeDataObject } = require('../utils/faker');
const { isEmptyObj } = require('../utils/util');

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
const getMockDataByResourceId = async (id) => Mock.findOne({ resourceId: id });

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
    throw new ApiError(httpStatus.NOT_FOUND, 'Data does not exits');
  }
  const mockData = await getMockDataById(resource.mockId);
  const { response } = mockData;
  return response;
};

/**
 * Query for Mock Data By Response ObjectId
 * @param {Object} params - Query options
 * @param {number} [params.projectId] - Project Id
 * @param {number} [params.prefix] - prefix
 * @param {number} [params.resource] - Resource Name
 * @param {number} [params.id] - Response object Id
 * @returns {Promise<QueryResult>}
 */
const queryMockDataByResponseObjectId = async (params) => {
  const resource = await Resource.findOne({ projectId: params.projectId, name: params.resource });
  if (!resource) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Data does not exits');
  }
  let result = {};
  await Mock.findOne({ _id: resource.mockId }, (err, data) => {
    if (err) {
      throw new ApiError(httpStatus.NOT_FOUND, err);
    }
    result = data.response.find((res, index) => index + 1 === params.id);
  }).exec();
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }
  return result;
};

/**
 * Update Mock by resource id
 * @param {ObjectId} id resource id
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateMockDataResponseById = async (id, updateBody) => {
  const mock = await getMockDataByResourceId(id);
  if (!mock) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mock Data not found');
  }
  Object.assign(mock, updateBody);
  await mock.save();
  return mock;
};

/**
 * Delete for Mock Data By Response ObjectId
 * @param {Object} params - Query options
 * @param {number} [params.projectId] - Project Id
 * @param {number} [params.prefix] - prefix
 * @param {number} [params.resource] - Resource Name
 * @param {number} [params.id] - Response object Id
 * @returns {Promise<QueryResult>}
 */
const deleteMockDataByResponseObjectId = async (params) => {
  const resource = await Resource.findOne({ projectId: params.projectId, name: params.resource });
  if (!resource) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Data does not exits');
  }
  let result = {};
  const mock = await getMockDataByResourceId(resource._id);
  if (!mock) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const newMock = JSON.parse(JSON.stringify(mock));

  result = newMock.response.find((res) => res.id === `${params.id}`);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  newMock.response.splice(params.id - 1, 1);

  await updateMockDataResponseById(resource._id, newMock);

  return result;
};

/**
 * Delete for Mock Data By Response ObjectId
 * @param {Object} params - Query options
 * @param {number} [params.projectId] - Project Id
 * @param {number} [params.prefix] - prefix
 * @param {number} [params.resource] - Resource Name
 * @returns {Promise<QueryResult>}
 */
const appendMockDataByResponseObjectId = async (params) => {
  const resource = await Resource.findOne({ projectId: params.projectId, name: params.resource });
  if (!resource) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Data does not exits');
  }
  let result = {};
  const mock = await getMockDataByResourceId(resource._id);
  if (!mock) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const newMock = JSON.parse(JSON.stringify(mock));

  result = generateFakeDataObject(newMock.response.length, resource.responseSchema);

  newMock.response.push(result);

  await updateMockDataResponseById(resource._id, newMock);

  return result;
};

/**
 * Get or Create Mock Data Object based on :id
 * if :id exists
 * (1) if body is empty then return the value
 * (2) if body exist update the object in response
 * if :id not exists
 * return 404
 * @param {Object} body request body
 * @param {Object} params - Query options
 * @param {number} [params.projectId] - Project Id
 * @param {number} [params.prefix] - prefix
 * @param {number} [params.resource] - Resource Name
 * @param {number} [params.resource] - Mock Data object index
 * @returns {Promise<QueryResult>}
 */
const getAndCreateMockDataByResponseObjectId = async (body, params) => {
  const resource = await Resource.findOne({ projectId: params.projectId, name: params.resource }).exec();
  if (!resource) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Data does not exits');
  }

  const mock = await Mock.findOne({ _id: resource.mockId }).exec();
  const { response } = mock;

  if (!response[params.id - 1]) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const newMock = JSON.parse(JSON.stringify(mock));
  let tempResponse = [];
  const tempBody = {
    ...response[params.id - 1],
    ...body,
    id: params.id,
  };
  if (!isEmptyObj(body)) {
    tempResponse = JSON.parse(JSON.stringify(response));
    tempResponse[params.id - 1] = tempBody;
    newMock.response = tempResponse;
    await updateMockDataResponseById(resource._id, newMock);
    return tempBody;
  }
  return tempBody;
};

module.exports = {
  createMockData,
  getMockDataByResourceId,
  deleteMockDataByResourceId,
  queryMockData,
  queryMockDataByResponseObjectId,
  getMockDataById,
  updateMockDataResponseById,
  deleteMockDataByResponseObjectId,
  appendMockDataByResponseObjectId,
  getAndCreateMockDataByResponseObjectId,
};
