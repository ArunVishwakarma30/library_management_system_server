const router = require('express').Router();
const userController = require('../controller/user_controllers');
const { verifyToken, verifyIsLibrarian } = require('../middleware/verifyToken');

// search user by name or PSIF
router.get('/search-user', verifyIsLibrarian, userController.SearchUserByNameOrPSID);

// update user
router.put('/', verifyToken, userController.updateUser);

// Get user data
router.get('/', verifyToken, userController.getUser);

// Delete User
router.delete('/:email', verifyToken, userController.deleteUser);




module.exports = router