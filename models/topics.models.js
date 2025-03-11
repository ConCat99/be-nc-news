const { ident } = require('pg-format');
const db = require('../db/connection');

exports.selectAllTopics = () => {
	return db.query(`SELECT * FROM topics`).then(({ rows }) => {
		return rows;
	});
};

exports.selectArticleByID = (article_id) => {
	if (isNaN(article_id)) {
		return Promise.reject({ status: 400, msg: 'bad request' });
	}
	return db
		.query(
			`SELECT author, title, article_id, body, topic, created_at, votes, article_img_url FROM articles WHERE article_id = $1`,
			[article_id]
		)
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({ status: 404, msg: 'Not Found' });
			}
			return rows[0];
		});
};

exports.selectAllArticles = () => {
	return db
		.query(
			` SELECT articles.author,
						title,
						articles.article_id,
						topic,
						articles.created_at,
						articles.votes,
						articles.article_img_url,
						COUNT (comments.comment_id)::INTEGER AS comment_count
						FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id`
		)
		.then(({ rows }) => {
			return rows;
		});
};
