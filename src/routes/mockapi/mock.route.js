const express = require('express');
const validate = require('../../middlewares/validate');

const mockValidation = require('../../validations/mock.validation');
const mockController = require('../../controllers/mock.controller');

const router = express.Router();

router
  .route('/:prefix/:projectId/:resource')
  .get(validate(mockValidation.getMockApiData), mockController.getMockApiData)
  .post(validate(mockValidation.appendMockApiDataById), mockController.appendMockApiDataById);

router
  .route('/:prefix/:projectId/:resource/:id')
  .get(validate(mockValidation.getMockApiDataById), mockController.getMockApiDataById)
  .put(validate(mockValidation.getAndCreateMockApiDataById), mockController.getAndCreateMockApiDataById)
  .delete(validate(mockValidation.deletMockApiDataById), mockController.deletMockApiDataById);

module.exports = router;
