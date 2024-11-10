import Router from 'express';
import Controller from './controller';

const route = Router();
const Ctrl = new Controller();

// For the auth APIs
route.post('/auth/register', Ctrl.register.bind(Ctrl)); // -register
route.post('/auth/login', Ctrl.login.bind(Ctrl)); // -login
route.post('/forget-password', Ctrl.forgotPassword.bind(Ctrl));
route.post('/reset-password/:userId/:resetToken', Ctrl.resetPassword.bind(Ctrl));


export default route;
