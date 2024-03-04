const mongoose = require('mongoose');

const BookSchema = mongoose.Schema(
    {
        bookName: { type: String, required: true },
        bookDescription: { type: String, required: true },
        authorName: { type: String, required: true },
        coverImage : { type: String, default: "" },
        quantity : {type : Number, required : true},
        available : {type : Number, required : false},
        publishYear : {type : Number, required : true},
        publisher : {type : String, required : false},
        language : {type : String, required:false},
        edition : {type : Number, required:false},
        pageCount : {type : Number, required:false},
        semCategoty : {type : String, require : true},
        borrowedUsers: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
        reservedUsers: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
        
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Book", BookSchema);