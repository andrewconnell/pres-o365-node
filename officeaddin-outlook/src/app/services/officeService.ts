/// <reference path="../../../tools/typings/tsd.d.ts" />
/// <reference path="../../../tools/typings/app.d.ts" />
/// <reference path="../../../tools/typings/custom.d.ts" />

module outlookApp.services {

  export class OfficeService {
    static $inject = ['$q'];

    /**
     * Custom Angular service that works with the host Office client.
     *
     * @param $q                Angular's $q promise service.
     */
    constructor(private $q:ng.IQService) {}

    /**
     * Retrieves a collection of all possible names in the currently selected email.
     *
     * @returns {Array<string>}   Collection of potential names.
     */
    getWordCandidatesFromEmail() {
      var deferred = this.$q.defer();

      try {
        var currentEmail = Office.cast.item.toItemRead(Office.context.mailbox.item);

        // get list of all words in email that start with an upper case letter
        //  these are potential names of employees
        deferred.resolve(currentEmail.getRegExMatches().PossibleName);
      } catch (error) {
        deferred.reject(error);
      }

      return deferred.promise;
    }
  }

  angular.module('outlookApp').service('outlookApp.services.officeService', OfficeService);
}