'use strict';

var events = require('../models/events'),
    Experiment = require('../lib/experiment').Experiment;

/**
 * Controller that renders our index (home) page.
 */
function index (request, response) {
  var rsvpExperiment = new Experiment('RSVP'),
      alternative    = rsvpExperiment.alternative();

  var contextData = {
    'title': 'MGT 656',
    'tagline': 'You are doomed (just kidding).',
    'events': events.getUpcoming(),
    'rsvp': alternative === 'A' ? 'RSVP to ' : '',
    'rsvpExperiment': { alternative: alternative, name: rsvpExperiment.name },
    'ipAddr': request.headers['x-forwarded-for'] ||
           request.connection.remoteAddress ||
                request.socket.remoteAddress ||
                     request.connection.socket.remoteAddress

  };
  response.render('index.html', contextData);
}

module.exports = {
  index: index
};
