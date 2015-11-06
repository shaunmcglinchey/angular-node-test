var express = require('express');
var mongoose = require('mongoose');
var config = require('./config');
var bodyParser = require('body-parser');
var apiController = require('./controllers/api');
var cors = require('cors');
var utils = require('./utils');
var expressJwt = require('express-jwt');


// create instance of express
var app = express();

// use cors
app.use(cors());
app.use(express.static(__dirname + '/public'));

// Use the body-parser
app.use(bodyParser.json());

// Middleware to decode the JWT token from incoming HTTP requests
app.use(expressJwt({ secret: config.jwtSecret }).unless({ path: ['/api/login']}));

// Create our Express router
var router = express.Router();

// grab the db url from our config file
app.set('db', config.db.local);

mongoose.connect(app.get('db'));

app.set('port', process.env.PORT || 5000);

// Create endpoint for /api/login
router.post('/login', utils.authenticate, apiController.login);

// Create a dummy secured endpoint for /api/login
router.get('/random-user', apiController.secured);

// Create a endpoint for /api/me
router.get('/me', apiController.me);

// Create a endpoint for /api/me
router.get('/auth', apiController.authAttempts);

// Register all our routes under the /api path
app.use('/api', router);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});