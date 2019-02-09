const R = require('ramda'),
  he = require('he'),
  stripHtml = require('./stripHtml');

module.exports = R.pipe(
  stripHtml,
  he.decode
);
