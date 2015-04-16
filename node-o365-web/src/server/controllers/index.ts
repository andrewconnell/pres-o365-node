/// <reference path="../../../tools/typings/tsd.d.ts" />
/// <reference path="../../../tools/typings/server.d.ts" />

import express = require('express');
import HomeController = require('./homeController');
import AuthController = require('./authController');
import DiscoveryController = require('./o365DiscoveryController');

class Controllers {
  constructor(private app:express.Application) {
  }

  public init() {
    var home = new HomeController(this.app);
    var auth = new AuthController(this.app);
    var disco = new DiscoveryController(this.app);
  }
}

export = Controllers;