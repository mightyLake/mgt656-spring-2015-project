'use strict';

// A very lightweight A/B test tool.

var _ = require('lodash');

var Experiment = (function () {
  /**
   * Initialize with the experiment name.
   */
  function Experiment(name) {
    this.name = name;
  }

  /**
   * Return the experiment alternative to present (A or B)
   */
  Experiment.prototype.alternative = function () {
    var alternative = _.sample(['A', 'B']);
    return alternative;
  };

  return Experiment;
})();

module.exports = {
  Experiment: Experiment
};
