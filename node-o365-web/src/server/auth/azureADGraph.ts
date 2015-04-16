/// <reference path="../../../tools/typings/tsd.d.ts" />
/// <reference path="../../../tools/typings/server.d.ts" />

import config = require('nconf');

class AzureADGraph {

  constructor() {
    // init the config
    config.env()
      .file({file: 'src/server/config.json'});
  }

  public get
}

export = AzureADGraph;