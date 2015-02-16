'use strict';

var events = require('../models/events');
var validator = require('validator');
var _       = require('lodash');

// Date data that would be useful to you
// completing the project These data are not
// used a first.
//
var allowedDateInfo = {
  months: {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
  },
  days: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
    24, 25, 26, 27, 28, 29, 30, 31
  ],
  
  minutes: [0, 30],
/*
  hours: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23
  ],
  */
  
  hours: {
    0: '12 am',
    1: '1 am', 
    2: '2 am', 
    3: '3 am',
    4: '4 am',
    5: '5 am',
    6: '6 am',
    7: '7 am',
    8: '8 am',
    9: '9 am',
    10: '10 am',
    11: '11 am',
    12: '12 pm',
    13: '1 pm', 
    14: '2 pm', 
    15: '3 pm', 
    16: '4 pm', 
    17: '5 pm', 
    18: '6 pm', 
    19: '7 pm', 
    20: '8 pm', 
    21: '9 pm', 
    22: '10 pm',
    23: '11 pm'
  },
  years: [2015,2016]
};

/**
 * Controller that renders a list of events in HTML.
 */
function listEvents(request, response) {
  var currentTime = new Date();
  var contextData = {
    'events': events.all,
    'time': currentTime,
    'rsvp': '', // Never show rsvp here (not running experiment)
  };
  response.render('event.html', contextData);
}

/**
 * Controller that renders a page for creating new events.
 */
function newEvent(request, response){
  var contextData = {allowedDateInfo: allowedDateInfo};
  response.render('create-event.html', contextData);
}

/**
 * Controller to which new events are submitted.
 * Validates the form and adds the new event to
 * our global list of events.
 */
function saveEvent(request, response){
  var contextData = {errors: []},
      sanitizers  = {
        'year' : validator.toInt,
        'day'  : validator.toInt,
        'month' : validator.toInt,
        'hour' : validator.toInt,
        'minute': validator.toInt
      },
      validators  = {
        'The title should be less than 50 characters.' : [
          'title',
          _.partialRight(validator.isLength, 1, 49)],
        'The image URL must start with http:// or https://.' : [
          'image',
          _.partialRight(validator.matches, /^http(s)?:\/\//)],
        'The image extension must be .gif or .png.' : [
            'image',
          _.partialRight(validator.matches, /\.(gif|png)$/)],
        'The location must be less than 50 characters.' : [
          'location',
          _.partialRight(validator.isLength, 1, 49)],
        'The year must be between 2015 and 2016' : [
          'year',
          function (val) {
            return val >= 2015 && val <= 2016;
          }],
        'The month must be between 0 and 11.' : [
          'month',
          function (val) {
            return val >= 0 && val <= 11;
          }],
        'The hour must be between 0 and 23' : [
          'hour',
          function (val) {
            return val >= 0 && val <= 23;
          }],
        'The minute must be 0 or 30.' : [
          'minute',
          function (val) {
            return val === 0 || val === 30;
          }],
        'The day must be between 1 and 31': [
          'day',
          function (val) {
            return val <= 31 && val >= 1;
          }]
      };

  // Run sanitizers
  for (var property in sanitizers) {
    request.body[property] = sanitizers[property](request.body[property]);
  }

  // Run validators
  for (var err in validators) {
    var errorMsg = err,
        field    = validators[err][0],
        validate = validators[err][1];
    if (!validate(request.body[field])) {
      contextData.errors.push(errorMsg);
    }
  }

  if (contextData.errors.length === 0) {
    var newEvent = {
      title: request.body.title,
      location: request.body.location,
      image: request.body.image,
      date: new Date(request.body.year,
                     request.body.month,
                     request.body.day),
      attending: [],
      id: events.all.length
    };
    events.all.push(newEvent);
    response.redirect('/events/'+newEvent.id);
  } else {
    response.render('create-event.html', contextData);
  }
}

function eventDetail (request, response) {
  var ev = events.getById(parseInt(request.params.id));
  if (ev === null) {
    return response.status(404).send('No such event');
  }
  response.render('event-detail.html', {event: ev});
}

function rsvp (request, response){
  var ev = events.getById(parseInt(request.params.id));
  var contextData = {errors: [], event: ev};

  if (ev === null) {
    return response.status(404).send('No such event');
  }
  if(!validator.isEmail(request.body.email) || request.body.email.toLowerCase().indexOf('@yale.edu') === -1){
    contextData.errors.push('Invalid email');
    response.render('event-detail.html', contextData);    
  }else{
    ev.attending.push(request.body.email);
    response.redirect('/events/' + ev.id);
  }

}

function api(request,response){
  var output = {events: []};
  var search = request.query.search;

  if(search){
    for(var i=0; i<events.all.length; i++){
      if(events.all[i].title.indexOf(search) !== -1){
        output.events.push(events.all[i]);
      }
    }
    
  }else{
    output.events = events.all;
  }
  
  response.json(output);
}

/**
 * Export all our functions (controllers in this case, because they
 * handles requests and render responses).
 */
module.exports = {
  'listEvents': listEvents,
  'eventDetail': eventDetail,
  'newEvent': newEvent,
  'saveEvent': saveEvent,
  'rsvp': rsvp,
  'api': api
};
