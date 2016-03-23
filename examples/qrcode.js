'use strict';

var iconv = require('iconv-lite');
var escpos = require('../');

var device = new escpos.Console();
//var device = new escpos.USB();
var printer = new escpos.Printer(device);

var code = '我思故我在';

printer
  .align('ct')
  .text(code)
  .qrcode(iconv.encode(code, 'GB2312'), 10, 'h')
  .text('-------------------------------------')
  .feed(6)
  .flush();

