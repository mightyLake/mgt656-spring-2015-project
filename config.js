'use strict';
var path = require('path');
var logger = require('morgan');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var strftime = require('strftime');
var express = require('express');

/*
 * Function that configures an application
 *
 */
module.exports = exports = function(yourApp){
  // Configure our templating engine: nunjucks
  nunjucks.configure('views', {
      autoescape: true,
      express: yourApp
  }).addFilter('prettyDate', function(dateObject) {
      return strftime('%A, %b. %e at %l:%M%P', dateObject);
  });

  // Use 'development' level of logging, ie. verbose
  if (process.env.NODE_ENV !== 'testing') {
    yourApp.use(logger('dev'));
  }

  // Configure heap analytics
  yourApp.locals.heap = {
    id: '3104698097' // development id
  };

  if (process.env.NODE_ENV === 'production') {
    // production id
    yourApp.locals.heap.id = process.env.HEAP_ID;
  }


  // Serve images, css, and client-side js about of the
  // directory named 'public'
  yourApp.use(express.static(path.join(__dirname, 'public')));

  // Parse the body of incoming requests by default.
  // This means we can access the parameters of submitted
  // forms and such.
  yourApp.use(bodyParser.urlencoded({extended: true}));
};



