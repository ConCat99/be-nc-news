const endpointsJson = require('../endpoints.json');
const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
require('jest-sorted');

beforeEach(() => {
	return seed(testData);
});

afterAll(() => {
	return db.end();
});

describe('GET /api', () => {
	test('200: Responds with an object detailing the documentation for each endpoint', () => {
		return request(app)
			.get('/api')
			.expect(200)
			.then(({ body: { endpoints } }) => {
				expect(endpoints).toEqual(endpointsJson);
			});
	});
	test('404: /*', () => {
		return request(app)
			.get('/api/*NotAPath')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Not Found');
			});
	});
});

describe('GET: /api/topics', () => {
	test('200: Responds with an array of objects containing all topics properties', () => {
		// Arrange	// Act
		return request(app)
			.get('/api/topics')
			.expect(200)
			.then(({ body }) => {
				expect(body.topics.length).toBe(3);
				body.topics.forEach(({ slug, description }) => {
					expect(typeof slug).toBe('string');
					expect(typeof description).toBe('string');
				});
			});
	});
});

describe('GET: /api/articles/:article_id', () => {
	test('200: Responds with an object that corresponds to the correct article id', () => {
		// Arrange// Act
		return request(app)
			.get('/api/articles/2')
			.expect(200)
			.then(({ body: { article } }) => {
				expect(article.article_id).toBe(2);
				expect(typeof article.author).toBe('string');
				expect(typeof article.title).toBe('string');
				expect(typeof article.body).toBe('string');
				expect(typeof article.topic).toBe('string');
				expect(typeof article.created_at).toBe('object');
				expect(typeof article.votes).toBe('number');
				expect(typeof article.article_img_url).toBe('string');
			});
	});
	test('404: Respond with not found if article_id does not exist in database', () => {
		// Arrange// Act
		return request(app)
			.get('/api/articles/888')
			.expect(404)
			.then(({ body: { msg } }) => {
				expect(msg).toBe('Not Found');
			});
	});
	test('400: Responds with Bad request if article_id is not a number', () => {
		return request(app)
			.get('/api/articles/notANumber')
			.expect(400)
			.then(({ body: { msg } }) => {
				expect(msg).toBe('bad request');
			});
	});
});
describe('GET: /api/articles', () => {
	test('200: Responds with an articles array with objects containing all article properties', () => {
		return request(app)
			.get('/api/articles')
			.expect(200)
			.then(({ body }) => {
				expect(body.articles.length).toBe(13);
				body.articles.forEach(
					({
						author,
						title,
						article_id,
						topic,
						created_at,
						votes,
						article_img_url,
						comment_count,
					}) => {
						expect(typeof author).toBe('string');
						expect(typeof title).toBe('string');
						expect(typeof comment_count).toBe('number');
						expect(typeof topic).toBe('string');
						expect(typeof created_at).toBe('object');
						expect(typeof votes).toBe('number');
						expect(typeof article_img_url).toBe('string');
						expect(typeof article_id).toBe('number');
					}
				);
			});
	});
	test('200: Responds with an array list of article objects sorted by date in descending order ', () => {
		return request(app)
			.get('/api/articles?sort_by=date')
			.expect(200)
			.then(({ body }) => {
				expect(body.articles.length).toBe(13);
				expect(body.articles).toBeSortedBy('created_at', { descending: true });
			});
	});
});
