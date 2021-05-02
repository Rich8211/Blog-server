const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

    author: {type: String, required: true},
    postImage: {type: String, required: true},
    title: { type: String, required: true},
    createdAt: {type: Date, default:Date.now},
    tags: {type: [String]},
    body: {type: String, required: true}
    // html: {type: String, required: true}

});

module.exports = Post = mongoose.model("post", postSchema);