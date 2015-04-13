/// <reference path="../../tools/typings/tsd.d.ts" />
/// <reference path="../../tools/typings/app.d.ts" />
/// <reference path="../../tools/typings/custom.d.ts" />

(() => {
  'use strict';

  // create the angular app
  var app = angular.module('outlookApp', [
    'ngRoute',
    'ngAnimate',
    'ngSanitize',
    'ngMaterial'
  ]);

  // configure the app
  app.config([
    '$logProvider',
    '$routeProvider',
    '$mdThemingProvider',
      ($logProvider: ng.ILogProvider,
       $routeProvider: ng.route.IRouteProvider,
       $mdThemingProvider: any) => {

    // set debug logging to on
    if ($logProvider.debugEnabled) {
      $logProvider.debugEnabled(true);
    }

    // setup routing
    outlookApp.Routes.configure($routeProvider);

    // configure theme color
    $mdThemingProvider.theme('default')
                      .primaryPalette('blue');
  }]);

  // when office has initialized, manually bootstrap the app
  Office.initialize = () => {
    angular.bootstrap(jQuery('#container'), ['outlookApp']);
  };

})();