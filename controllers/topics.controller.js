const {
	selectAllTopics,
	selectArticleByID,
	selectAllArticles,
	selectCommentsByArticleId,
	checkArticleIdExists,
} = require('../models/topics.models');
const endpoints = require('../endpoints.json');
const { param } = require('../app');

exports.getEndpoints = (req, res) => {
	res.status(200).send({ endpoints });
};

exports.getTopics = (req, res, next) => {
	selectAllTopics()
		.then((topics) => {
			res.status(200).send({ topics });
		})
		.catch((err) => {
			next(err);
		});
};

exports.getArticleByID = (req, res, next) => {
	const { article_id } = req.params;
	selectArticleByID(article_id)
		.then((article) => res.status(200).send({ article }))
		.catch((err) => {
			next(err);
		});
};

exports.getArticles = (req, res, next) => {
	selectAllArticles()
		.then((articles) => {
			res.status(200).send({ articles });
		})
		.catch((err) => {
			next(err);
		});
};
exports.getCommentsByArticleID = (req, res, next) => {
	const { article_id } = req.params;
	selectCommentsByArticleId(article_id)
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch((err) => {
			next(err);
		});
};

// exports.addComment = (req, res, next)=>{

// }
