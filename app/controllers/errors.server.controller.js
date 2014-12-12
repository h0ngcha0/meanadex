'use strict';

/**
 * Get the error message from error object
 */
exports.getErrorMessage = function(err) {
  if(!(err instanceof Error)) throw new Error('err is not an Error');
  return err.message;
};
