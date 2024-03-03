const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env.local', override: true });

function authMiddleware(req, res, next) {
    const token = req.cookies["token"];

    if (!token) {
        return res.status(401).json({ error: 'Authentification requise !' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

        req.userToken = decodedToken.userToken;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token invalide !' });
    }
}

module.exports = authMiddleware;
