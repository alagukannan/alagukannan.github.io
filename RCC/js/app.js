var app = angular.module("rccApp", ["ngRoute","ui.bootstrap","ngAnimate"]);
app.config(function($routeProvider, $locationProvider) {
  $routeProvider
   .when('/token/:token', {
    templateUrl: '/templates/registration.htm',
    controller: 'registrationController',
    controllerAs: 'registration'
   })
   .when('/',{
       templateUrl: '/templates/home.htm'
   });
   
  // configure html5 to get links working on jsfiddle
  //$locationProvider.html5Mode(true);
});

