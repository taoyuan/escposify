'use strict';

var path = require('path');
var escpos = require('../');

//var device = new escpos.Console();
var device = new escpos.USB();
var printer = new escpos.Printer(device);

device.open(function () {
  escpos.image(path.join(__dirname, 'resources', 'tux.png'), function (err, image) {
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


