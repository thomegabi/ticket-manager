import express from 'express';
import { check } from 'express-validator';
import * as usersController from '../controllers/users-controller';
import { verifyToken } from '../middlewares/token-auth-middleware';

const router = express.Router();


router.get('/users', usersController.getUsers);
router.get('/user/token', verifyToken, usersController.getUserWithToken)

router.post('/signup', [
  check('name').not().isEmpty(),
  check('password')
    .isLength({ min: 6 })
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/)
], usersController.signupByName);

router.post('/login', [
  check('email').not().isEmpty().isEmail().normalizeEmail(),
  check('password')
    .isLength({ min: 6 })
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/)
    .withMessage('A senha deve conter pelo menos 1 letra maiúscula e 1 número e possuir 6 digitos')
], usersController.login);

router.put('/setAdmin/:userId', verifyToken, usersController.setAdmin)
router.put('/user/update', verifyToken, usersController.updateUser)

router.delete('/user/:userId/delete', verifyToken, usersController.deleteUser)

export default router;
