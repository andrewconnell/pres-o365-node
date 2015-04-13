/// <reference path="../../../tools/typings/tsd.d.ts" />
/// <reference path="../../../tools/typings/server.d.ts" />

import express = require('express');

class HomeController {
  constructor(private app:express.Application) {
    this.loadRoutes();
  }

  /**
   * Setup routing for controller.
   */
  public loadRoutes() {
    // setup home route for application
    this.app.get('/', (request:express.Request, response:express.Response) => {
      response.render('home/index', {/* model would go here */});
    });

  }
}

export = HomeController;