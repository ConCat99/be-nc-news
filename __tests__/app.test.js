const endpointsJson = require('../endpoints.json');
const request = require('supertest');
const app = require('../app');
const testData = require('../db/data/test-data/index');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');

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
});
describe('GET: /api/topics', () => {
	test('200: Responds with an object containing all the correctly formatted topics ', () => {
		return request(app)
			.get('/api/topics')
			.expect(200)
			.then(({ body }) => {
				expect(body.topics.length).toBe(3);
				body.topics.forEach(({ description, slug }) => {
					expect(typeof description).toBe('string');
					expect(typeof slug).toBe('string');
				});
			});
	});
});
describe('GET: api/*/doesnotExist', () => {
	test('404: Responds with error message when attempting to access an endpoint that  does not exist', () => {
		return request(app)
			.get('/api/notANumber')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Not Found');
			});
	});
});
