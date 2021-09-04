const express = require('express');
const validate = require('../../middlewares/validate');

const mockValidation = require('../../validations/mock.validation');
const mockController = require('../../controllers/mock.controller');

const router = express.Router();

router.route('/:prefix/:projectId/:resource').get(validate(mockValidation.getMockApiData), mockController.getMockApiData);

module.exports = router;
