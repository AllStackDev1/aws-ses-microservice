const createError = require('http-errors');
const express = require('express');

const port = process.env.PORT || 3210;

const Mailer = require('./Mailer/routes');
const app = express();

app.use('', Mailer);


app.get('*', function (req, res) {
  res.status(500).send("Where do you thing you are going?, Please masa find your way back from where you came from.");
});


if (app.get('env') === 'production') {
  app.use(function (err, req, res, next) {
    res.status(500).send('Internal server error.');
    return;
  });
}

app.listen(port, function () {
  console.log("Server listening on port:" + port);
});