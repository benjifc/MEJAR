const express = require('express');
app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const config = require('./config/main');
const cors = require('cors');
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


app.use(morgan('dev'));


app.get('/', function(req, res) {
  res.send('Hola.');
});


mongoose.Promise = global.Promise;
mongoose.connect(config.database);

require('./app/routes')(app);

// Start the server
app.listen(port);
console.log('Tu servidor esta corriendo en el puerto: ' + port + '.');
