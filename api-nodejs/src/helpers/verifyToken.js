const jwt = require('jsonwebtoken');
const moment = require('moment');

const VerifyToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const currentTimestamp = moment.utc().unix();

        if (decoded.exp && decoded.exp < currentTimestamp) {
            return {
                error: true,
                message: 'Token has expired!'
            };
        } else {
            return {
                decoded,
                error: false,
                message: 'Token is valid'
            };
        }
    } catch (error) {
        return {
            error: true,
            message: 'Token not valid!'
        };
    }
};

module.exports = { VerifyToken };
