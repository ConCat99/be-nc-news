const express = require('express');
const app = express();
const {
	getTopics,
	getEndpoints,
	getArticleByID,
	getArticles,
	getCommentsByArticleID,
	addComment,
} = require('./controllers/topics.controller');
const {
	handleServerErrors,
	handleNotARoute,
	handleCustomErrors,
} = require('./controllers/errors.controllers');
app.use(express.json());

//routing GET endpoints
app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleByID);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id/comments', getCommentsByArticleID);

// app.post('/api/articles/:article_id/comments', addComment);

//Catches requests to nonexistent routes
app.all('/*', handleNotARoute);

//Custom Error Handling
app.use(handleCustomErrors);

//error handling
app.use(handleServerErrors);

module.exports = app;
