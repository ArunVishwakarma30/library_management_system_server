const mongoose = require('mongoose');

const BorrowedBookSchema = mongoose.Schema(
    {
        bookId: {
            type: mongoose.Schema.Types.ObjectId, ref: "Book"

        },
        userId: {
            type: mongoose.Schema.Types.ObjectId, ref: "User"
        },
        isBorrowed: { type: Boolean, default: false },
        isReturned: { type: Boolean, default: false },
        isReserved: { type: Boolean, default: false },
        borrowedDate: { type: Date, required: false },
        dueDate: { type: Date, required: false },
        returnedDate: { type: Date, required: false },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("BorrowedBook", BorrowedBookSchema);