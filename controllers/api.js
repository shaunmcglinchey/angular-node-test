var express = require('express'),
    router = express.Router(),
    utils = require('../utils'),
    config = require('../config'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    AuthAttempt = require('../models/authAttempt');
var faker = require('faker');


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

exports.secured = function(req, res) {
    var user = faker.helpers.userCard();
    res.json(user);
};

exports.me = function(req, res) {
    res.send(req.user);
};

exports.authAttempts = function(req, res) {
    //console.log('att:'+JSON.stringify(utils.getAuthAttempts()));
   // res.send(utils.getAuthAttempts());
    var att = [];
    var mod = mongoose.model('AuthAttempt');
    mod.find({},function(err, attempts){
        attempts.forEach(function(record){
            console.log('Record found:' + record.id);
            att.push(record);
        });
    });
    res.json(att);
};





