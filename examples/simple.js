'use strict';

var escpos = require('../');

//var device = new escpos.USB(0x0483, 0x5720);
var device = new escpos.USB(0x067b, 0x2305); // 绿联 USB to Parallel Port
//var device = new escpos.Console();

var printer = new escpos.Printer(device);

device.open(function () {
  printer
  //.font('C')
  //.align('ct')
  //.style('bu')
  //.size()
  //  .text('The quick brown fox jumps over the lazy dog')
    .text('敏捷的棕色狐狸跳过懒狗')
    //.barcode('12345678', 'EAN8')
    //.feed()
    //.cut()
    .flush();

  setTimeout(function () {
    device.close();
  }, 1000);
});

