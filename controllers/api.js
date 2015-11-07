var express = require('express'),
    router = express.Router(),
    utils = require('../utils'),
    config = require('../config'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    AuthAttempt = require('../models/authAttempt');

// Login endpoint
exports.login = function(req, res) {

    var user = {
        username: req.body.username
    };

    var token = jwt.sign(user,config.jwtSecret);
    res.send({
        token: token,
        user: user
    })
};

exports.me = function(req, res) {
    res.send(req.user);
};

exports.authAttempts = function(req, res) {
    console.log('req user:'+JSON.stringify(req.user));
    if(!req.user.username === 'admin')
        res.send(401);
    AuthAttempt.find(function(err, attempts) {
        if (err)
            res.send(err);
        res.send(attempts);
    });
};





