const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const mockSchema = mongoose.Schema(
  {
    responseSchema: {
      type: Array,
      required: true,
    },
    response: {
      type: Array,
      required: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
mockSchema.plugin(toJSON);

/**
 * @typedef Mock
 */
const Mock = mongoose.model('MockData', mockSchema);

module.exports = Mock;
