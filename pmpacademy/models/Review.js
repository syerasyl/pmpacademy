const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    title: String,
    text: String,
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    dateCreated: {type: Date, default: Date.now},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
});

const question = mongoose.model("Review", reviewSchema);
module.exports = question;