const express = require('express');

const { createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer } = require('../controllers/CustomerController');

const AuthMiddleware = require('../middlewares/auth.middleware');

const routes = express.Router();

routes.get('/:id', AuthMiddleware, getCustomerById);
routes.get('/', AuthMiddleware, getCustomers);
routes.post('/', AuthMiddleware, createCustomer);
routes.put('/:id', AuthMiddleware, updateCustomer);
routes.delete('/:id', AuthMiddleware, deleteCustomer);

module.exports = routes;