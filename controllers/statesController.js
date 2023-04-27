const data = {
    states: require('../model/statesData.json'),
    setStates: function (data) {this.states = data}
}
const State = require('../model/State.js');

// This function checks if the user would like all the state data in the GET request, or
// if the user just wants the CONUS states or the OCONUS states. The response is in jason.
const getAllStates = (req, res) => {
    const contig = req.query.contig;
    let states = data.states;
    if (contig === 'true') {
        states = states.filter(state => state.code !== 'AK' && state.code !== 'HI');
    } else if (contig === 'false') {
        states = states.filter(state => state.code === 'AK' || state.code === 'HI');
    } else {
        states = data.states;
    }
    res.json(states);
}

// This function returns data specific to one state
const getState = (req, res) => {
    const state = data.states.find(state => state.code === req.params.code);
    if (!state) {
        return res.status(400).json({ "message": `State code ${req.params.code} not found`})
    }
    res.json(state);
}

// This function returns the capital of the state
const getCapital = (req, res) => {
    const location = req.params.state.toUpperCase();
    const results = data.states.find((item) => item.code === location);
    if (!results) {
        return res.status(404).json({ "message": "Invalid state abbreviation parameter"})
    } else {
        const { state, capital_city: capital } = results;
        const response = { state, capital };
        res.json(response);
    }
}

// This function returns the nickname of the state
const getNickname = (req, res) => {
    const location = req.params.state.toUpperCase();
    const results = data.states.find((item) => item.code === location);
    if (!results) {
        return res.status(404).json({ "message": "Invalid state abbreviation parameter"})
    } else {
        const { state, nickname } = results;
        const response = { state, nickname };
        res.json(response);
    }
}

// This function returns the population of the state
const getPopulation = (req, res) => {
    const location = req.params.state.toUpperCase();
    const results = data.states.find((item) => item.code === location);
    if (!results) {
        return res.status(404).json({ "message": "Invalid state abbreviation parameter"})
    } else {
        const { state, population } = results;
        const formattedPopulation = population.toLocaleString();
        const response = { state, population: formattedPopulation };
        res.json(response);
    }
}

// This function returns the population of the state
const getAdmission = (req, res) => {
    const location = req.params.state.toUpperCase();
    const results = data.states.find((item) => item.code === location);
    if (!results) {
        return res.status(404).json({ "message": "Invalid state abbreviation parameter"})
    } else {
        const { state, admission_date: admitted } = results;
        const response = { state, admitted };
        res.json(response);
    }
}

module.exports = {
    getAllStates,
    getState,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission
}
