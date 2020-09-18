const server = require('../api/server')
const db = require('../database/dbConfig')
const request = require('supertest')

const requestOptions = {
    headers: { accept: 'application/json' },
};

describe('GET /api/jokes', () => {
    it('Returns 200 OK', async () => {
        const res = await request(server).get('/')
    })
    it("Returns dad jokes", async () => {

    })
})