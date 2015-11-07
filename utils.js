var config = require('./config'),
    _ = require('lodash'),
    AuthAttempt = require('./models/authAttempt');

exports.authenticate = function authenticate(req, res, next) {

    // check if a username was supplied. If it wasn't send a HTTP 400 - Bad Request
    if(!req.body.username) {
        logAuthAttempt(req.connection.remoteAddress,'Username not supplied','AUTH_FAILURE');
        res.status(400).end('Username not supplied. Please enter a username');
        return;
    }
    // validate username. If invalid send a HTTP 401 - Unauthorized
    if(!isValidUsername(req.body.username)){
        logAuthAttempt(req.connection.remoteAddress,req.body.username,'AUTH_FAILURE');
        res.status(401).end('Invalid username');
        return;
    }

    // check if a password was supplied. If it wasn't send a HTTP 400 - Bad Request
    if (!req.body.password) {
        logAuthAttempt(req.connection.remoteAddress,req.body.username,'AUTH_FAILURE');
        res.status(400).end('Password not supplied. Please enter a password');
        return;
    }

    // validate password. If invalid send a HTTP 401 - Unauthorized
    if(!isValidPassword(req.body.password)){
        logAuthAttempt(req.connection.remoteAddress,req.body.username,'AUTH_FAILURE');
        res.status(401).end('Invalid password');
        return;
    }
    logAuthAttempt(req.connection.remoteAddress,req.body.username,'AUTH_SUCCESS');
    next();
};

// log the authentication attempt to our database
function logAuthAttempt(ip,username,action){

    var attempt = new AuthAttempt({
        ip: ip,
        username: username,
        action: action
    });

    attempt.save(function(err) {
        if (err){
            console.log('Could not log authentication attempt');
        }
    });
}

function isValidUsername (username){
    return _.contains(config.users, username.toLowerCase());
}

function isValidPassword(password) {
    return password === 'password';
}