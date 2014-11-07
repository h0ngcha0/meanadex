'use strict';

//Campaigns service used to communicate Campaigns REST endpoints
angular.module('campaigns').service('CampaignCache', [
  'localStorageService',
  function(localStorageService) {
    var store = function(k, v) {
      localStorageService.set(k, v);
    };

    var retrieve = function(k) {
      return localStorageService.get(k);
    };

    var bind = function(bo) {
      localStorageService.bind(bo.scope, bo.key, bo.scope[bo.key]);
    };

    this.set = function(k, v) {
      store(k, v);
    };

    this.get = function(k, v) {
      return retrieve(k);
    };

    this.bind = function(bo) {
      bind(bo);
    };

    // price
    var price = 'tshirtPrice';
    this.getPrice = function() {
      return retrieve(price);
    };

    this.bindPrice = function(sco) {
      bind({
        scope: sco,
        key: price
      });
    };

    // goal
    var goal = 'tshirtsSalesGoal';
    this.getGoal = function() {
      return retrieve(goal);
    };

    this.bindGoal = function(sco) {
      bind({
        scope: sco,
        key: goal
      });
    };

    // title
    var title = 'campaignTitle';
    this.getTitle = function() {
      return retrieve(title);
    };

    this.bindTitle = function(sco) {
      bind({
        scope: sco,
        key: title
      });
    };

    // description
    var description = 'campaignDescription';
    this.getDescription = function() {
      return retrieve(description);
    };

    this.bindDescription = function(sco) {
      bind({
        scope: sco,
        key: description
      });
    };

    // url
    var url = 'campaignUrl';
    this.getUrl = function() {
      return retrieve(url);
    };

    this.bindUrl = function(sco) {
      bind({
        scope: sco,
        key: url
      });
    };

    // length
    var length = 'currentCampaignLength';
    this.getLength = function() {
      return retrieve(length);
    };

    this.bindLength = function(sco) {
      bind({
        scope: sco,
        key: length
      });
    };

    // background color
    var color = 'color';
    this.setColor = function(v) {
      store(color, v);
    };

    this.getColor = function() {
      return retrieve(color);
    };

    // tshirt
    var tshirt = 'tshirt';
    this.setTshirt = function(v) {
      store(tshirt, v);
    };

    this.getTshirt = function() {
      return retrieve(tshirt);
    };

    // clear
    this.clear = function() {
      localStorageService.clearAll();
    };
  }
]);
