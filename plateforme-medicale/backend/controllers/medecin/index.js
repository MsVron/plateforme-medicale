const doctorController = require('./doctorController');
const availabilityController = require('./availabilityController');
const patientController = require('./patientController');
const publicController = require('./publicController');
const institutionController = require('./institutionController');

module.exports = {
  ...doctorController,
  ...availabilityController,
  ...patientController,
  ...publicController,
  ...institutionController
}; 