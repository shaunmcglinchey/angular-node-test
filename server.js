var express = require('express');
var mongoose = require('mongoose');
var config = require('./database/config');

// create instance of express
var app = express();

// grab the db url from our config file
app.set('db', config.db.local);

mongoose.connect(app.get('db'));
