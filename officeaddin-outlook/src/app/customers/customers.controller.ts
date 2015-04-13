/// <reference path="../../../tools/typings/tsd.d.ts" />
/// <reference path="../../../tools/typings/app.d.ts" />

module outlookApp.customers {

  export class CustomersController {

    lookupCandidates:string[] = [];
    matchCandidates:outlookApp.customers.ICustomer[] = [];


    static $inject = ['$q', '$location', 'outlookApp.services.officeService', 'outlookApp.services.customerService'];

    constructor(private $q:ng.IQService,
                private $location:ng.ILocationService,
                private officeService:outlookApp.services.OfficeService,
                private customerService:outlookApp.services.CustomerService) {

      this.loadMatchesFromEmail()
        .then(() => {
          return this.getCadidateCustomersFromService();
        });
    }

    /**
     * Load the possible candidate matches in the email within the app.
     * @returns {Promise<T>|IPromise<T>}
     */
    loadMatchesFromEmail() {
      var deferred = this.$q.defer();

      this.officeService.getWordCandidatesFromEmail()
        .then((candidates:any) => {
          this.lookupCandidates = candidates;
          deferred.resolve();
        })
        .catch((error:any) => {
          deferred.reject(error);
        });

      return deferred.promise;
    }

    /**
     * Query the lookup service to get a list of all matching candidates.
     *
     * @returns {Promise<T>|IPromise<T>}
     */
    getCadidateCustomersFromService() {
      var deferred = this.$q.defer();

      this.customerService.lookupCustomerPartials(this.lookupCandidates)
        .then((candidates:any) => {
          this.matchCandidates = candidates;
          deferred.resolve();
        })
        .catch((error:any) => {
          console.log('>>> failed getCadidateCustomersFromService', error);
          deferred.reject(error);
        });

      return deferred.promise;
    }

    /**
     * Changes the view to the the customer detail page.
     *
     * @param customer {object}   Customer selected from the list.
     */
    goToCustomer(customer) {
      this.$location.path('/' + customer.CustomerID);
    }

  }

  angular.module('outlookApp').controller('outlookApp.customers.customersController', CustomersController);
}