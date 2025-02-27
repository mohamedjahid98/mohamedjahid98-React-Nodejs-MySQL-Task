const jwt = require('jsonwebtoken');

const GenerateToken = (payload) => {
    const options = { expiresIn: '10h' };

    return jwt.sign(payload, process.env.SECRET_KEY, options);
};

module.exports = { GenerateToken };
