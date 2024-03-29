const router = require('express').Router();
const authController = require('../controller/auth_controller')

// Sign Up
router.post('/register', authController.CreateUser);

// Log-In 
router.post('/login', authController.LoginUser);

module.exports = router