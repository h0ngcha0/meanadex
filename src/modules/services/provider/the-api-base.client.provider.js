/**
 * This provider injects a sane default for the theApiBase property. It
 * may be overridden simply by injecting a constant of the same name in any
 * module which lists services as a dependency.
 *
 */
angular.module('services').constant('theApiBase', '');
