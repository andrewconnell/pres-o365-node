/// <reference path="../../../tools/typings/tsd.d.ts" />
/// <reference path="../../../tools/typings/server.d.ts" />

import express = require('express');
import config = require('nconf');
import uuid = require('node-uuid');
import AzureAD = require('../auth/azureAD');
import User = require('../models/user');
var AuthenticationContext = require('adal-node').AuthenticationContext;

class AuthController {

  constructor(private app:express.Application) {
    // init the routes supported by the application
    this.loadRoutes();
  }

  /**
   * Setup routing for controller.
   */
  public loadRoutes() {
    this.app.get('/login', this.handleLoginGet);
    this.app.get('/auth', this.handleAuthGet);
    this.app.get('/logout', this.handleLogoutGet);
  }

  /**
   * @description
   *  Clients get redirected here in order to create an OAuth authorize url and redirect them to AAD.
   *  There they will authenticate and give their consent to allow this app access to
   *  some resource they own.
   *
   * @param request {express.Request} HTTP request object.
   * @param response {express.Response} HTTP response object.
   */
  public handleLoginGet(request:express.Request, response:express.Response) {
    var azureAD = new AzureAD();

    // create unique state id to project against CSFR
    var requestState = uuid.v4();

    // create the authorization endpoint URL
    var endpoint = azureAD.getAuthorizationCodeEndpoint(requestState);

    // save cookie with the state
    response.cookie('aadAuthCodeReqState', requestState);

    // if a redirect was specified within the app, save it
    if (request.query.redir) {
      response.cookie('postAuthRedirect', request.query.redir);
    }
    // if a specific resource ID is requested, save it
    if (request.query.resourceId) {
      response.cookie('postAuthResourceId', request.query.resourceId);
    }

    // send user to the authorization endpoint
    response.redirect(endpoint);
  }

  /**
   * @description
   *  After consent is granted AAD redirects here.  The ADAL library is invoked via the
   *  AuthenticationContext and retrieves an access token that can be used to access the
   *  user owned resource.

   * @param request {express.Request} HTTP request object.
   * @param response {express.Response} HTTP response object.
   */
  public handleAuthGet(request:express.Request, response:express.Response) {
    if (request.cookies.aadAuthCodeReqState !== request.query.state) {
      // TODO hack... better error logging
      response.send('ERROR: possible CSFR');
    }
    response.clearCookie('aadAuthCodeReqState');

    // build authority & get auth context
    var authorityUrl = config.get('aad-authority') + config.get('aad-tenant-id');
    var authContext = new AuthenticationContext(authorityUrl);

    // get resourceId to query (default to AzureAD graph)
    var resourceId = config.get('aad-graph-api-resource');
    if (request.cookies.postAuthResourceId) {
      resourceId = request.cookies.postAuthResourceId;
      response.clearCookie('postAuthResourceId');
    }

    // get token for specified resource
    authContext.acquireTokenWithAuthorizationCode(
      request.query.code,
      config.get('redirect-endpoint'),
      resourceId,
      config.get('aad-client-id'),
      config.get('aad-client-secret'),
      (error:any, tokenResponse:any) => {
        // todo - make error & token response real objects
        // todo - handle error

        // save the access token credentials returned in session
        var azureAD = new AzureAD(request);
        azureAD.saveAccessTokenResponse(tokenResponse.resource,
          tokenResponse.accessToken,
          tokenResponse.expiresOn,
          tokenResponse.refreshToken);

        // save details about user
        var user = new User(request);
        user.setCurrentUser(tokenResponse.userId, tokenResponse.givenName, tokenResponse.familyName);

        var postAuthRedirect = '/';

        // if redirect requested prior to auth...
        if (request.cookies.postAuthRedirect) {
          postAuthRedirect = request.cookies.postAuthRedirect;
          response.clearCookie('postAuthRedirect');
        }

        response.redirect(postAuthRedirect);
      });
  }

  /**
   * @description
   *  Handles the logout process from the application & Azure AD.
   *
   * @param request {express.Request} HTTP request object.
   * @param response {express.Response} HTTP response object.
   */
  public handleLogoutGet(request:express.Request, response:express.Response) {
    var azureAD = new AzureAD();

    // create logout url
    var logoutUrl = azureAD.getLogoutEndpoint();

    // delete session in store & cookie
    request.session.destroy((error) => {
      if (error) {
        // TODO hack... better error logging
        console.error('failed to destroy session', error);
      }
      request.session = null;
    });

    // delete the auth cookies
    response.clearCookie('aadAuthCodeReqState');

    // redirect to logout page
    response.redirect(logoutUrl);
  }
}

export = AuthController;