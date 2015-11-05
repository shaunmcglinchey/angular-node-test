// Load the packages required for testing
var should = require('chai').should(),
    expect = require('chai').expect,
    supertest = require('supertest');

var config = require('../config');
var api = supertest(config.api.url);
var thingsUrl = '/api/things';

describe('Test API', function() {

    it('should check we can get things from our API', function (done) {
        api.get(thingsUrl)
            .expect(200)
            .end(function (err, res) {
                console.log(res.body);
                expect(res.body).to.be.an('array');
                done();
            });
    });

});