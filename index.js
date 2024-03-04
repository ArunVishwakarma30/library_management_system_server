const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth_routes');
const userRoute = require('./routes/user_routes');
const uploadBookRoute = require('./routes/book_routes');
const borrowBooksRoute = require('./routes/borrowed_books_route');
const cors = require('cors');


dotenv.config();
const app = express();

app.get('/', (req, res) => {
    res.send("Welcom to library management server!");
});

mongoose.connect(process.env.MONGO_URL).then(
    () => (console.log("Database is connected😊"))
).catch(
    (err) => {
        console.log(err);
    }
)
app.use(express.json());
app.use(cors());
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/uploadBook', uploadBookRoute);
app.use('/borrow', borrowBooksRoute);

app.listen(process.env.PORT || 5002,
    console.log(`App is running at port number ${process.env.PORT}`)
);