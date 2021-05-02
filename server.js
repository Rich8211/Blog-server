const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const PORT = process.env.PORT || 5000;


const app = express();
app.use(cors({origin: "http://localhost:3000", credentials: true}));
app.use(express.json());
app.use(
    session({
        secret: "secretcode",
        resave: true,
        saveUninitialized: true
    })
);
app.use(cookieParser("secretcode"));

app.use(passport.initialize());
app.use(passport.session());
require('./middleware/passport')(passport);
require('./middleware/googlePassport')(passport);

app.use('/public', express.static('public'));


app.use("/posts", require("./routes/postRoutes"));
app.use("/users", require("./routes/userRoutes"));

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser:true, useUnifiedTopology: true}, (err) => {
    if (err) return console.error(err)
    console.log("MongoDB connection established")
});