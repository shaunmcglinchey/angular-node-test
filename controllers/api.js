var express = require('express'),
    router = express.Router();

// Create a GET endpoint /api/things for fetching all things
exports.getThings = function(req, res) {

    var things = [
        {
            name:'thing1'
        },
        {
            name:'thing2'
        }
    ];
    res.json(things);
};
