var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
dotenv.config();
var Auth = require('./auth/Auth');
var User = require('./user/user');

var indexRouter = require('./routes/index');
var listusers = require('./routes/listusers')

var bodyParser = require('body-parser');

var foodRouter = require('./routes/food');
var mealRouter = require('./routes/meal')
var smokeRouter = require('./routes/smoke')

var noteRouter = require('./routes/note')

var app = express();
app.use(Auth.verifyToken);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/list', listusers);
app.post('/users', User.create);
app.post('/users/login', User.login);
app.delete('/users/me', Auth.verifyToken, User.delete);

app.listen(3000);
console.log('app running on port ', 3000);

app.use('/food', foodRouter);

app.use('/meal', mealRouter);

app.use('/smoke', smokeRouter);


app.use('/note', noteRouter);

module.exports = app;
