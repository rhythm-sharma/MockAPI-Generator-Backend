const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createResource = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    prefix: Joi.string().required(),
    count: Joi.number().required(),
    responseSchema: Joi.array().required(),
    endpoints: Joi.array().items({
      method: Joi.string().required(),
      url: Joi.string().required(),
      enabled: Joi.boolean().required(),
    }),
  }),
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
  }),
};

const getResources = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateResource = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    prefix: Joi.string().required(),
    count: Joi.number().required(),
    responseSchema: Joi.array().required(),
    endpoints: Joi.array().items({
      method: Joi.string().required(),
      url: Joi.string().required(),
      enabled: Joi.boolean().required(),
    }),
  }),
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
    resourceId: Joi.string().custom(objectId).required(),
  }),
};

const deleteResource = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
    resourceId: Joi.string().custom(objectId).required(),
  }),
};

const generateMockResponseData = {
  body: Joi.object().keys({
    count: Joi.number().required(),
  }),
};

module.exports = {
  createResource,
  getResources,
  updateResource,
  deleteResource,
  generateMockResponseData,
};
