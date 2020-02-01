var createError = require('http-errors');
var express = require('express');
var path = require('path');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const config = require('./config/database');

mongoose.connect(config.database);
const db = mongoose.connection;

// Article model
const Users = require('./models/user_m');

// Check connection
db.once('open', function(){
  console.log('Corriendo en MongoDB');
});

// Check for db errors
db.on('error', function(err){
  console.error(err);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: '1s3c4rtr90',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//app.use('/', indexRouter);

app.get('/', function (req, res) {
  Users.find({}, function(err, usersRouter){
    if(err){
      console.error(err);
    } else {
      //console.log(usersRouter)
      counter = {admin:0,operador:0,administrativo:0}
      usersRouter.forEach(element => {
        if(element.rol == 'admin'){
          counter.admin +=1
        }
        else if(element.rol == 'operador'){
          counter.operador += 1
        }
        else if(element.rol == 'administrativo'){
          counter.administrativo +=1
        }
      });
      console.log(counter)
      res.render('index', {
        title: 'Users', 
        users: usersRouter,
        counters: counter
      });
    }
  });
});

//let users = require('./routes/users');

app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, function(){
  console.log(`Server started on port 3000`);
})

module.exports = app;
