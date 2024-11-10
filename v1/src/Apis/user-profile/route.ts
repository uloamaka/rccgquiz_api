import Router from 'express';
import Controller from './controller';
import userAuth from '../../Middleware/auth-middleware';

const route = Router();
const Ctrl = new Controller();

route.get('/user/profile', userAuth, Ctrl.getUserProfile);

export default route;