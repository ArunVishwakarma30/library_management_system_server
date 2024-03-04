const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        oneSignalId: { type: String, default: "" },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isLibrarian: { type: Boolean, default: false },
        profile: { type: String, default: "" },
        borrowedBooks: { type: [mongoose.Schema.Types.ObjectId], ref: "Book" },
        reservedBooks: { type: [mongoose.Schema.Types.ObjectId], ref: "Book" },
        totalBooks : {type : Number, default : 0},
        PSID : {type : String, default : '0'}
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("User", UserSchema);