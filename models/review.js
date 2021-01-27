//classic for mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//new Schema
const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

//new mongoose model
module.exports = mongoose.model("Review", reviewSchema);