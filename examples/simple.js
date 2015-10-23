var escpos = require('../');

var device = new escpos.USB(0x0483, 0x5720);
//var device = new escpos.Console();
var printer = new escpos.Printer(device);

printer
  .font('C')
  .align('ct')
  .style('bu')
  .size(1, 1)
  .text('The quick brown fox jumps over the lazy dog')
  .barcode('12345678', 'EAN8')
  .feed()
  //.cut()
  .flush();
