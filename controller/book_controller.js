const Book = require('../models/books_mode');
const User = require('../models/user_model');

module.exports = {

    // Upload Book
    UploadBook: async (req, res) => {

        const newBook = new Book(req.body);

        try {
            const savedBook = await newBook.save();
            const getBook = await Book.findById(savedBook._id)
                .populate('borrowedUsers reservedUsers');

            res.status(201).json(getBook);

        } catch (error) {
            res.status(500).json(error);
        }
    },

    // Get Book
    GetBook: async (req, res) => {
        const bookId = req.params.bookId;

        try {
            const foundBook = await Book.findById(bookId)
                .populate('borrowedUsers reservedUsers');


            if (!foundBook) {
                return res.status(404).json({ error: 'Book not found' });
            }

            // Destructure unnecessary fields
            const { __v, createdAt, updatedAt, ...bookData } = foundBook._doc;

            res.status(200).json(bookData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Get All Books
    GetAllBooks: async (req, res) => {
        try {
            const allBooks = await Book.find().populate('borrowedUsers reservedUsers');
            res.status(200).json(allBooks);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Delete Book by ID
    DeleteBook: async (req, res) => {
        const bookId = req.params.bookId;

        try {
            const deletedBook = await Book.findByIdAndDelete(bookId);

            if (!deletedBook) {
                return res.status(404).json({ error: 'Book not found' });
            }

            res.status(200).json("Book Successfully Deleted");
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Update Book by ID
    UpdateBook: async (req, res) => {
        const bookId = req.params.bookId;
        const updateData = req.body;

        try {
            const updatedBook = await Book.findByIdAndUpdate(bookId, {
                $set: updateData
            }, { new: true });

            if (!updatedBook) {
                return res.status(404).json({ error: 'Book not found' });
            }

            // Destructure unnecessary fields
            const { __v, createdAt, updatedAt, ...updatedData } = updatedBook._doc;

            res.status(200).json(updatedData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Search Books
    SearchBooks: async (req, res) => {
        const { searchTerm } = req.query;

        try {
            const searchResults = await Book.find({
                $or: [
                    { bookName: { $regex: searchTerm, $options: 'i' } },
                    { bookDescription: { $regex: searchTerm, $options: 'i' } },
                    { authorName: { $regex: searchTerm, $options: 'i' } },
                    { publisher: { $regex: searchTerm, $options: 'i' } }
                ]
            }).populate('borrowedUsers reservedUsers');

            res.status(200).json(searchResults);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },





}