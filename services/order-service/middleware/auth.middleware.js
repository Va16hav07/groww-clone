const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    // Trust the API Gateway header if present
    if (req.headers['x-user-id']) {
        req.userId = req.headers['x-user-id'];
        return next();
    }

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
            req.userId = decoded.id;
            next();
        } catch (error) {
            console.error('Auth middleware error:', error);
            return res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }

    if (!token && !req.headers['x-user-id']) {
        return res.status(401).json({ error: 'Not authorized, no token' });
    }
};
