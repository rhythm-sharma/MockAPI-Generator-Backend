const httpStatus = require('http-status');
const { Project } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a project
 * @param {Object} userBody
 * @returns {Promise<Project>}
 */
const createProject = async (projectBody) => {
  if (await Project.isProjectNameTakenByUser(projectBody.name, projectBody.createdBy)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Project name already taken');
  }
  return Project.create(projectBody);
};

/**
 * Query for Project
 * @param {id} options - Projects's Id
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryProjects = async (id, options) => {
  const project = await Project.paginate({ createdBy: id }, options);
  return project;
};

/**
 * Get project by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getProjectById = async (id) => {
  return Project.findById(id);
};

/**
 * Delete project by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const deleteProjectById = async (id) => {
  const project = await getProjectById(id);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  await project.remove();
  return project;
};

/**
 * Update project by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateProjectById = async (id, updateBody) => {
  const project = await getProjectById(id);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  Object.assign(project, updateBody);
  await project.save();
  return project;
};

module.exports = {
  createProject,
  queryProjects,
  getProjectById,
  deleteProjectById,
  updateProjectById,
};
