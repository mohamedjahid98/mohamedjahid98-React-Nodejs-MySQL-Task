const { VerifyToken } = require('../helpers/verifyToken')

const AuthMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = await VerifyToken(token, process.env.SECRET_KEY);
        if (decoded.error) {
            res.status(403).json({ error: true, message: 'Token expired' });
        } else {
            req.user = decoded;
            next();
        }
    } catch (error) {
        res.status(403).json({ error: true, error: 'Invalid or expired token' });
    }
};

module.exports = AuthMiddleware;