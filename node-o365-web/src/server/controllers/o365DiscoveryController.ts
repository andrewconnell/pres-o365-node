/// <reference path="../../../tools/typings/tsd.d.ts" />
/// <reference path="../../../tools/typings/server.d.ts" />

import express = require('express');
import request = require('request');
import config = require('nconf');
import User = require('../models/user');
import AzureAD = require('../auth/azureAD');
import Q = require('q');

interface IO365DiscoveryServiceResult {
  capability:string;
  serviceName:string;
  serviceEndpointUri:string;
  serviceResourceId:string;
}

class DiscoveryController {

  constructor(private app:express.Application) {
    this.loadRoutes();
  }

  /**
   * @description
   *  Retrieves the resource ID for the current service from the config settings.
   *
   * @returns {string}  Office 365 discovery service's resource Id.
   */
  static getServiceResourceId():string {
    config.env()
          .file({file: 'src/server/config.json'});

    return config.get('o365-discovery-resource');
  }

  /**
   * @description
   *  Retrieves the endpoint for the current service from the config settings.
   *
   * @returns {string}  Office 365 discovery service's endpoint.
   */
  static getServiceEndpoint():string {
    config.env()
      .file({file: 'src/server/config.json'});

    return config.get('o365-discovery-endpoint');
  }

  /**
   * Setup routing for controller.
   */
  public loadRoutes() {
    // setup home route for application
    this.app.get('/discovery', this.handleRootGet);
    // setup service routes
    this.app.get('/discovery/allservices', this.handleAllServicesGet);
    this.app.get('/discovery/myservices', this.handleMyServicesGet);
  }

  /**
   * @description
   *  Handler for HTTP GET requests to /discovery/
   *
   * @param request {express.Request} HTTP request object.
   * @param response {express.Response} HTTP response object.
   */
  private handleRootGet(request:express.Request, response:express.Response) {
    var user = new User(request);

    // ensure they are logged in -- if not, redirect to auth
    if (!user.isAuthenticated()) {
      // save path to this
      response.redirect('/login?redir=/discovery');
    }

    // get current user details
    var vm:any = {};
    vm.isAuthenticated = user.isAuthenticated();
    vm.user            = {
      id  : user.userId(),
      name: user.fullName()
    };

    response.render('discovery/index', vm);
  }

  /**
   * @description
   *  Handler for HTTP GET requests to /discovery/allservices
   *
   * @param expRequest {express.Request} HTTP request object.
   * @param expResponse {express.Response} HTTP response object.
   */
  private handleAllServicesGet(expRequest:express.Request, expResponse:express.Response) {
    var user = new User(expRequest);

    // ensure they are logged in -- if not, redirect to auth
    if (!user.isAuthenticated()) {
      // save path to this
      expResponse.redirect('/login?redir=/discovery');
    }

    // get current user details
    var vm:any = {};
    vm.title           = 'All Services';
    vm.isAuthenticated = user.isAuthenticated();
    vm.user            = {
      id  : user.userId(),
      name: user.fullName()
    };
    vm.capabilities    = [];

    // build up http request to get data from discovery service
    var endpoint = DiscoveryController.getServiceEndpoint() + 'allservices?'
      + '$select=capability,serviceName,serviceEndpointUri,serviceResourceId';
    var options:request.Options = {
      url    : endpoint,
      method : 'GET',
      headers: {
        Accept: 'application/json'
      }
    };


    request(endpoint, options, function(error, response, body) {
      var data = JSON.parse(body);
      data.value.forEach((element:IO365DiscoveryServiceResult) => {
        vm.capabilities.push({
          capability: element.capability,
          name      : element.serviceName,
          endpoint  : '-',
          resourceId: '-'
        });
      });

      expResponse.render('discovery/list', vm);
    });

  }

  /**
   * @description
   *  Handler for HTTP GET requests to /discovery/myservices
   *
   * @param expRequest {express.Request} HTTP request object.
   * @param expResponse {express.Response} HTTP response object.
   */
  private handleMyServicesGet(expRequest:express.Request, expResponse:express.Response) {
    var user = new User(expRequest);

    // ensure they are logged in -- if not, redirect to auth
    if (!user.isAuthenticated()) {
      // save path to this
      expResponse.redirect('/login?redir=/discovery');
    }

    // get access token for discovery service
    var accessToken = AzureAD.getAccessToken(expRequest, DiscoveryController.getServiceResourceId());

    // if no token returned, go get one & come back
    if (!accessToken) {
      expResponse.redirect('/login?'
        + 'redir='
        + encodeURIComponent(expRequest.route.path)
        + '&resourceId='
        + encodeURIComponent(DiscoveryController.getServiceResourceId())
      );
    } else if (accessToken === 'EXPIRED') {
      // if what was returned is expired...
      //  need to get a new one using refresh token
      //var refreshToken = discoHelper.getRefreshToken();
      // todo - create redirect & handler to use existing refresh token to get new token
    } else {

      // get current user details
      var vm:any = {};
      vm.title           = 'My Services';
      vm.isAuthenticated = user.isAuthenticated();
      vm.user            = {
        id  : user.userId(),
        name: user.fullName()
      };
      vm.capabilities    = [];

      // build up http request to get data from discovery service
      var endpoint = DiscoveryController.getServiceEndpoint() + 'services?'
        + '$select=capability,serviceName,serviceEndpointUri,serviceResourceId';
      var options:request.Options = {
        url    : endpoint,
        method : 'GET',
        headers: {
          Accept       : 'application/json',
          Authorization: 'Bearer ' + accessToken
        }
      };

      request(endpoint, options, function(error, response, body) {
        var data = JSON.parse(body);
        data.value.forEach((element:IO365DiscoveryServiceResult) => {
          vm.capabilities.push({
            capability: element.capability,
            name      : element.serviceName,
            endpoint  : element.serviceEndpointUri,
            resourceId: element.serviceResourceId
          });
        });

        expResponse.render('discovery/list', vm);
      });
    }
  }

}

export = DiscoveryController;