var usb = require('usbio');

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
 * [open description]
 * @return {USB} [description]
 */
USB.prototype.open = function () {
  var self = this;
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
 *
 * @param data
 * @param cb
 */
USB.prototype.write = function (data, cb) {
  console.log(data.length, data);
  this.endpoint.transfer(data, function () {
  });
};

module.exports = USB;