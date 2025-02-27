const CryptoJS = require("crypto-js");
const { GenerateToken } = require('../helpers/tokenGenerate');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Joi = require('joi');

const RegisterValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    address: Joi.string(),
});

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                email: true,
                password: true,
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const decryptedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_KEY
        ).toString(CryptoJS.enc.Utf8);

        if (decryptedPassword !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = GenerateToken({ id: user.id, email: user.email });


        res.status(200).json({
            message: 'Login successful', token,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in', details: error.message });
    }
};

const register = async (req, res) => {
    const { username, email, password, address } = req.body;

    try {
        const { error } = RegisterValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details });
        }

        const validateuser = await prisma.user.findUnique({
            where: { email },
        });

        if (validateuser) {
            return res.status(404).json({ error: 'User already exists' });
        }

        const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.PASS_KEY).toString();

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: encryptedPassword,
                address,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        res.status(200).json({ message: 'user registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Error registering user', details: error.message });
    }
};

module.exports = {
    login,
    register,
};
