// Importando dependencias
const passport = require('passport');
const express = require('express');
const config = require('../config/main');
const jwt = require('jsonwebtoken');

// Iniciar  middleware
const requireAuth = passport.authenticate('jwt', { session: false });

// Cargar modelos
const User = require('./models/user');
const Chat = require('./models/chat');

// Exportar las rutas para nuestra aplicación
module.exports = function(app) {
  

  // Inicializar passport 
  app.use(passport.initialize());

  // Definir estrategia del Passport
  require('../config/passport')(passport);

  // creacion de Rutas del api
  const apiRoutes = express.Router();

  // Registrar un nuevo usuario
/*  apiRoutes.post('/register', function(req, res) {
    console.log(req.body);
    if(!req.body.email || !req.body.password) {
      res.status(400).json({ success: false, message: 'Please enter email and password.' });
    } else {
      const newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
      });

      // Guardar el usuario en la base de datos
      newUser.save(function(err) {
        if (err) {
          return res.status(400).json({ success: false, message: 'That email address already exists.'});
        }
        res.status(201).json({ success: true, message: 'Successfully created new user.' });
      });
    }
  });*/

  // Autenticar usuario y cojer el json web token para incluirlo en el HEADER con la clave Authorization
   
  apiRoutes.post('/login', function(req, res) {
    console.log("Authenticate: " +req.body.username);
    User.findOne({$or:[{
      email: req.body.username //{'username':1, '_id':1,'password':0,'email':1,'firstName':1,'lasName':1,'role':1},
    },{username: req.body.username}]},function(err, user) {
      if (err) throw err;

      if (!user) {
        res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });
      } else {
        // verificar password
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (isMatch && !err) {
            // Crear  token si el passwor se encontró 
            user.password=null;
            const token = jwt.sign(user, config.secret, {
              expiresIn: 10080 // en segundos
            });
            res.status(200).json({ success: true, token: 'JWT ' + token });
          } else {
            res.status(401).json({ success: false, message: 'Authentication failed. Passwords did not match.' });
          }
        });
      }
    });
  });


 
  apiRoutes.get('/authenticated', requireAuth, function(req, res, next) {
            res.json({"authenticated": true});

    });


  require("./user/chat/chat.js");
  // Poner el las rutas agupadas
  app.use('/authorize', apiRoutes);
};

