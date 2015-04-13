/// <reference path="../../../tools/typings/tsd.d.ts" />
/// <reference path="../../../tools/typings/server.d.ts" />

import express = require('express');
import HomeController = require('./homeController');
import ApiController = require('./apiController');

class Controllers {
  constructor(private app:express.Application) {
  }

  public init() {
    var home = new HomeController(this.app);
    var api = new ApiController(this.app);
  }
}

export = Controllers;