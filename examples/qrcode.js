var escpos = require('../');

var device = new escpos.USB(0x0483, 0x5720);
//var device = new escpos.Console();
var printer = new escpos.Printer(device);

var code = 'Hello World!';

//printer
//  .align('ct')
//  .qrcode(code, 10, 'h')
//  .text(code)
//  .feed(6)
//  .cut()
//  .flush();

printer
  //.font('C')
  //.align('ct')
  //.style('bu')
  //.size(1, 1)
  //.text('The quick brown fox jumps over the lazy dog')
  .qrcode('123456781234567812345678123456781234567812345671')
  .feed(6)
  //.cut()
  .flush();

setTimeout(function () {
  device.close();
}, 500);


