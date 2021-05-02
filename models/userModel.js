const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: {type: String},
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
})

module.exports = User = mongoose.model("users", userSchema);