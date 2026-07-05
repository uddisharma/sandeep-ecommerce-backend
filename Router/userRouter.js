
const express = require('express');
const { loginController, registerController, adminLoginController } = require('../Controller/userController');

const userRouter = express.Router();

userRouter.post('/register',registerController);
userRouter.post('/login', loginController);
userRouter.post('/admin', adminLoginController)

module.exports = userRouter;