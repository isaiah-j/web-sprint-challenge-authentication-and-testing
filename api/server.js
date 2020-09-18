require('dotenv').config({ path: './config.env' })

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');



const mw = require('../auth/authenticate-middleware.js');
const authRouter = require('../auth/auth-router.js');
const jokesRouter = require('../jokes/jokes-router.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.get('/', (req, res) => {
    res.send({ api: 'up' })
})


server.use('/api/auth', authRouter);
server.use('/api/jokes', mw.protect, jokesRouter);

module.exports = server;
