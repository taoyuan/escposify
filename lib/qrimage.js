'use strict';

var _ = require('lodash');
var qr = require('qr-image');
var getPixels = require('get-pixels');
var Image = require('./image');

module.exports = function (text, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = null;
  }
  options = _.assign({type: 'png', size: 5}, options);
  var buffer = qr.imageSync(text, options);
  getPixels(buffer, 'image/' + options.type, function (err, pixels) {
    if (err) return cb(err);
    cb(null, new Image(pixels));
  });
};
