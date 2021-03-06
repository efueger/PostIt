import express from 'express';
import UserController from '../controllers/UserController';

const authRouter = express.Router();
authRouter.post('/api/user/signup', UserController.createUser());
authRouter.route('/api/user/signin')
.all(UserController.validateRequest())
.post(UserController.authenticateUser());
authRouter.use('/api', [
  UserController.getClientAuthToken(),
  UserController.authorizeUser()
]);

export default authRouter;
