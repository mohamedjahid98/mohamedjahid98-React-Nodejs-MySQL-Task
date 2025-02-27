const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');

const prisma = new PrismaClient();

const customerSchema = Joi.object({
    id: Joi.number().optional(),
    customerName: Joi.string().required(),
    contactNo: Joi.string().required(),
    email: Joi.string().email().allow('').optional(),
    addressLine1: Joi.string().allow('').optional(),
    addressLine2: Joi.string().allow('').optional(),
    addressLine3: Joi.string().allow('').optional(),
    stateId: Joi.string().allow('').optional(),
    countryId: Joi.string().allow('').optional(),
    postalCode: Joi.string().allow('').optional(),
});

const createCustomer = async (req, res) => {

    const { error, value } = customerSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { customerName, contactNo, email, addressLine1, addressLine2, addressLine3, stateId, countryId, postalCode } = req.body;

    try {
        const newCustomer = await prisma.customer.create({
            data: {
                customerName,
                contactNo,
                email,
                addressLine1,
                addressLine2,
                addressLine3,
                stateId,
                countryId,
                postalCode,
                isDeleted: false,
            },
        });
        return res.status(200).json(newCustomer);
    } catch (err) {
        return res.status(500).json({ error: 'Error creating customer' });
    }
};

const getCustomers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const skip = (page - 1) * limit;
        const customers = await prisma.customer.findMany({
            where: {
                isDeleted: false,
                customerName: {
                    contains: search,
                },
            },
            select: {
                id: true,
                customerName: true,
                email: true,
                contactNo: true,
                addressLine1: true,
                addressLine2: true,
                addressLine3: true,
                countryId: true,
                stateId: true,
                postalCode: true,
            },
            skip,
            take: parseInt(limit),
        });

        const totalDisplayRecords = await prisma.customer.count({
            where: {
                isDeleted: false,
                customerName: {
                    contains: search,
                },
            },
        });

        const totalRecords = await prisma.customer.count({
            where: {
                isDeleted: false,
            },
        });

        return res.status(200).json({
            list: customers,
            totalRecords,
            totalDisplayRecords,
            limit: parseInt(limit),
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error fetching customers' });
    }
};

const getCustomerById = async (req, res) => {
    const { id } = req.params;

    try {
        const customer = await prisma.customer.findUnique({
            where: { id: Number(id) },
        });

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        return res.status(200).json(customer);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error fetching customer' });
    }
};

const updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { error, value } = customerSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { customerName, contactNo, email, addressLine1, addressLine2, addressLine3, stateId, countryId, postalCode, activeStatus } = value;

    try {
        const updatedCustomer = await prisma.customer.update({
            where: { id: Number(id) },
            data: {
                customerName,
                contactNo,
                email,
                addressLine1,
                addressLine2,
                addressLine3,
                stateId,
                countryId,
                postalCode,
                activeStatus,
            },
        });

        return res.status(200).json(updatedCustomer);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error updating customer' });
    }
};

const deleteCustomer = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCustomer = await prisma.customer.update({
            where: { id: Number(id) },
            data: {
                isDeleted: true,
            },
        });

        return res.status(200).json(deletedCustomer);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error deleting customer' });
    }
};

module.exports = {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
};
