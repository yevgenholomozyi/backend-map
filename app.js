const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express(); // initialize express, function executes and returns an object

app.use(bodyParser.json()); // adds a "body" to the request 
app.use('/uploads/images', express.static(path.join('uploads', 'images'))); // adds an abiblity to display an image. Static serving just returns a file, and 

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');  // which origin to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'  // which headers of the origin to allow
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE'); // which methods of the origin to allow

  next();
});

app.use('/api/places', placesRoutes); // register a middleware for => /api/places..., which must perform places routes
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {         // handling unsupported routes
  const error = new HttpError('Could not find this route.', 404); // 404 not found
  throw error;
});

/* with error param express will treat this middleware in a special manner which means 
it will be executed only if there is ann error */
app.use((error, req, res, next) => {
  if (req.file) {
    // fs.unlink is to delete a req.file if an error has occured
    fs.unlink(req.file.path, (err) => { // callback runs when delition is done, we don't need now
      console.log(err);
    }) 
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Ooops... there is an error, please try it later" });
});
 
mongoose
  .connect(`${process.env.DB_KEY}`)
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch(err => {
    console.log(err);
  });

