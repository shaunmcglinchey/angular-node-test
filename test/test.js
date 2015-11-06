// Load the packages required for testing
var should = require('chai').should(),
    expect = require('chai').expect,
    supertest = require('supertest');

var config = require('../config');
var api = supertest(config.api.url);
var loginUrl = config.api.login_path;

describe('Test API', function() {

    it('should return a 400 Bad Request response for a call to the login endpoint without any credentials', function (done) {
        api.post(loginUrl)
            .send()
            .expect(400, done);
    });

    it('should return a 400 Unauthorized response for a call to the login endpoint with an invalid password ', function (done) {
        var user = {};
        api.post(loginUrl)
            .send(user)
            .expect(400, done);
    });

    it('should return a 401 Unauthorized response for a call to the login endpoint with an invalid username', function (done) {
        var user = { username : 'usersd' };
        api.post(loginUrl)
            .send(user)
            .expect(401, done);
    });

    it('should return a 400 Bad Request response for a call to the login endpoint without a password ', function (done) {
        var user = { username : 'user' };
        api.post(loginUrl)
            .send(user)
            .expect(400, done);
    });

    it('should return a 401 Unauthorized response for a call to the login endpoint with an invalid password ', function (done) {
        var user = { username : 'user', password: 'p' };
        api.post(loginUrl)
            .send(user)
            .expect(401, done);
    });

});