const express = require('express');
const router = express.Router();
const stateController = require('../../controllers/statesController');

// Route for all states and CONUS and OCONUS
router.route('/states')
    .get(stateController.getAllStates);

// Route for single state
 router.route('/:code')
     .get(stateController.getState);

 // Route for state capital
router.route('/:state/capital')
    .get(stateController.getCapital);

// Route for state nickname
router.route('/:state/nickname')
    .get(stateController.getNickname);

// Route for state population
router.route('/:state/population')
    .get(stateController.getPopulation);

// Route for state admission date
router.route('/:state/admission')
    .get(stateController.getAdmission);

module.exports = router;