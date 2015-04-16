/// <reference path="../../../tools/typings/tsd.d.ts" />
/// <reference path="../../../tools/typings/server.d.ts" />

import express = require('express');

interface IAzureADUser {
  userId:string;
  givenName:string;
  familyName:string;
}

class User {

  _userSessionKey = 'aadUser';
  _azureADUser:IAzureADUser;

  constructor(private request:express.Request) {
    this._azureADUser = this.request.session[this._userSessionKey];
  }

  public setCurrentUser(userId:string, givenName:string, familyName:string) {
    var user = this.request.session[this._userSessionKey];
    if (!user) {
      user = this.request.session[this._userSessionKey] = {};
    }
    user['userId'] = userId;
    user['givenName'] = givenName;
    user['familyName'] = familyName;

    this.request.session[this._userSessionKey] = user;
  }

  /**
   * @description
   *  Indicates if the current user has authenticated or not.
   *
   * @returns {boolean} Authentication status.
   */
  public isAuthenticated() {
    return this.request.session[this._userSessionKey];
  }

  /**
   * @description
   *  Unique ID of the current user from Azure AD.
   *
   * @returns {string}  Identity of the user within the AzureAD tenant.
   */
  public userId() {

    return !this._azureADUser ? '' : this._azureADUser.userId;
  }

  /**
   * @description
   *  First name of the user.
   *
   * @returns {string}  User's name as it exists within the AzureAD tenant.
   */
  public firstName() {
    return !this._azureADUser ? '' : this._azureADUser.givenName;
  }

  /**
   * @description
   *  Last name of the user.
   *
   * @returns {string}  User's name as it exists within the AzureAD tenant.
   */
  public lastName() {
    return !this._azureADUser ? '' : this._azureADUser.familyName;
  }

  /**
   * @description
   *  Full name of the user.
   *
   * @returns {string}  User's name as it exists within the AzureAD tenant.
   */
  public fullName() {
    return this.firstName() + ' ' + this.lastName();
  }
}

export = User;