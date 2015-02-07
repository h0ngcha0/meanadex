'use strict';

/**
 * AccessToken storage service, an abstraction layer between our token storage
 * and the rest of the system. This feature uses localStorage, which means that
 * our application will NOT support IE7. Once that becomes a requirement, we'll
 * have to use this abstraction layer to store data in a cookie instead.
 */
angular.module('auth').factory('AccessToken',
  ['localStorageService', 'preExpireDelta',
    function (localStorageService, preExpireDelta) {

      /**
       * Our local storage key name constants
       */
      var TOKEN_TYPE = 'token_type';
      var ACCESS_TOKEN = 'access_token';
      var REFRESH_TOKEN = 'refresh_token';
      var ID_TOKEN = 'id_token';
      var EXPIRES_IN = 'expires_in';
      var ISSUE_DATE = 'issue_date';

      return {

        /**
         * Clears the token
         */
        clear: function () {
          localStorageService.remove(TOKEN_TYPE);
          localStorageService.remove(ACCESS_TOKEN);
          localStorageService.remove(REFRESH_TOKEN);
          localStorageService.remove(ID_TOKEN);
          localStorageService.remove(EXPIRES_IN);
          localStorageService.remove(ISSUE_DATE);
        },

        /**
         * Sets all token properties at once.
         */
        setToken: function (jsonToken) {
          this.setTokenType(jsonToken.token_type);
          this.setAccessToken(jsonToken.access_token);
          this.setRefreshToken(jsonToken.refresh_token);
          this.setIdToken(jsonToken.id_token);
          this.setIssueDate(jsonToken.issue_date);
          this.setExpiresIn(jsonToken.expires_in);
        },

        /**
         * Is the current access token expired?
         */
        isExpired: function () {
          var expiresIn = this.getExpiresIn() || 0;
          var issueDate = this.getIssueDate() || 0;
          var now = Math.round((new Date()).getTime() / 1000);

          return issueDate + expiresIn <= now;
        },

        /**
         * Will this token expire in an hour
         */
        expiresSoon: function () {
          var expiresIn = this.getExpiresIn() || 0;
          var issueDate = this.getIssueDate() || 0;
          var now = Math.round((new Date()).getTime() / 1000);

          return issueDate + expiresIn - preExpireDelta <= now;
        },

        /**
         * Get the token type. Bearer, etc.
         */
        getTokenType: function () {
          return localStorageService.get(TOKEN_TYPE);
        },

        /**
         * Set the token type.
         */
        setTokenType: function (value) {
          return localStorageService.set(TOKEN_TYPE, value);
        },

        /**
         * Retrieve the date this token was issued.
         */
        getIssueDate: function () {
          return parseInt(localStorageService.get(ISSUE_DATE)) || null;
        },

        /**
         * Set the issue date for the current access token.
         */
        setIssueDate: function (value) {
          return localStorageService.set(ISSUE_DATE, parseInt(value));
        },

        /**
         * Get the number of seconds after the issue date when this token
         * is considered expired.
         */
        getExpiresIn: function () {
          return parseInt(localStorageService.get(EXPIRES_IN)) || 0;
        },

        /**
         * Set the number of seconds from the issue date when this token
         * will expire.
         */
        setExpiresIn: function (value) {
          return localStorageService.set(EXPIRES_IN, parseInt(value));
        },

        /**
         * Retrieve the access token.
         */
        getAccessToken: function () {
          return localStorageService.get(ACCESS_TOKEN) || null;
        },

        /**
         * Set the access token.
         */
        setAccessToken: function (value) {
          return localStorageService.set(ACCESS_TOKEN, value);
        },

        /**
         * Retrieve the refresh token.
         */
        getRefreshToken: function () {
          return localStorageService.get(REFRESH_TOKEN) || null;
        },

        /**
         * Set the refresh token.
         */
        setRefreshToken: function (value) {
          return localStorageService.set(REFRESH_TOKEN, value);
        },

        /**
         * Retrieve the id token.
         */
        getIdToken: function () {
          return localStorageService.get(ID_TOKEN) || null;
        },

        /**
         * Set the id token.
         */
        setIdToken: function (value) {
          return localStorageService.set(ID_TOKEN, value);
        }
      };
    }
  ]
);
