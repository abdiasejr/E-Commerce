const { Router } = require("express");
const { authenticate } = require("../../middlewares/auth/authentication");

const { getUsers, addAdress, createUser, confirm, postReviewProduct, postLogin, addPayment, OrdersUser, forgotPassword, passwordResetToken } = require("./controller");


// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const userRouter = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
userRouter.post('/post/product/:idProduct', postReviewProduct);
userRouter.get('/getUsers', getUsers);
userRouter.post('/addAddress', addAdress);
userRouter.post('/login', authenticate, postLogin);
userRouter.post('/createUser', createUser);
userRouter.get('/confirm/:token', confirm);
userRouter.post('/addPayment', addPayment);
userRouter.get('/ordersuser', OrdersUser);
userRouter.post('/resetpassword', forgotPassword);
userRouter.post('/:token', passwordResetToken);

module.exports = userRouter;
