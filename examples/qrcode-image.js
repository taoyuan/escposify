'use strict';

var escpos = require('../');

//var device = new escpos.Console();
var device = new escpos.USB();
var printer = new escpos.Printer(device);

var text = '枯藤老树昏鸦，小桥流水人家，古道西风瘦马。';

escpos.qrimage(text, function (err, image) {
  if (err) throw err;

  printer
    .align('ct')
    .bitimage(image)
    .feed(6)
    .flush();

});

