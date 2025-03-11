const express = require('express');
const app = express();
const { getTopics, getEndpoints } = require('./controllers/topics.controller');
const {
	handleServerErrors,
	handleNotARoute,
} = require('./controllers/errors.controllers');
const fs = require('fs');
app.use(express.json());

//routing endpoints
app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

//Catches requests to nonexistent routes
app.all('/*', handleNotARoute);

//error handling
app.use(handleServerErrors);

module.exports = app;
