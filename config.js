module.exports = {
    db: {
        local: 'mongodb://localhost/test'
    },
    api: {
        url: 'http://localhost:5000',
        login_path: '/api/login'
    },
    users : ['user', 'manager', 'admin', 'developer', 'tester'],
    password: 'password',
    jwtSecret: 'marad0nna6456456'
};