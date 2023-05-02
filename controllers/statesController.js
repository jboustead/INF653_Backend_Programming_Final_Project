const data = {
    states: require('../model/statesData.json'),
    setStates: function (data) {this.states = data}
}
const State = require('../model/State.js');

// This function checks if the user would like all the state data in the GET request, or
// if the user just wants the CONUS states or the OCONUS states. The response is in jason.
const getAllStates = async (req, res) => {
    const contig = req.query.contig;
    let states;
    if (contig === 'true') {
        states = data.states.filter(state => state.code !== 'AK' && state.code !== 'HI');
    } else if (contig === 'false') {
        states = data.states.filter(state => state.code === 'AK' || state.code === 'HI');
    } else {
        states = data.states;
    }

    // This will get all the funfacts for all states
    const mongoDB = await State.find({}, { _id: 0, code: 1, funfacts: 1 }).exec();
    mongoDB.forEach((data) => {
        const state = states.find(states => states.code === data.code);
        if (state) {
           state.funfacts = data.funfacts;
        }
    })

    // Return the information to the user
    res.json(states);
}

// This function returns data specific to one state
const getState = async (req, res) => {
    const state = data.states.find(state => state.code === req.params.code.toUpperCase());
    if (!state) {
        return res.status(400).json({ "message": `Invalid state abbreviation parameter`})
    }

    // // This will get all the funfacts for all states
    const mongoDB = await State.find({}, { _id: 0, code: 1, funfacts: 1 }).exec();
    mongoDB.forEach((data) => {
         if (data.code === state.code) {
             state.funfacts = data.funfacts;
         }
     })

    res.json(state);
}

// This function returns a random fun fact about a state
const getFunFact = async (req, res) => {
    const location = req.params.state.toUpperCase();
    const results = data.states.find((item) => item.code === location);
    console.log(results);
    if (!results) {
        return res.status(404).json({"message": "Invalid state abbreviation parameter"})
    }

    const stateName = results.state;
    const mongoDB = await State.find({}, { _id: 0, code: 1, funfacts: 1 }).exec();

    if (!mongoDB.funfact) {
        return res.status(200).json({ "message": `No Fun Facts found for ${stateName}`});
    }

    let funfact;
    for (const data of mongoDB) {
        if (data.code === location) {
            funfact = data.funfacts;
            break;
        }
    }
    // if (!funfact) {
    //     return res.json({"message": `No Fun Facts found for ${stateName}`});
    // }

    const randomIndex = Math.floor(Math.random() * funfact.length);
    const result = funfact[randomIndex];
    const jsonObject = {"funfact": result};
    res.json(jsonObject);
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

const createFunFacts = async (req, res) => {
    if (!req?.body?.funfacts) {
        return res.status(400).json({'message': 'State fun facts value required'});
    }

    const requestCode = req.params.state.toUpperCase();

    console.log(req.body.funfacts);
    if (!Array.isArray(req.body?.funfacts)) {
        return res.status(400).json({'message': 'State fun facts value must be an array'});
    }

    const mongoDB = await State.findOne({ code: requestCode }, { _id: 0, code: 1, funfacts: 1}).exec();

    if (!mongoDB) {
        return res.status(400).json({'message': 'Invalid state abbreviation parameter'});
    }

    const currentFunFacts = mongoDB.funfacts;
    const requestedFunFacts = req.body.funfacts;
    const requestedFunFactsLength = requestedFunFacts.length;

    let x = 0;
    for (let i = 0; i < requestedFunFactsLength; i++) {
        currentFunFacts.push(requestedFunFacts[x]);
        x++;
    }

    try {
        const result = await State.findOneAndUpdate(
            { code: requestCode },
            { funfacts: currentFunFacts },
            {new: true}
        );
        res.status(201).json(result);
    } catch (err) {
        console.log(err);
    }
}

const patchFunFacts = async (req, res) => {
    if (!req?.body?.funfacts || !req.body?.index) {
        return res.status(400).json({'message': 'funfact and index are required'});
    }

    const requestCode = req.params.state.toUpperCase();
    const stateLocate = data.states.find((item) => item.code === requestCode);
    const stateName = stateLocate.state;
    const requestedIndex = req.body.index - 1;
    const newFunFacts = req.body.funfacts;

    const mongoDB = await State.findOne({ code: requestCode }, { _id: 1, code: 1, funfacts: 1}).exec();

    const currentFunFacts = mongoDB.funfacts;

    if (!currentFunFacts[requestedIndex]) {
        return res.status(404).json({ "message": `No Fun Fact found at that index for ${stateName}` });
    }

    currentFunFacts[requestedIndex] = newFunFacts;

    try {
        const result = await State.findOneAndUpdate(
            { code: requestCode },
            { funfacts: currentFunFacts },
            {new: true}
        );
        res.status(201).json(result);
    } catch (err) {
        console.log(err);
    }
}

const deleteFunFacts = async (req, res) => {
    if (!req.body?.index) {
        return res.status(400).json({'message': 'index is required'});
    }

    const requestCode = req.params.state.toUpperCase();
    const stateLocate = data.states.find((item) => item.code === requestCode);
    const stateName = stateLocate.state;
    const requestedIndex = req.body.index - 1;

    const mongoDB = await State.findOne({ code: requestCode }, { _id: 1, code: 1, funfacts: 1}).exec();

    const currentFunFacts = mongoDB.funfacts;

    if (!currentFunFacts[requestedIndex]) {
        return res.status(404).json({ "message": `No Fun Fact found at that index for ${stateName}` });
    }

    currentFunFacts.splice(requestedIndex, 1);

    try {
        const result = await State.findOneAndUpdate(
            { code: requestCode },
            { funfacts: currentFunFacts },
            {new: true}
        );
        res.status(201).json(result);
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getAllStates,
    getState,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission,
    getFunFact,
    createFunFacts,
    patchFunFacts,
    deleteFunFacts
}
