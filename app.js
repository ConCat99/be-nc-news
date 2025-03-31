const express = require('express');
const cors = require('cors');
const app = express();
const {
	getTopics,
	getEndpoints,
	getArticleByID,
	getArticles,
	getCommentsByArticleID,
	postComment,
} = require('./controllers/topics.controller');
const {
	handleServerErrors,
	handleNotARoute,
	handleCustomErrors,
	handlePsqlErrors,
} = require('./controllers/errors.controllers');

app.use(cors());
app.use(express.json());

//routing GET endpoints
app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleByID);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id/comments', getCommentsByArticleID);

//routing POST endpoints
app.post('/api/articles/:article_id/comments', postComment);

//Catches requests to nonexistent routes
app.all('/*', handleNotARoute);

//Custom Error Handling
app.use(handleCustomErrors);

//PSQL Error handling
app.use(handlePsqlErrors);

//error handling
app.use(handleServerErrors);

module.exports = app;
