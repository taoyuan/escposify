'use strict';

var hexy = require('hexy');

module.exports = Console;

function Console() {

}

Console.prototype.open = function () {

};

Console.prototype.close = function () {

};


Console.prototype.write = function (data, cb) {
  console.log(hexy.hexy(data, {format: 'twos'}));
  cb && cb();
};
