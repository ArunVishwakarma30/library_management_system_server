const router = require('express').Router();
const uploadBookController = require('../controller/book_controller');
const { verifyToken, verifyIsLibrarian } = require('../middleware/verifyToken');

// search for Books
router.get('/search', verifyToken, uploadBookController.SearchBooks);

// Create Books
router.post('/', verifyIsLibrarian, uploadBookController.UploadBook);

// Get all Books
router.get('/allBooks', verifyToken, uploadBookController.GetAllBooks);

// Get Books by Id
router.get('/:bookId', verifyToken, uploadBookController.GetBook);

// Update Books
router.put('/:bookId', verifyToken, uploadBookController.UpdateBook);

// Delete vehicle
router.delete('/:bookId', verifyIsLibrarian, uploadBookController.DeleteBook);


module.exports = router