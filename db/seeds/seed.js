const db = require('../connection');
const pgFormat = require('pg-format');
const convertTimestampToDate = require('./utils');

const seed = ({ topicData, userData, articleData, commentData }) => {
	return db
		.query('DROP TABLE IF EXISTS comments;')
		.then(() => {
			return db.query('DROP TABLE IF EXISTS articles;');
		})
		.then(() => {
			return db.query('DROP TABLE IF EXISTS users;');
		})
		.then(() => {
			return db.query('DROP TABLE IF EXISTS topics;');
		})
		.then(() => {
			return createTopics();
		})
		.then(() => {
			return createUsers();
		})
		.then(() => {
			return createArticles();
		})
		.then(() => {
			return createComments();
		})
		.then(() => {
			return insertTopicData(topicData);
		})
		.then(() => {
			return insertUserData(userData);
		})
		.then(() => {
			return insertArticleData(articleData);
		})
		.then(({ rows }) => {
			return insertCommentsData(commentData, rows);
		})
		.then(({ rows }) => {});
};

function createTopics() {
	return db.query(`
    CREATE TABLE topics(
    slug VARCHAR(50) PRIMARY KEY,
    description VARCHAR(500) NOT NULL,
    img_url VARCHAR(1000)
      );
  `);
}

function createUsers() {
	return db.query(`
    CREATE TABLE users(
    username VARCHAR(30) PRIMARY KEY,
    name VARCHAR(30),
    avatar_url VARCHAR(1000)
      );
  `);
}

function createArticles() {
	return db.query(`
    CREATE TABLE articles(
    article_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    topic VARCHAR(50) REFERENCES topics(slug),
    author VARCHAR(50) NOT NULL REFERENCES users(username),
    body TEXT,
    created_at TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000)
      );
  `);
}

function createComments() {
	return db.query(`
    CREATE TABLE comments(
    comment_id SERIAL PRIMARY KEY,
    article_id INT REFERENCES articles(article_id),
    body TEXT,
    votes INT,
    author VARCHAR(50) REFERENCES users(username),
    created_at TIMESTAMP
      );
  `);
}

function insertTopicData(topicData) {
	const formattedTopics = topicData.map((topic) => {
		return [topic.slug, topic.description, topic.img_url];
	});
	const formattedTopicsStr = pgFormat(
		`INSERT INTO topics(slug, description, img_url) VALUES %L`,
		formattedTopics
	);
	return db.query(formattedTopicsStr);
}

function insertUserData(userData) {
	const formattedUsers = userData.map((user) => {
		return [user.username, user.name, user.avatar_url];
	});
	const formattedUsersStr = pgFormat(
		`INSERT INTO users(username, name, avatar_url) VALUES %L`,
		formattedUsers
	);
	return db.query(formattedUsersStr);
}

function insertArticleData(articleData) {
	const formattedArticles = articleData.map((article) => {
		const convertedArticle = convertTimestampToDate(article);
		return [
			convertedArticle.title,
			convertedArticle.topic,
			convertedArticle.author,
			convertedArticle.body,
			convertedArticle.create_at,
			convertedArticle.votes || 0,
			convertedArticle.article_img_url,
		];
	});
	const formattedArticlesStr = pgFormat(
		`INSERT INTO articles(title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`,
		formattedArticles
	);
	return db.query(formattedArticlesStr);
}

function insertCommentsData(commentData, articles) {
	const articleTitleIds = {};
	articles.forEach((article) => {
		articleTitleIds[article.title] = article.article_id;
	});
	const formattedComments = commentData.map((comment) => {
		const articleID = articleTitleIds[comment.article_title];
		const convertedComment = convertTimestampToDate(comment);
		return [
			articleID,
			comment.body,
			comment.votes,
			comment.author,
			convertedComment.created_at,
		];
	});
	const formattedCommentsStr = pgFormat(
		`INSERT INTO comments(article_id, body, votes, author, created_at) VALUES %L RETURNING *`,
		formattedComments
	);
	return db.query(formattedCommentsStr);
}

module.exports = seed;
