/// <reference path="../../../tools/typings/tsd.d.ts" />
/// <reference path="../../../tools/typings/app.d.ts" />

module outlookApp.services {

  export class CustomerService {
    static $inject = ['$q', '$http'];

    /**
     * Custom Angular service that talks to a static JSON file simulating a REST API.
     *
     * @param $q                Angular's $q promise service.
     * @param $http             Angular's $http service.
     */
    constructor(private $q:ng.IQService,
                private $http:ng.IHttpService) {
    }

    /**
     * Queries the remote service for possible customer matches.
     *
     * @param possibleCustomers {Array<string>}   Collection of customer last names to lookup.
     */
    lookupCustomerPartials(possibleCustomers:string[]) {
      var deferred = this.$q.defer();

      // if nothing submitted return empty collection
      if (!possibleCustomers || possibleCustomers.length === 0) {
        deferred.resolve([]);
      }

      // build filter
      var filter:string = '';
      possibleCustomers.forEach((possibleHit:string, index) => {
        if (index !== 0) {
          filter += ',';
        }
        filter += possibleHit;
      });

      // fetch data
      var endpoint = '/api/customers/lookupbyname/' + filter;

      // execute query
      this.$http({
        method: 'GET',
        url: endpoint
      }).success((response:outlookApp.customers.INorthwindCustomersOdataResponse) => {
        deferred.resolve(response.d.results);
      }).error((error:any) => {
        deferred.reject(error);
      });

      return deferred.promise;
    }

    /**
     * Finds a specific customer form the datasource.
     *
     * @param customerID  {number}    Unique ID of the customer.
     */
    lookupCustomer(customerID) {
      var deferred = this.$q.defer();

      // fetch data
      var endpoint = '/api/customers/lookupById/' + customerID;

      this.$http({
        method: 'GET',
        url: endpoint
      }).success((response:outlookApp.customers.INorthwindCustomersOdataResponse) => {
        deferred.resolve(response.d.results[0]);
      }).error((error:any) => {
        deferred.reject(error);
      });

      return deferred.promise;
    }

  }

  angular.module('outlookApp').service('outlookApp.services.customerService', CustomerService);
}