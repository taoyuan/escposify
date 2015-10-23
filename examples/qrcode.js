var escpos = require('../');

var device = new escpos.USB(0x0483, 0x5720);
//var device = new escpos.Console();
var printer = new escpos.Printer(device);

var code = 'Hello World!';

printer
  .align('ct')
  .qrcode(code, 10, 'h')
  .text(code)
  .feed(6)
  .flush();

