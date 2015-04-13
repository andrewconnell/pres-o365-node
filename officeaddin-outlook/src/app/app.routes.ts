/// <reference path="../../tools/typings/tsd.d.ts" />
/// <reference path="../../tools/typings/app.d.ts" />

module outlookApp {
  'use strict';

  export class Routes {
    static configure($routeProvider:ng.route.IRouteProvider) {
      var viewBase:string = 'app/';

      $routeProvider
        .when('/', {
          templateUrl: viewBase + 'customers/customers.html',
          controller: 'outlookApp.customers.customersController',
          controllerAs: 'vm'
        })
        .when('/:customerID', {
          templateUrl: viewBase + 'customers/customers-detail.html',
          controller: 'outlookApp.customers.customersDetailController',
          controllerAs: 'vm'
        });

      $routeProvider.otherwise({redirectTo: '/'});
    }
  }
}