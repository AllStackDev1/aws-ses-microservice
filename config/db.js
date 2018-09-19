const mongoose = require('mongoose');

const dbConnect = process.env.MONGODB_URI;
mongoose.set('useCreateIndex', true)
mongoose.connect(dbConnect, {
  useNewUrlParser: true
});
mongoose.Promise = global.Promise;

module.exports = {
  mongoose,
  dbConnect
};