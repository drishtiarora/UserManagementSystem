var app = angular.module('myapp', ['ngRoute', 'ngCookies']);

app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        template: `
            <h1>Welcome everyone</h1>
            <p>Thanks for visiting my page </p>
         `
    })
        .when('/login', {
            templateUrl: '/login.html',
            controller: 'login_controller'
        })
        .when('/register', {
            templateUrl: '/register.html',
            controller: 'register_controller'
        })
        .when('/home', {
            templateUrl: '/home.html',
            controller: 'home_controller'
        })
        .when('/messages', {
            templateUrl: '/messages.html',
            controller: "messages_controller"
        })
        .when('/profile', {
            templateUrl: '/profile.html',
            controller: 'profile_controller'
        })
        .when('/messages', {
            templateUrl: 'messages.html',
            controller: 'messages_controller'
        })
        .when('/importantMsgs', {
            templateUrl: 'importantMsgs.html',
            controller: 'impMsgs_controller'
        })
        .when('/reply', {
            templateUrl: 'reply.html',
            controller: 'reply_controller'
        })
        .when('/replies',{
            templateUrl: 'replies.html',
            controller : 'replies_controller'
        })
        .otherwise({
            redirectTo: '/'
        });
});

/////////////////////////////REGISTERATION CONTROLLER////////////////////////////
app.controller('register_controller', function ($scope, $http, $location) {
    $scope.regUser = function (regData) {
        $http.post('http://localhost:3000/register', $scope.regData)
            .then(function (data) {
                if (data.data.isRegister) {
                    alert("registered successfully");
                    $location.path('/login');
                }
                else {
                    alert("Please try again");
                }
            })
    }
});
///////////////////////LOGIN CONTROLLER/////////////////////////////////////////
app.controller('login_controller', function ($scope, $rootScope, $http, $location, $cookieStore) {
    $scope.login = function (authform) {
        $http.post('http://localhost:3000/login', $scope.authform)
            .then(function (data) {
                if (data.data.isLoggedIn) {
                    $rootScope.loginInfo = data.data.loginInfo;
                    $rootScope.userInfo = {
                        "username": data.data.loginInfo.username,
                    }
                    console.log($rootScope.userInfo);
                    alert("Logged in successfully");
                    $cookieStore.put('token', $rootScope.userInfo.username);
                    $location.path('/home');

                }
                else {
                    alert("Please login again");
                }
            });
    }
});
//////////////////////////HOME CONTROLLER////////////////////////////////////////////
app.controller('home_controller', function ($scope, $location, $http, $rootScope, $cookieStore) {
    $scope.goToProfile = function () {
        $location.path('/profile');
    }
    $scope.goToMessages = function () {
        $location.path('/messages');
    }
    $scope.logout = function () {
        $cookieStore.remove("token");
        $location.path('/login');
    }
});

//////////////////////////PROFILE CONTROLLER////////////////////////////
app.controller('profile_controller', function ($scope, $rootScope, $http) {
    $scope.userLoginInfo = $rootScope.loginInfo;
    console.log("login info", $scope.userLoginInfo)

    $scope.onProfileEdited = function (myProfile) {
        $scope.userLoginInfo.username = myProfile.myName;
        $scope.userLoginInfo.email = myProfile.myEmail;
        $scope.userLoginInfo.location = myProfile.myLocation;
        $scope.userLoginInfo.phone = myProfile.myPhone;

        alert("Details saved successfully");
        $http.post('http://localhost:3000/editProfile', $scope.userLoginInfo)
            .then(function (resp) {

            });
    }
});

/////////////////////////MESSAGES CONTROLLER////////////////////////////

app.controller('messages_controller', function ($scope, $http, $rootScope, $location) {
    $http.post('http://localhost:3000/messages', $rootScope.userInfo)
        .then(function (resp) {
            $rootScope.msgDetails = resp.data.msgInfo;

        });

    $scope.important = function (data) {
        data.username = $rootScope.userInfo.username;
        $http.post('http://localhost:3000/important', data)
            .then(function (resp) {
                $rootScope.impMsgInfo = resp.data.impmsgInfo;
            });
    }
    $scope.msgs = function () {
        console.log("imp msg clicked");
        $location.path('/importantMsgs')
    }
    $scope.delete = function (data) {
        console.log("delete button clicked");
        console.log(data);
        $http.post('http://localhost:3000/delete', data)
            .then(function (resp) {
                
            })
    }
    $scope.reply = function () {
        console.log("reply button clicked");
        $location.path('/reply');
    }

    $scope.repliedmsgs = function(){
        $location.path('/replies');
    }
});

app.controller('impMsgs_controller', function ($scope, $rootScope, $http) {
    $http.post('http://localhost:3000/importantMsgList', $rootScope.userInfo)
        .then(function (resp) {
            $scope.msgData = resp.data.data;
            console.log($scope.msgData);
        })
})

app.controller('reply_controller', function ($scope, $location, $http, $rootScope) {
    $scope.send = function (reply) {
        console.log(reply);
        reply.username = $rootScope.userInfo.username;
        console.log(reply);
        $http.post('http://localhost:3000/reply', reply)
            .then(function (resp) {
                $rootScope.replies = resp.data;
            })
    }
    $scope.back = function () {
        $location.path('/messages');
    }
})

app.controller('replies_controller', function($scope, $rootScope, $http){
        $http.post('http://localhost:3000/replylist',  $rootScope.userInfo)
        .then(function(resp){
       $scope.replymsgs = resp.data;
        })
    
    // console.log("replied data" , $rootScope.replies);
})
