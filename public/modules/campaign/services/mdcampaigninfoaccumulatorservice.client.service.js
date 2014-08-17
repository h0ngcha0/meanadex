'use strict';

angular.module('campaign').service('mdCampaignInfoAccumulatorService', [
  function() {
    this.type = null;
    this.variantName = null;
    this.baseCost = null;
    this.salesGoal = null;
    this.price = null;
    this.title = null;
    this.description = null;
    this.url = null,
    this.length = null;

    // Getters
    this.setTshirtType = function(type) {
      this.type = type;
    };

    this.setTshirtVariant = function(name) {
      this.variantName = name;
    };

    this.setBaseCost = function(cost) {
      this.baseCost = cost;
    };

    this.setSalesGoal = function(goal) {
      this.salesGoal = goal;
    };

    this.setPrice = function(price) {
      this.price = price;
    };

    this.setTitle = function(title) {
      this.title = title;
    };

    this.setDescription = function(description) {
      this.description = description;
    };

    this.setUrl = function(url) {
      this.url = url;
    };

    this.setLength = function(length) {
      this.length = length;
    };

    // Setters
    this.getTshirtType = function(type) {
      return this.type;
    };

    this.getTshirtVariant = function(name) {
      return this.variantName;
    };

    this.getBaseCost = function(cost) {
      return this.baseCost;
    };

    this.getSalesGoal = function(goal) {
      return this.salesGoal;
    };

    this.getPrice = function(price) {
      return this.price;
    };

    this.getTitle = function(title) {
      return this.title;
    };

    this.getDescription = function(description) {
      return this.description;
    };

    this.getUrl = function(url) {
      return this.url;
    };

    this.getLength = function(length) {
      return this.length;
    };
  }
]);
