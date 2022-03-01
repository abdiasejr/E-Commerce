require("dotenv").config();
const { User } = require("../../db.js");
const bcrypt = require("bcrypt");
const { createSession, sendVerificationEmail, destroySession, setCookie } = require("../../middlewares/utilities.js");
const { TOKEN_COOKIE } = process.env

const signup = async (req, res, next) => {
    try {
        const { session_id } = req.permits;
        const {
            username,
            password,
            first_name,
            last_name,
            email,
            isAdmin
        } = req.body

        if (!username || !first_name || !last_name || !email) {
            return res.status(400).json({ success: false, error: 'fields are missing in the form' })
        } else {

            let [user, created] = await User.findOrCreate({
                where: { email },
                defaults: { username, password, first_name, last_name, email, isAdmin }
            })

            if (created) {

                const { token } = createSession({ session_id, user_id: user.id, isAdmin: user.isAdmin })
                // res.cookie(TOKEN_COOKIE, token, { maxAge: 86400000, sameSite: "None", httpOnly: true })
                setCookie(res, token);

                // sendVerificationEmail(token, user.email, user.first_name);

                return res.status(201).json({ message: 'User created', isUser: true, isAdmin });

            } else {
                res.status(400).json({ message: 'This email is already registered' })
            }
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}

const signin = (req, res, next) => {
    const { email, password } = req.body;
    const { session_id } = req.permits;


    !email || !password && res.status(400).json({ success: false, error: 'Incomplete data form' })

    User.findOne({
        where: {
            email
        },
        atributes: ["id", "isAdmin", "password"],
    }).then((user) => {
        if (bcrypt.compare(password, user.password)) {//Los usuarios creados con bulkcreate no estan hasheados
            return createSession({ session_id, user_id: user.id, isAdmin: user.isAdmin });
        } else {
            // si la contraseña comparada no son validas, reporto un error de validacion de password
            return res.status(401).json({ msg: 'Invalid Password or Email' })
        }
    })
        .then(({ token, permits }) => {
            // res.cookie(TOKEN_COOKIE, token, { maxAge: 2592000000, sameSite: "None", httpOnly: true })
            if (token) {
                setCookie(res, token);
                return res.status(200).json({ message: "Ususario logeado correctamente", isUser: true, isAdmin: permits.isAdmin });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json(err)
        })
}

const signout = (req, res, next) => {
    const { session_id } = req.permits;
    const { [TOKEN_COOKIE]: token } = req.cookies;

    destroySession(session_id)
        .then(() => {
            res.cookie(TOKEN_COOKIE, token, { maxAge: 0 });
            return res.sendStatus(200);
        })
}

module.exports = {
    signup,
    signin,
    signout
}