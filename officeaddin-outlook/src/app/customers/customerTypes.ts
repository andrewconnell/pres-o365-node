/// <reference path="../../../tools/typings/tsd.d.ts" />
/// <reference path="../../../tools/typings/app.d.ts" />

module outlookApp.customers {
  /**
   * Interface for parameters on the customer route.
   */
  export interface ICustomerRouteParams extends ng.route.IRouteParamsService {
    customerID: string;
  }

  /**
   * Interface declaring the type of the customer.
   */
  export interface ICustomer {
    __metadata?:any;
    CustomerID?: string;
    CompanyName?: string;
    ContactName?: string;
    ContactTitle?: string;
    Address?: string;
    City?: string;
    Region?: string;
    PostalCode?: string;
    Country?: string;
    Phone?: string;
    Fax?: string;
  }

  /**
   * Interface representing the data that comes back from Northwind Customer service
   */
  export interface INorthwindCustomersOdataResponse extends ng.IHttpPromiseCallbackArg<any> {
    d:IOdataResults;
  }

  export interface IOdataResults {
    results:ICustomer[];
  }
}