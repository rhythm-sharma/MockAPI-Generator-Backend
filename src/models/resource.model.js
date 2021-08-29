const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const endpointSchema = mongoose.Schema({
  method: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  enabled: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const resourceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    projectId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    prefix: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    responseSchema: [],
    endpoints: [endpointSchema],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
resourceSchema.plugin(toJSON);
resourceSchema.plugin(paginate);

/**
 * Check if resource name is taken inside Project
 * @param {String} name - The Resource's name
 * @param {ObjectId} createdBy - The project's id
 * @returns {Promise<boolean>}
 */
resourceSchema.statics.isResourceNameAlreadyExists = async function (name, projectId) {
  const resources = await this.findOne({ name, projectId });
  return !!resources;
};

/**
 * @typedef Resource
 */
const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
