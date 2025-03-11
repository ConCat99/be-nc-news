const {
	selectAllTopics,
	selectArticleByID,
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
