const express = require('express');
const { body} = require('express-validator');

const router = express.Router();

const userController = require('../controllers/user');
const isAuth = require('../middleware/auth');

router.post('/login', [
    body('email').isEmail()
            .normalizeEmail()
            .withMessage('Please enter a valid email.'),
    body('password').trim().isLength({ min: 6 }).withMessage('Please enter password minimum length.'),
], userController.login); //login user
 
router.get('/user', isAuth , userController.getUsers); //fetch all user

router.post('/user', isAuth , [
    body('username').trim().exists().withMessage('Please enter username'),
    body('first_name').trim().exists().withMessage('Please enter first name'),
    body('last_name').trim().exists().withMessage('Please enter first name'),
    body('email').isEmail().normalizeEmail().withMessage('Please enter valid email.'),
], userController.saveUser); //create a single user

router.get('/user/:userId', isAuth , userController.getUser); //fetch single user

router.put('/user/:userId', isAuth , [
    body('username').trim().exists().withMessage('Please enter username'),
    body('first_name').trim().exists().withMessage('Please enter first name'),
    body('last_name').trim().exists().withMessage('Please enter first name'),
    body('email').isEmail().normalizeEmail().withMessage('Please enter valid email.'),
], userController.updateUser); //fetch single user

router.delete('/user/:userId', isAuth , userController.deleteUser); //delete user

module.exports = router;