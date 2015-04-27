/// <reference path="../../../tools/typings/tsd.d.ts" />
/// <reference path="../../../tools/typings/server.d.ts" />

import express = require('express');
import config = require('nconf');

interface IResourceCredentials {
  resourceId:string;
  accessToken:string;
  expiration:string;
  refreshToken:string;
}

class AzureAD {
  _resourceCredentialsKey = 'resourceCredentials';

  constructor(private request?:express.Request) {
    // init the config
    config.env()
      .file({file: 'src/server/config.json'});
  }

  /**
   * @description
   *  Get the formatted Azure AD's authorization code endpoint
   *  used in the OAuth 2.0 authorization code flow.
   *
   * @param requestState {string} Unique string used to protect against
   *  CSFR attacks. This is included in the URL request & includes it when
   *  returning back to the application.
   * @returns {string} Fully qualified Azure AD authorization endpoint.
   */
  public getAuthorizationCodeEndpoint(requestState:string) {
    // get endpoint from configuration
    var endpoint = config.get('aad-authorization-endpoint-template');

    // replace all params in config
    endpoint = endpoint.replace('{{tenantid}}', config.get('aad-tenant-id'));
    endpoint = endpoint.replace('{{clientid}}', config.get('aad-client-id'));
    endpoint = endpoint.replace('{{redirecturi}}', config.get('redirect-endpoint'));
    endpoint = endpoint.replace('{{state}}', requestState);

    return endpoint;
  }

  /**
   * @description
   *  Get the formatted Azure AD's logout endpoint.
   *
   * @returns {string} Fully qualified Azure AD logout endpoint.
   */
  public getLogoutEndpoint() {
    // get endpoint from configuration
    var endpoint = config.get('aad-logout-endpoint-template');

    // replace all params in config
    endpoint = endpoint.replace('{{tenantid}}', config.get('aad-tenant-id'));
    endpoint = endpoint.replace('{{postLogoutRedirectUri}}', config.get('post-logout-redirect-uri'));

    return endpoint;
  }

  /**
   * @description
   *  Saves an authentication result returned from AzureAD's token endpoint.
   *
   * @param resourceId {string}   ID of the resource.
   * @param accessToken {string}  Bearer token to be used with the resource.
   * @param expiration  {string}  Expiration date for the bearer token.
   * @param refreshToken  {string}  Refresh token to be used to re-obtain a new token.
   */
  public saveAccessTokenResponse(resourceId:string, accessToken:string, expiration:string, refreshToken:string) {
    var resource = this.request.session[this._resourceCredentialsKey];

    if (!resource) {
      resource = this.request.session[this._resourceCredentialsKey] = [];
    }

    // todo - see if existing entry for resource (if so, update that)

    var entry:IResourceCredentials = {
      resourceId  : resourceId,
      accessToken : accessToken,
      expiration  : expiration,
      refreshToken: refreshToken
    };
    resource.push(entry);

    this.request.session[this._resourceCredentialsKey] = resource;
  }

  /**
   * @description
   *  Retrieve credentials from the local session.
   *
   * @param resourceId  {string}  ID of the resource to look for.
   * @returns {IResourceCredentials} Instance of the discovery credentials if found
   *                                  or null if nothing found.
   */
  public getCredsFromSession(resourceId:string):IResourceCredentials {
    // get reference to session resourceCredentials
    var resourceCredentials = this.request.session[this._resourceCredentialsKey];

    var resourceCredential:IResourceCredentials = null;

    // if not present, null out
    if (!resourceCredentials || !resourceCredentials.length || resourceCredentials.length === 0) {
      resourceCredential = null;
    } else {
      // try to find resourceCredentials
      resourceCredentials.forEach((cred:IResourceCredentials) => {
        if (cred.resourceId === resourceId) {
          resourceCredential = cred;
        }
      });
    }

    return resourceCredential;
  }

  /**
   * @description
   *  Retrieves access token for specified service using the
   *
   * @param request {express.Request} HTTP request object.
   * @param tokenKey  {string}  ID of the token to extract from the session.
   * @returns {string}  OAuth bearer token (or null value if not found).
   */
  public static getAccessToken(request:express.Request, tokenKey:string):string {
    var azureAD = new AzureAD(request);

    // try to get access token from discovery service
    var cred = azureAD.getCredsFromSession(tokenKey);

    // does access token exist?
    if (!cred) {
      console.log('... no cred found in session cache for ' + tokenKey);
      return null;
    } else {
      console.log('... cred found in session cache for ' + tokenKey);

      // todo - add check if credential has already expired (or will in next 5m)
      //  if so, return 'EXPIRED', use refresh token to get a new token

      return cred.accessToken;
    }
  }

}

export = AzureAD;