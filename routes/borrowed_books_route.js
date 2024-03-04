const router = require('express').Router();
const borrowBooksController = require('../controller/borrow_boks_controller');
const { verifyToken, verifyIsLibrarian } = require('../middleware/verifyToken');

// Reserve Book
router.post('/reserve', verifyToken, borrowBooksController.ReserveBook);

// cancel reservation
router.post('/cancel-reservation', verifyToken, borrowBooksController.CancelReservation);

// borrow book
router.post('/', verifyToken, borrowBooksController.BorrowBook);

// return book
router.post('/return', verifyToken, borrowBooksController.ReturnBook);

// Get all returned books
router.get('/returned-books/:userId', verifyToken, borrowBooksController.GetAllReturnedBooks);

// Get user history
router.get('/history/:userId', verifyToken, borrowBooksController.UserBookHitory);

// Get all borrowed books of an user
router.get('/borrowed-books/:userId', verifyToken, borrowBooksController.GetAllBorrowedBooksOfUser);

// Get all reserved books of user
router.get('/reserved-books/:userId', verifyToken, borrowBooksController.GetAllReservedBooksOfuser);

// Get all borrowed books
router.get('/all-borrowed-books', verifyIsLibrarian, borrowBooksController.GetAllBorrowedBooks);

// Get all reserved books of user
router.get('/all-reserved-books', verifyIsLibrarian, borrowBooksController.GetAllReservedBooks);

module.exports = router