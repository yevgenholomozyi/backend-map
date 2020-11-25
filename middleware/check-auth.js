const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1]; // removes bearer
        console.log(token);
        if (!token) {
            throw new Error('Authentication failed!');
        }
        const { userId } =                         // verify the tocken and returns the decoded tocken which is either str or obj
        jwt.verify(token, process.env.JWT_SECRET) 
        req.userData = { userId };
        next();
    } catch (err) {
        const error = new HttpError('Authentication failed!', 403);
    }
};
