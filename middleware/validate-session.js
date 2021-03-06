let jwt = require('jsonwebtoken');
let User = require('../db').import('../models/users');

module.exports = function (req, res, next) {
    if (req.method == 'OPTIONS') {
        next();
    } else {
        let sessionToken = req.headers.authorization;

        if (!sessionToken || sessionToken === undefined) return res.status(400).json({ auth: false, message: 'no session Token' })
        else {
            jwt.verify(sessionToken, process.env.JWT_SECRET, (err, decoded) => {
                if (decoded) {
                    User.findOne({
                        where: {
                            id: decoded.id
                        }
                    })
                        .then(user => {
                            req.user = user;
                            return next();
                        },
                            function () {
                                res.status(401).json('token not decoded')
                            })

                } else {
                    res.status(402).json('not authed')
                }
            })
        }
    }
}