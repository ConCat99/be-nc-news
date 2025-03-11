const endpointsJson = require('../endpoints.json');
const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */
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
	test('200: Responds with an object containing all topics', () => {
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
