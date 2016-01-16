'use strict';

var path = require('path');
var escpos = require('../');

//var device = new escpos.USB(0x0483, 0x5720);
var device = new escpos.USB(0x067b, 0x2305); // 绿联 USB to Parallel Port
//var device = new escpos.Console();
var printer = new escpos.Printer(device);

device.open(function () {
  escpos.image(path.resolve(__dirname, 'resources/tux.png'), function (err, image) {
    if (err) throw err;

    printer
      .align('ct')
      .bitimage(image, 's8')
      .bitimage(image, 'd8')
      .bitimage(image, 's24')
      .bitimage(image, 'd24')
      //.feed(6)
      .flush();

  });

});


