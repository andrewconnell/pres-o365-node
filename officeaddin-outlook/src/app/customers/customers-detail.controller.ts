/// <reference path="../../../tools/typings/tsd.d.ts" />
/// <reference path="../../../tools/typings/app.d.ts" />

module outlookApp.customers {
  'use strict';

  class CustomerDetailController {
    customer:outlookApp.customers.ICustomer = {};

    static $inject = ['$q', '$window', '$location', '$routeParams', 'outlookApp.services.customerService'];

    /**
     * Controller constructor
     * @param $q                Angular's $q promise service.
     * @param $window           Angular's $window service.
     * @param $location         Angular's $location service.
     * @param $routeParams      Angular's $routeParams service.
     * @param customerService   Custom Angular service for customer data.
     */
    constructor(private $q:ng.IQService,
                private $window:ng.IWindowService,
                private $location:ng.ILocationService,
                private $routeParams:outlookApp.customers.ICustomerRouteParams,
                private customerService:outlookApp.services.CustomerService) {

      // if ID is passed in, load customer
      var customerId = $routeParams.customerID;
      if (customerId) {
        this.loadCustomer(customerId);
      } else {
        this.$location.path('/');
      }
    }

    /**
     * Load the specified customer.
     *
     * @param customerID {number}   ID of the selected customer to display.
     */
    loadCustomer(customerID) {
      var deferred = this.$q.defer();

      this.customerService.lookupCustomer(customerID)
        .then((customer) => {
          this.customer = customer;
          deferred.resolve();
        })
        .catch((error) => {
          deferred.reject(error);
        });

      return deferred.promise;
    }

    /**
     * Navigates back to the list.
     */
    goBack() {
      this.$window.history.back();
    }

  }

  // register the controller
  angular.module('outlookApp').controller('outlookApp.customers.customersDetailController', CustomerDetailController);
}