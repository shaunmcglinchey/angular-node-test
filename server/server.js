var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var apiController = require('./controllers/api');
var config = require('./config/config');
var utils = require('./utils/utils');

// create instance of express
var app = express();

// node middleware for serving our static files (frontend) from the client folder
app.use(express.static('./client'));

// Use the body-parser
app.use(bodyParser.json());

// Middleware to decode the JWT token from incoming HTTP requests
app.use(expressJwt({ secret: config.jwtSecret }).unless({ path: ['/api/login']}));

// Exception middleware to handle 401 Unauthorized errors cleanly
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('Invalid token');
    }
});

// Create our Express router
var router = express.Router();

// use the db connection string specified in our config file
app.set('db', config.db.local);

mongoose.connect(app.get('db'));

app.set('port', process.env.PORT || config.app.port);

// Create endpoint for /api/login
router.post('/login', utils.authenticate, apiController.login);

// Create a endpoint for /api/me
router.get('/me', apiController.me);

// Create a endpoint for /api/me
router.get('/auth', apiController.authAttempts);

// Register all our routes under the /api path
app.use('/api', router);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});