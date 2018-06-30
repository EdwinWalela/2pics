const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const WinSchema = new Schema ({
  Usrid:String,
})

const Win = mongoose.model('winners',WinSchema);

module.exports = Win;
