const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  passedTests: [{type: Schema.Types.ObjectId, ref: 'Question'}],
  roles: {type: []}
});

module.exports = mongoose.model("User", userSchema);
