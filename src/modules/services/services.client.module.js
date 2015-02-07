'use strict';

/**
 * The Services module contains all of the necessary API resources
 * used by the client. Its resources are available via injection to
 * any module that declares it as a dependency.
 */

ApplicationConfiguration.registerModule('services',
  ['ngResource', 'notification']);

