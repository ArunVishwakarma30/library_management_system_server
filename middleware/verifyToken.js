const jwt = require('jsonwebtoken');
const User = require('../models/user_model');
const dotenv = require('dotenv');

dotenv.config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;

    if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.TOKEN_KEY, async (err, user) => {
            if (err) {
                return res.status(403).json("Invalid token");
            }
            req.user = user;
            next();
        })
    } else {
        res.status(401).json("You are not authenticated!")
    }
}

const verifyIsLibrarian = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isLibrarian) {
            next();
        }
        else {
            res.status(403).json("You are restricted to performing this task!")
        }
    }) 
}

module.exports = {verifyToken, verifyIsLibrarian};