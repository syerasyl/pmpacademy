const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    dependent: String,
    question: String,
    options: [],
    answer: String,
});

const question = mongoose.model("questions", questionSchema);
module.exports = question;