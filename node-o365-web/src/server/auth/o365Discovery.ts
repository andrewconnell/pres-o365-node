/// <reference path="../../../tools/typings/tsd.d.ts" />
/// <reference path="../../../tools/typings/server.d.ts" />

import express = require('express');
import config = require('nconf');
import AzureAD = require('./../auth/azureAD');

class O365Discovery {

  constructor(private request:express.Request) {
    // init the config
    config.env()
      .file({file: 'src/server/config.json'});
  }

  public getAccessToken():string {
    var azureAD = new AzureAD(this.request);

    // try to get access token from discovery service
    var cred = azureAD.getCredsFromSession(config.get('o365-discovery-resource'));

    // does access token exist?
    if (!cred) {
      console.log('... no discovery service cred found in session cache');
      return null;
    } else {
      console.log('... discovery service cred found in session cache');

      // todo - add check if credential has already expired (or will in next 5m)
      //  if so, return 'EXPIRED', use refresh token to get a new token

      return cred.accessToken;
    }
  }

  /* =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+= */

}

export = O365Discovery;