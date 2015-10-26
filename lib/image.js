var _ = require('lodash');
var getPixels = require('get-pixels');

exports = module.exports = function (url, type, cb) {
  if (_.isObject(url) && url.shape && url.data) {
    return new Image(url);
  }

  if (typeof type === 'function') {
    cb = type;
    type = null;
  }
  cb = cb || function (err) {
      if (err) throw err;
    };
  getPixels(url, type, function (err, pixels) {
    if (err) return cb(err);
    cb(null, new Image(pixels));
  });
};

exports.Image = Image;

function Image(pixels) {
  if (!(this instanceof Image)) {
    return new Image(pixels);
  }
  this.pixels = pixels;
}

Image.prototype.toBitImage = function (density) {
  return toBitmap(normalize(decode(this.pixels)), density);
};

Image.prototype.toRaster = function () {
  return toRaster(normalize(decode(this.pixels)));
};

function rgb(pixel) {
  return {
    r: pixel[0],
    g: pixel[1],
    b: pixel[2],
    a: pixel[3]
  };
}

function size(img) {
  return {
    width: img.shape[0],
    height: img.shape[1],
    colors: img.shape[2]
  };
}

function decode(pixels) {
  var info = size(pixels);
  var result = _.chunk(pixels.data, info.colors).map(function (pixel) {
    return rgb(pixel)
  });
  return _.assign({data: result}, info);
}

function normalize(pixels) {
  pixels.data = _.map(pixels.data, function (pixel) {
    if (pixel.a === 0) return 0;
    return pixel.r !== 0xFF || pixel.g !== 0xFF || pixel.b !== 0xFF ? 1 : 0;
  });
  return pixels;
}

function toBitmap(pixels, density) {
  density = density || 24;

  var ld, result = [];
  var x, y, b, l, i;
  var data = pixels.data;
  var width = pixels.width;
  var height = pixels.height;
  var c = density / 8;

  // n blocks of lines
  var n = Math.ceil(height / density);

  for (y = 0; y < n; y++) {
    // line data
    ld = result[y] = [];

    for (x = 0; x < width; x++) {

      for (b = 0; b < density; b++) {
        i = x * c + (b >> 3);

        if (ld[i] === undefined) {
          ld[i] = 0;
        }

        l = y * density + b;
        if (l < height) {
          if (data[l * width + x]) {
            ld[i] += (0x80 >> (b & 0x7));
          }
        }
      }
    }
  }

  return {
    data: result,
    density: density
  };
}

function toRaster(pixels) {
  var result = [];
  var x, y, b, c, i;
  var data = pixels.data;
  var width = pixels.width;
  var height = pixels.height;

  // n blocks of lines
  var n = Math.ceil(width / 8);

  for (y = 0; y < height; y++) {

    for (x = 0; x < n; x++) {

      for (b = 0; b < 8; b++) {
        i = x * 8 + b;

        if (result[y * n + x] === undefined) {
          result[y * n + x] = 0;
        }

        c = x * 8 + b;
        if (c < width) {
          if (data[y * width + i]) {
            result[y * n + x] += (0x80 >> (b & 0x7));
          }
        }
      }
    }
  }
  return {
    data: result,
    width: n,
    height: height
  };
}
