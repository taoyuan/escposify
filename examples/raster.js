'use strict';

var path = require('path');
var getPixels = require('get-pixels');
var escpos = require('../');

// var device = new escpos.Console();
var device = new escpos.USB();
var printer = new escpos.Printer(device);

// getPixels(path.join(__dirname, 'resources', 'tux.png'), function (err, pixels) {
//   if (err) throw err;
//
//   printer
//     // .align('ct')
//     .raster(escpos.image(pixels))
//     // .raster(escpos.image(pixels), 'dw')
//     // .raster(escpos.image(pixels), 'dh')
//     // .raster(escpos.image(pixels), 'dwdh')
//     .feed(6)
//     .flush();
// });
//

device.open(function () {
  escpos.image(path.join(__dirname, 'resources', 'tux.png'), function (err, image) {
    if (err) throw err;

    printer
      .align('ct')
      .raster(image)
      .raster(image, 'dw')
      .raster(image, 'dh')
      .raster(image, 'dwdh')
      //.feed(6)
      .flush();

  });

});
