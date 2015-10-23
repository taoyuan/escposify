'use strict';

var _ = require('lodash');

exports.hex = function (data, separator) {
  separator = separator || ' ';
  var str = '';
  _.forEach(data, function (b, index) {
    if (typeof b === 'string') {
      b = b.charCodeAt(0);
    }
    var hex = b.toString(16);
    str += (hex.length < 2 ? '0' + hex : hex);
    if (separator.length > 0 && index < data.length - 1) {
      str += separator;
    }
  });
  return str.toUpperCase();
};
