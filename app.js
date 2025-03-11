const express = require('express');
const app = express();
const {
	getTopics,
	getEndpoints,
	getArticleByID,
	getArticles,
} = require('./controllers/topics.controller');
const {
	handleServerErrors,
	handleNotARoute,
	handleCustomErrors,
} = require('./controllers/errors.controllers');
app.use(express.json());

//routing endpoints
app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleByID);

app.get('/api/articles', getArticles);

//Catches requests to nonexistent routes
app.all('/*', handleNotARoute);

//Custom Error Handling
app.use(handleCustomErrors);

//error handling
app.use(handleServerErrors);

module.exports = app;
