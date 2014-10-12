'use strict';

(function() {
  describe('Images Utils Service Tests', function() {
    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    it('checks the accepted format for images',
       inject(function(ImagesUtils) {
         [
           'jpg',
           'png',
           'jpeg',
           'bmp',
           'gif'
         ].forEach(function(format) {
           expect(true).toEqual(ImagesUtils.isImage({type: format}));
         });
       }));
  });
}());
