const User = require('../models/user_model');
const Book = require('../models/books_mode');
const BorrowedBook = require('../models/borrowed_book_model');

module.exports = {
    // Reserve a book
    ReserveBook: async (req, res) => {
        const { userId, bookId } = req.body;

        try {
            // Check if user exists
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Check if user has already borrowed or reserved 5 books
            if (user.totalBooks >= 5) {
                return res.status(400).json({ error: "You've already borrowed and reserved 5 books. Return books or cancel the reservation to reserve a new book." });
            }

            // Check if the book exists
            const book = await Book.findById(bookId);
            if (!book) {
                return res.status(404).json({ error: 'Book not found' });
            }

            // Reserve the book
            const borrowedBook = new BorrowedBook({
                userId: userId,
                bookId: bookId,
                isReserved: true
            });

            await borrowedBook.save();

            // Update user's reservedBooks field
            user.reservedBooks.push(bookId);
            user.totalBooks += 1;
            await user.save();

            // Update book's reservedUsers field
            book.reservedUsers.push(userId);
            await book.save();

            res.status(200).json({ message: 'Book reserved successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Cancel reservation of a book
    CancelReservation: async (req, res) => {
        const { userId, bookId, borrowedBookId } = req.body;

        try {
            // Find and delete the BorrowedBook document
            const deletedBorrowedBook = await BorrowedBook.findByIdAndDelete(borrowedBookId);
            if (!deletedBorrowedBook) {
                return res.status(404).json({ error: 'Reservation not found' });
            }

            // Update book's reservedUsers field
            const book = await Book.findById(bookId);
            book.reservedUsers.pull(userId);
            await book.save();

            // Update user's reservedBooks field and reduce totalBooks
            const user = await User.findById(userId);
            user.reservedBooks.pull(bookId);
            user.totalBooks -= 1; // Reduce totalBooks by 1
            await user.save();

            res.status(200).json({ message: 'Reservation canceled successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    BorrowBook: async (req, res) => {
        const { userId, bookId } = req.body;

        try {
            // Check if the book is already borrowed
            const existingBorrowedBook = await BorrowedBook.findOne({ bookId, userId, isBorrowed: true });
            if (existingBorrowedBook) {
                return res.status(400).json({ error: 'Book is already borrowed' });
            }


            // check availability
            const newBook = await Book.findById(bookId);
            if (newBook.available === 0) {
                return res.status(400).json({ error: 'Book is not available right now' });
            }


            // Check if the book is reserved and update the reservation status if reserved
            const reservedBorrowedBook = await BorrowedBook.findOneAndUpdate(
                { bookId, isReserved: true },
                { $set: { isReserved: false, isBorrowed: true, borrowedDate: new Date(), dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } }
            );

            // If the book was reserved, update user's reservedBooks field and book's reservedUsers field
            if (reservedBorrowedBook) {
                const user = await User.findById(userId);
                const book = await Book.findById(bookId);

                user.reservedBooks.pull(bookId);
                user.borrowedBooks.push(bookId);
                await user.save();

                book.reservedUsers.pull(userId);
                book.borrowedUsers.push(userId);
                await book.save();

                // Reduce available count by 1
                book.available -= 1;
                await book.save();

                return res.status(200).json({ message: 'Book borrowed successfully' });
            }

            // If the book was not reserved, create a new borrowed book document
            const newBorrowedBook = new BorrowedBook({
                userId,
                bookId,
                isBorrowed: true,
                isReserved: false,
                borrowedDate: new Date(),
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });

            await newBorrowedBook.save();

            // Update user's borrowedBooks field and totalBooks
            const user = await User.findById(userId);
            user.borrowedBooks.push(bookId);
            user.totalBooks += 1; // Increment totalBooks by 1
            await user.save();

            // Update book's borrowedUsers field
            const book = await Book.findById(bookId);
            book.borrowedUsers.push(userId);
            await book.save();

            // Reduce available count by 1
            book.available -= 1;
            await book.save();
            res.status(200).json({ message: 'Book borrowed successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    ReturnBook: async (req, res) => {
        const { userId, bookId } = req.body;

        try {
            // Find the BorrowedBook document by userId and bookId
            const borrowedBook = await BorrowedBook.findOne({ userId, bookId, isBorrowed: true });
            if (!borrowedBook) {
                return res.status(404).json({ error: 'Borrowed book not found' });
            }

            // Update BorrowedBook fields
            borrowedBook.returned = true;
            borrowedBook.isReturned = true;
            borrowedBook.isBorrowed = false;
            borrowedBook.returnedDate = new Date();
            await borrowedBook.save();

            // Update book's borrowedUsers field
            const book = await Book.findById(bookId);
            book.borrowedUsers.pull(userId);
            book.available += 1;
            await book.save();

            // Update user's borrowedBooks field and decrease totalBooks
            const user = await User.findById(userId);
            user.borrowedBooks.pull(bookId);
            user.totalBooks -= 1; // Decrease totalBooks by 1
            await user.save();

            res.status(200).json({ message: 'Book returned successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    GetAllReturnedBooks: async (req, res) => {
        const { userId } = req.params;

        try {
            // Find all returned books of the user
            const returnedBooks = await BorrowedBook.find({ userId, isReturned: true });

            res.status(200).json(returnedBooks);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    UserBookHitory: async (req, res) => {
        const { userId } = req.params;

        try {
            // Find all returned books of the user
            const allBooks = await BorrowedBook.find({ userId }).populate("bookId");

            res.status(200).json(allBooks);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Get all reserved books of the user
    GetAllReservedBooksOfuser: async (req, res) => {
        const { userId } = req.params;

        try {
            // Find all reserved books of the user
            const reservedBooks = await BorrowedBook.find({ userId, isReserved: true });

            res.status(200).json(reservedBooks);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Get all borrowed books of the user
    GetAllBorrowedBooksOfUser: async (req, res) => {
        const { userId } = req.params;

        try {
            // Find all borrowed books of the user
            const borrowedBooks = await BorrowedBook.find({ userId, isBorrowed: true });

            res.status(200).json(borrowedBooks);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    GetAllBorrowedBooks: async (req, res) => {
        try {
            const borrowedBooks = await BorrowedBook.find({ isBorrowed: true }).populate("bookId userId");
            res.status(200).json(borrowedBooks);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Get all reserved books
    GetAllReservedBooks: async (req, res) => {
        try {
            const reservedBooks = await BorrowedBook.find({ isReserved: true }).populate("bookId userId");
            res.status(200).json(reservedBooks);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }


}
