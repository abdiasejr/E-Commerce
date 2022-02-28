const jwt = require('jsonwebtoken')
require('dotenv').config()
const { createSession, destroySession } = require('./utilities');
const { FIRM, TOKEN_COOKIE, SESSION_COOKIE } = process.env

const authenticate = async (req, res, next) => {
    const { [TOKEN_COOKIE]: Token, [SESSION_COOKIE]: session_id } = req.cookies;

    if (Token) {
        jwt.verify(Token, FIRM, (err, values) => {
            if (err) {
                if (err.expiredAt) {
                    destroySession(session_id)
                        .then(() => {
                            return createSession();
                        })
                        .then(token => {
                            res.cookie(TOKEN_COOKIE, token, { maxAge: 2592000000, sameSite: "None", httpOnly: true })
                            req.permits = jwt.decode(token);
                            next();
                        })
                        .catch(error => {
                            return res.status(500).json(error);
                        })
                } else {
                    return res.status(403).json(err);
                }
            } else {
                req.permits = values;
                next();
                return;
            }
        })
    } else {
        try {
            const { token } = await createSession();
            res.cookie(TOKEN_COOKIE, token, { maxAge: 2592000000, sameSite: "None", httpOnly: true })
            next();
            return;
        } catch (error) {
            return error;
        }
    }
}

// const setResCookies = (req, res, next) => {
//     const cookies = req.setMyCookies;
//     if (cookies) {
//         for (let cookie in cookies) {
//             res.cookie(cookie, cookies[cookie], { maxAge: 2592000000, sameSite: "None", httpOnly: true })
//         }
//     }
//     next();
// }

module.exports = {
    authenticate,
}