const express = require('express');
const routes = express.Router();

const AuthRoutes = require('./AuthRoute');
const CustomerRoute = require('./CustomerRoute');

routes.use('/auth', AuthRoutes);
routes.use('/customer', CustomerRoute);


module.exports = routes;