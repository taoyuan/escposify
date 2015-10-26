'use strict';

var getPixels = require('get-pixels');
var escpos = require('../');

var device = new escpos.USB(0x0483, 0x5720);
//var device = new escpos.Console();
var printer = new escpos.Printer(device);

getPixels('./resources/tux.png', function (err, pixels) {
  if (err) throw err;

  printer
    .align('ct')
    .bitimage(escpos.image(pixels), 's8')
    .bitimage(escpos.image(pixels), 'd8')
    .bitimage(escpos.image(pixels), 's24')
    .bitimage(escpos.image(pixels), 'd24')
    .feed(6)
    .flush();

});


