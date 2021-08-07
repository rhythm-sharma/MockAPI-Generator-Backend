const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const projectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    prefix: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
projectSchema.plugin(toJSON);
projectSchema.plugin(paginate);

/**
 * Check if project name is taken by user
 * @param {String} name - The Project's name
 * @param {ObjectId} createdBy - The user's id
 * @returns {Promise<boolean>}
 */
projectSchema.statics.isProjectNameTakenByUser = async function (name, createdBy) {
  const projects = await this.findOne({ name, createdBy });
  return !!projects;
};

/**
 * @typedef Project
 */
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
