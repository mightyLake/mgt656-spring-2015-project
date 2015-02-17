'use strict';

// Import our express and our configuration
var express = require('express');
var configure = require('./config.js');

// Import our controllers
var indexControllers = require('./controllers/index.js');
var aboutControllers = require('./controllers/about.js');
var eventControllers = require('./controllers/events.js');


// Create our express app
var app = express();

app.enable('trust proxy');

// Configure it
configure(app);

// Add routes mapping URLs to controllers
app.get('/', indexControllers.index);
app.get('/about', aboutControllers.about);
app.get('/events', eventControllers.listEvents);
app.get('/events/new', eventControllers.newEvent);
app.post('/events/new', eventControllers.saveEvent);
app.get('/api/events', eventControllers.api);
app.get('/events/:id', eventControllers.eventDetail);
app.post('/events/:id', eventControllers.rsvp);

// ip address middleware
app.use(function (req, res, next) {
  res.locals.ipAddr = req.ip;
  next();
});

// path middleware
app.use(function (req, res, next) {
  res.locals.fullUrl = req.originalUrl;
  next();
});

module.exports = app;
