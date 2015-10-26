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
    .raster(escpos.image(pixels))
    .raster(escpos.image(pixels), 'dw')
    .raster(escpos.image(pixels), 'dh')
    .raster(escpos.image(pixels), 'dwdh')
    .feed(6)
    .flush();
});


