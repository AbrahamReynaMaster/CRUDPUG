var express = require('express');
var router = express.Router();

const User = require('../models/user_m');


// Carga formulario agregar usuario
router.get('/add', function(req, res){
  res.render('add_user', {
    title: 'Agregar usuario'
  });
});

// Envia formulario
router.post('/add', function(req, res){
  // Express validator
  req.checkBody('nick', 'Nick es requerido').notEmpty();
  req.checkBody('name', 'Nombre es requerido').notEmpty();
  req.checkBody('lastname', 'Apellidos es requerido').notEmpty();
  req.checkBody('password', 'Password es requerido').notEmpty();
  req.checkBody('rol', 'Rol es requerido').notEmpty();
  req.checkBody('email', 'Email es requerido').notEmpty();
  req.checkBody('email', 'Formato incorrecto de Email').isEmail();
  
  // Get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_user', {
      title: 'Agregar usuario',
      errors: errors
    });
  } else {
    let user = new User();
    user.nick = req.body.nick;
    user.name = req.body.name;
    user.lastname = req.body.lastname;
    user.password = req.body.password;
    user.rol = req.body.rol;
    user.email = req.body.email;

    user.save(function(err){
      if(err) {
        console.error(err);
        return;
      } else {
        req.flash('success', 'Usuario añadido');
        res.redirect('/');
      }
    });
  }
});

router.get('/edit/:id', function(req, res){
  User.findById(req.params.id, function(err, user){
    res.render('edit_user', {
      title: 'Editar usuario',
      user: user
    });
  });
});

router.post('/edit/:id', function(req, res){
  let user = {};
  user.nick = req.body.nick;
  user.name = req.body.name;
  user.lastname = req.body.lastname;
  user.password = req.body.password;
  user.rol = req.body.rol;
  user.email = req.body.email;

  let query = {_id: req.params.id};

  User.update(query, user, function(err){
    if(err) {
      console.error(err);
      return;
    } else {
      req.flash('success', 'Usuario actualizado');
      res.redirect('/');
    }
  })
});


router.delete('/:id', function(req, res){
  let query = {_id: req.params.id};

  User.remove(query, function(err){
    if(err) {
      console.error(err);
      return;
    } else {
      req.flash('success', 'Usuario borrado')
      res.send('Success');
    }
  });
});



router.get('/:id', function(req, res){
  User.findById(req.params.id, function(err, user){
    res.render('user', {
      user: user
    });
  });
});


module.exports = router;
