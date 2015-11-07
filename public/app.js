(function() {
   'use strict';

    var app = angular.module('app', [], function config($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    });

    app.constant('API_URL', 'http://localhost:5000/api');

    app.controller('MainController', function(AuthFeedFactory, UserFactory){
       'use strict';
        var vm = this;
        vm.getAuthFeed = getAuthFeed;
        vm.login = login;
        vm.logout = logout;

        UserFactory.getUser().then(function success(response) {
            vm.user = response.data;
        });

        function getAuthFeed() {
            AuthFeedFactory.getAuthFeed().then(function success(response) {
                vm.attempts = response.data;
            }, handleError);
        }

        function login(username, password) {
            UserFactory.login(username, password).then(function success(response) {
               vm.user = response.data.user;
            }, handleError);
        }

        function logout() {
            vm.user = null;
            vm.admin = null;
            UserFactory.logout();
        }

        function handleError(response) {
            console.log('Error:' + response.data);
        }
    });

    // A factory responsible for fetching the authentication feed over HTTP
    app.factory('AuthFeedFactory', function($http, API_URL){
       'use strict';
        return {
            getAuthFeed: getAuthFeed
        };
        function getAuthFeed() {
            return $http.get(API_URL + '/auth');
        }
    });

    // A factory responsible for login, logout, and fetching of a user
    app.factory('UserFactory', function UserFactory($http, API_URL, AuthTokenFactory, $q) {
       'use strict';
        return {
            login: login,
            logout: logout,
            getUser: getUser
        };
        function login(username, password) {
            return $http.post(API_URL + '/login', {
                username: username,
                password: password
            }).then(function success(response) {
                AuthTokenFactory.setToken(response.data.token);
                return response;
            })
        }

        function logout() {
            AuthTokenFactory.setToken();
        }

        function getUser() {
            if (AuthTokenFactory.getToken()) {
                return $http.get(API_URL + '/me');
            } else {
                return $q.reject({ data: 'Client has no auth token'});
            }
        }
    });

    /** A factory responsible for managing (getting and setting) tokens
     *  in the browser local storage
     */
    app.factory('AuthTokenFactory', function AuthTokenFactory($window) {
        'use strict';
        var store = $window.localStorage;
        var key = 'auth-token';

        return {
            getToken: getToken,
            setToken: setToken
        };

        function getToken() {
            return store.getItem(key);
        }

        function setToken(token) {
            if (token) {
                store.setItem(key, token);
            } else {
                store.removeItem(key);
            }
        }

    });

    /** Intercept any http request, look for an existing JWT token, and if one
     *  is found add it to the request headers using the Bearer Auth scheme
     */
    app.factory('AuthInterceptor', function AuthInterceptor(AuthTokenFactory) {
        'use strict';
        return {
            request: addToken
        };

        function addToken(config) {
            var token = AuthTokenFactory.getToken();
            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = 'Bearer ' + token;
            }
            return config;
        }
    });

})();