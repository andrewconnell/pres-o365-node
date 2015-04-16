/// <reference path="../../../tools/typings/tsd.d.ts" />
/// <reference path="../../../tools/typings/server.d.ts" />

import express = require('express');
import User = require('../models/user');

class HomeController {
  constructor(private app:express.Application) {
    this.loadRoutes();
  }

  /**
   * Setup routing for controller.
   */
  public loadRoutes() {
    // setup home route for application
    this.app.get('/', this.handleRootGet);
  }

  /**
   * @description
   *  Handler for the request for the default home route.
   *
   * @param request {express.Request} HTTP request object.
   * @param response {express.Response} HTTP response object.
   */
  public handleRootGet(request:express.Request, response:express.Response) {
    var vm:any = {};

    // get current user details
    var user = new User(request);

    vm.isAuthenticated = user.isAuthenticated();
    vm.user = {
      id: user.userId(),
      name: user.fullName()
    };

    // render the view
    response.render('home/index', vm);
  }
}

export = HomeController;