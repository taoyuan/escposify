var usb = require('usb');

/**
 *
 * @param vid
 * @param pid
 * @returns {USB}
 * @constructor
 */
function USB(vid, pid) {
  if (!(this instanceof USB)) return new USB(vid, pid);
  this.device = usb.findByIds(vid, pid);
  return this;
}

/**
 * open device
 * @returns {USB}
 */
USB.prototype.open = function () {
  // TODO search a printer without vid and pid
  var self = this;
  this.device.open();
  this.device.interfaces.forEach(function (intf) {
    if (intf.isKernelDriverActive()) {
      try {
        intf.detachKernelDriver();
      } catch (e) {
        console.error("[ERROR] Could not detatch kernel driver: %s", e)
      }
    }
    intf.claim();
    intf.endpoints.filter(function (endpoint) {
      if (endpoint.direction == 'out') {
        self.endpoint = endpoint;
      }
    });
  });
  return this;
};

USB.prototype.close = function () {
  if (this.device.interfaces) this.device.close();
};

/**
 * Write data to the out endpoint
 *
 * @param data
 * @param cb
 */
USB.prototype.write = function (data, cb) {
  this.endpoint.transfer(data, cb);
};

module.exports = USB;
