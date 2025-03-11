const { selectAllTopics } = require('../models/topics.models');
const endpoints = require('../endpoints.json');

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
