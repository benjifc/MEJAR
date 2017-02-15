  /******************************/
  /*        EJEMPLO CHAT        */
  /******************************/

// Importando dependencias
const passport = require('passport');
const express = require('express');
const config = require('../../../config/main');
const jwt = require('jsonwebtoken');

// Iniciar  middleware
const requireAuth = passport.authenticate('jwt', { session: false });

// Cargar modelos
const User = require('../../models/user');
const Chat = require('../../models/chat');

 module.exports = function(app) { 

 

  // Inicializar passport 
  app.use(passport.initialize());

  // Definir estrategia del Passport
  require('../config/passport')(passport);

  // creacion de Rutas del api
  const apiRoutes = express.Router();

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
 }