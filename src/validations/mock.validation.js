const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getMockApiData = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
    prefix: Joi.string().required(),
    resource: Joi.string().required(),
  }),
};

module.exports = {
  getMockApiData,
};
