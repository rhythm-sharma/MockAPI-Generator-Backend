const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getMockApiData = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
    prefix: Joi.string().required(),
    resource: Joi.string().required(),
  }),
};

const getMockApiDataById = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
    prefix: Joi.string().required(),
    resource: Joi.string().required(),
    id: Joi.number().required(),
  }),
};

const deletMockApiDataById = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
    prefix: Joi.string().required(),
    resource: Joi.string().required(),
    id: Joi.number().required(),
  }),
};

const appendMockApiDataById = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
    prefix: Joi.string().required(),
    resource: Joi.string().required(),
  }),
};

const getAndCreateMockApiDataById = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
    prefix: Joi.string().required(),
    resource: Joi.string().required(),
    id: Joi.number().required(),
  }),
};

module.exports = {
  getMockApiData,
  getMockApiDataById,
  deletMockApiDataById,
  appendMockApiDataById,
  getAndCreateMockApiDataById,
};
