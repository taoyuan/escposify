var iconv = require('iconv-lite');
var MutableBuffer = require('mutable-buffer').MutableBuffer;
var commands = require('./commands');

function Printer(connector) {
  this.connector = connector;
  this.connector.open();

  this.buffer = new MutableBuffer();
}

Printer.prototype.flush = function (cb) {
  this.connector.write(this.buffer.flush(), cb);
};

/**
 *
 * @param content
 * @param encode
 */
Printer.prototype.print = function (content, encode) {
  this.buffer.write(iconv.encode(content, encode || 'gbk'));
  return this;
};

/**
 *
 * @param content
 * @param cb
 */
Printer.prototype.println = function (content, cb) {
  this.print([content, commands.EOL].join(''));
  return this;
};

/**
 *
 * @param content
 * @param cb
 */
Printer.prototype.text = function (content, cb) {
  this.println(content);
  return this;
};

Printer.prototype.feed = function (n) {
  this.buffer.write(new Array(n || 1).join(commands.EOL));
  return this;
};

/**
 *
 * @param ctrl
 * @param cb
 */
Printer.prototype.control = function (ctrl, cb) {
  this.buffer.write(commands.FEED_CONTROL_SEQUENCES[
  'CTL_' + ctrl.toUpperCase()
    ]);
  return this;
};

/**
 *
 * @param align
 */
Printer.prototype.align = function (align) {
  this.buffer.write(commands.TEXT_FORMAT[
  'TXT_ALIGN_' + align.toUpperCase()
    ]);
  return this;
};

/**
 *
 * @param family
 */
Printer.prototype.font = function (family) {
  this.buffer.write(commands.TEXT_FORMAT[
  'TXT_FONT_' + family.toUpperCase()
    ]);
  return this;
};

/**
 *
 * @param type
 */
Printer.prototype.style = function (type) {
  switch (type.toUpperCase()) {
    case 'B':
      this.buffer.write(commands.TEXT_FORMAT.TXT_UNDERL_OFF);
      this.buffer.write(commands.TEXT_FORMAT.TXT_BOLD_ON);
      break;
    case 'U':
      this.buffer.write(commands.TEXT_FORMAT.TXT_BOLD_OFF);
      this.buffer.write(commands.TEXT_FORMAT.TXT_UNDERL_ON);
      break;
    case 'U2':
      this.buffer.write(commands.TEXT_FORMAT.TXT_BOLD_OFF);
      this.buffer.write(commands.TEXT_FORMAT.TXT_UNDERL2_ON);
      break;
    case 'BU':
      this.buffer.write(commands.TEXT_FORMAT.TXT_BOLD_ON);
      this.buffer.write(commands.TEXT_FORMAT.TXT_UNDERL_ON);
      break;
    case 'BU2':
      this.buffer.write(commands.TEXT_FORMAT.TXT_BOLD_ON);
      this.buffer.write(commands.TEXT_FORMAT.TXT_UNDERL2_ON);
      break;
    case 'NORMAL':
    default:
      this.buffer.write(commands.TEXT_FORMAT.TXT_BOLD_OFF);
      this.buffer.write(commands.TEXT_FORMAT.TXT_UNDERL_OFF);
      break;
  }
  return this;
};

/**
 *
 * @param width
 * @param height
 */
Printer.prototype.size = function (width, height) {
  // DEFAULT SIZE: NORMAL
  this.buffer.write(commands.TEXT_FORMAT.TXT_NORMAL);
  if (width == 2) {
    this.buffer.write(commands.TEXT_FORMAT.TXT_2WIDTH);
  }
  if (height == 2) {
    this.buffer.write(commands.TEXT_FORMAT.TXT_2HEIGHT);
  }
  return this;
};

/**
 *
 * @param hw
 */
Printer.prototype.hardware = function (hw) {
  this.buffer.write(commands.HARDWARE['HW_' + hw]);
  return this;
};

/**
 *
 * @param code
 * @param type
 * @param width
 * @param height
 * @param position
 * @param font
 */
Printer.prototype.barcode = function (code, type, width, height, position, font) {
  if (width >= 1 || width <= 255) {
    this.buffer.write(commands.BARCODE_FORMAT.BARCODE_WIDTH);
  }
  if (height >= 2 || height <= 6) {
    this.buffer.write(commands.BARCODE_FORMAT.BARCODE_HEIGHT);
  }
  this.buffer.write(commands.BARCODE_FORMAT[
  'BARCODE_FONT_' + (font || 'A').toUpperCase()
    ]);
  this.buffer.write(commands.BARCODE_FORMAT[
  'BARCODE_TXT_' + (position || 'BLW').toUpperCase()
    ]);
  this.buffer.write(commands.BARCODE_FORMAT[
  'BARCODE_' + ((type || 'EAN13').replace('-', '_').toUpperCase())
    ]);
  this.buffer.write(code);
  return this;
};

Printer.prototype.qrcode = function (code, version, level, size) {
  this.buffer.write(commands.CODE2D_FORMAT.TYPE_QR);
  this.buffer.write(commands.CODE2D_FORMAT.CODE2D);
  this.buffer.writeUInt8(version || 3);
  this.buffer.write(commands.CODE2D_FORMAT[
  'QR_LEVEL_' + (level || 'L').toUpperCase()
    ]);
  this.buffer.writeUInt8(size || 6);
  this.buffer.writeUInt16LE(code.length);
  this.buffer.write(code);
  return this;
};

/**
 *
 * @param pin
 */
Printer.prototype.cashdraw = function (pin) {
  this.buffer.write(commands.CASH_DRAWER[
  'CD_KICK_' + (pin || 2)
    ]);
  return this;
};

/**
 *
 * @param part
 */
Printer.prototype.cut = function (part) {
  // this.println(new Array(30).join('.'));
  this.print(new Array(3).join(commands.EOL));
  this.buffer.write(commands.PAPER[
    part ? 'PAPER_PART_CUT' : 'PAPER_FULL_CUT'
    ]);
  return this;
};

module.exports = Printer;
