var async = require('async');
var usb = require('usb');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

/**
 *
 * @param vid
 * @param pid
 * @returns {USB}
 * @constructor
 */
function USB(vid, pid) {
  if (!(this instanceof USB)) return new USB(vid, pid);
  EventEmitter.call(this);
  this.device = usb.findByIds(vid, pid);
  if (!this.device) throw new Error('Unknown device (vid: ' + vid + ', pid:' + pid + ')');
  return this;
}

util.inherits(USB, EventEmitter);

/**
 * open device
 * @returns {USB}
 */
USB.prototype.open = function (cb) {
  // TODO search a printer without vid and pid
  var that = this;
  if (this._opened) {
    cb && cb();
    return this;
  }
  this._opened = true;
  this.device.open();
  this.device.interfaces.forEach(function (intf) {
    intf.claim();
    if (intf.isKernelDriverActive()) {
      try {
        intf.detachKernelDriver();
      } catch (e) {
        console.error("[ERROR] Could not detatch kernel driver: %s", e)
      }
    }
    intf.setAltSetting(intf.altSetting, function () {
      intf.endpoints.filter(function (endpoint) {
        if (endpoint.direction == 'out') {
          that.endpoint = endpoint;
          console.log('Found endpoint for write');
        }
      });
      that._ready = true;
      that.emit('ready');
      cb && cb();
    })

  });
  return this;
};

USB.prototype.close = function (cb) {
  var that = this;
  this._opened = false;
  this._ready = false;
  if (this.device.interfaces) {
    async.eachSeries(this.device.interfaces, function (intf, cb) {
      intf.release(true, cb);
    }, function () {
      that.device.close(cb);
    });
  } else {
    cb && cb();
  }
};

USB.prototype.ready = function (cb) {
  cb = cb || function () {
    };
  if (this._ready) return cb();
  this.once('ready', cb);
};

/**
 * Write data to the out endpoint
 *
 * @param data
 * @param cb
 */
USB.prototype.write = function (data, cb) {
  var that = this;
  this.ready(function () {
    console.log("write data", data);
    that.endpoint.transfer(data, cb);
  });
};

module.exports = USB;
