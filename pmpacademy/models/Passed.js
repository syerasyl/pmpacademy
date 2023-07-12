const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passedSchema = new Schema({
    name: {type: String},
    quiz: [{type: Schema.Types.ObjectId, ref: 'questions'}],
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    correct: [],
    answers: [],
    createdAt: {type: Date, default: Date.now}
});

const question = mongoose.model("passed", passedSchema);
module.exports = question;