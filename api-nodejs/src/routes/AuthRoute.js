const express = require('express');

const { login, register } = require('../controllers/AuthController');

const routes = express.Router();

routes.post('/login', login);
routes.post('/register', register);

module.exports = routes;