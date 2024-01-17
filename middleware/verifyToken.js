const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (token) {
            token = token.split(" ")[1];
            let user = jwt.verify(token, 'HMAC-SHA1');
            req.userId = user.id;
            next();
        } else {
            res.status(401).json({ message: 'Invalid token.' });
        }
    } catch (e) {
        console.error(e);
        res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = { verifyToken };

