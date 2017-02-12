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
  apiRoutes.post('/register', function(req, res) {
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
  });

  // Autenticar usuario y cojer el json web token para incluirlo en el HEADER con la clave Authorization
   
  apiRoutes.post('/authenticate', function(req, res) {
    User.findOne({
      email: req.body.email
    }, function(err, user) {
      if (err) throw err;

      if (!user) {
        res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });
      } else {
        // verificar password
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (isMatch && !err) {
            // Crear  token si el passwor se encontró 
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

  /******************************/
  /*        EJEMPLO CHAT        */
  /******************************/

  // Rutas protegidas con JWT
  //Cojer los mensajes de los usuarios autentificados
  
  apiRoutes.get('/chat', requireAuth, function(req, res) {
    Chat.find({$or : [{'to': req.user._id}, {'from': req.user._id}]}, function(err, messages) {
      if (err)
        res.status(400).send(err);

      res.status(400).json(messages);
    });
  });

  // POST Crea un mensaje el usuario autentificado
  apiRoutes.post('/chat', requireAuth, function(req, res) {
    const chat = new Chat();
        chat.from = req.user._id;
        chat.to = req.body.to;
        chat.message_body = req.body.message_body;

        // salvar mensaje si no hay error
        chat.save(function(err) {
            if (err)
                res.status(400).send(err);

            res.status(201).json({ message: 'Message sent!' });
        });
  });

  // PUT Modificar un mensaje de un usuario autentificado
  apiRoutes.put('/chat/:message_id', requireAuth, function(req, res) {
    Chat.findOne({$and : [{'_id': req.params.message_id}, {'from': req.user._id}]}, function(err, message) {
      if (err)
        res.send(err);

      message.message_body = req.body.message_body;

      // Guardar el mensaje modificado
      message.save(function(err) {
        if (err)
          res.send(err);

        res.json({ message: 'Message edited!' });
      });
    });
  });

  // DELETE Borrar un mensaje
  apiRoutes.delete('/chat/:message_id', requireAuth, function(req, res) {
    Chat.findOneAndRemove({$and : [{'_id': req.params.message_id}, {'from': req.user._id}]}, function(err) {
      if (err)
        res.send(err);

      res.json({ message: 'Message removed!' });
    });
  });

  // Poner el las rutas agupadas
  app.use('/api', apiRoutes);
};
