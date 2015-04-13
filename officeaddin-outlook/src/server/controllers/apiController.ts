/// <reference path="../../../tools/typings/tsd.d.ts" />
/// <reference path="../../../tools/typings/server.d.ts" />

import express = require('express');
import request = require('request');

class ApiController {
  constructor(private app:express.Application) {
    this.loadRoutes();
  }

  /**
   * Setup routing for controller.
   */
  public loadRoutes() {
    // get all customers
    this.app.get('/api/customers', this._queryCustomers);
    // filter customers
    this.app.get('/api/customers/lookupByName/:customerNames', this._queryCustomerByName);
    this.app.get('/api/customers/lookupById/:customerId', this._queryCustomerById);
  }

  /* ======================================================================= */

  private _queryCustomers(expRequest:express.Request, expResponse:express.Response) {
    // build query
    var endpoint = 'http://services.odata.org/V3/Northwind/Northwind.svc/Customers?';

    var options:request.Options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json;odata=verbose'
      }
    };

    // execute query
    console.log('executing query: ' + endpoint);
    request(endpoint, options, (error, response, body) => {
      console.log('query response', body);
      expResponse.send(body);
    });
  }

  private _queryCustomerByName(expRequest:express.Request, expResponse:express.Response) {
    // get query params
    var customerNames:string[] = expRequest.params.customerNames.split(',');

    // build filter
    var filter:string = '';
    customerNames.forEach((customerName, index) => {
      // add 'or' prefix if this isn't the first one
      if (index > 0) {
        filter += ' or ';
      }
      filter += 'endswith(ContactName,\'' + customerName + '\')';
    });

    // build query
    var endpoint = 'http://services.odata.org/V3/Northwind/Northwind.svc/Customers?'
      + '$select=CustomerID,ContactName,ContactTitle'
      + '&$filter=' + filter;

    var options:request.Options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json;odata=verbose'
      }
    };

    // execute query
    console.log('executing query: ' + endpoint);
    request(endpoint, options, (error, response, body) => {
      console.log('query response', body);
      expResponse.send(body);
    });
  }

  private _queryCustomerById(expRequest:express.Request, expResponse:express.Response) {
    // get query param
    var customerId = expRequest.params.customerId;

    // build query
    var endpoint = 'http://services.odata.org/V3/Northwind/Northwind.svc/Customers?'
      + '$filter=CustomerID eq \'' + customerId + '\'';

    var options:request.Options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json;odata=verbose'
      }
    };

    // execute query
    console.log('executing query: ' + endpoint);
    request(endpoint, options, (error, response, body) => {
      console.log('query response', body);
      expResponse.send(body);
    });
  }
}

export = ApiController;