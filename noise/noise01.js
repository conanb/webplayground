// Generated by CoffeeScript 1.9.1
var canvas, context, draw, generate, image, ms, offset, p3, pixels;

canvas = document.getElementsByTagName('canvas')[0];

context = canvas.getContext('2d');

image = context.createImageData(canvas.width, canvas.height);

pixels = image.data;

offset = 0;

ms = 0;

p3 = function(x, y, z, o, p) {
  var amplitude, frequency, i, j, n, ref, total;
  total = 0;
  n = o - 1;
  for (i = j = 0, ref = n; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
    frequency = Math.pow(2.0, i);
    amplitude = Math.pow(p, i);
    total = total + perlin3(x * frequency, y * frequency, z * frequency) * amplitude;
  }
  return total;
};

generate = function() {
  var h, index, j, k, n, ref, ref1, start, w, x, y;
  start = Date.now();
  offset += 0.15;
  w = canvas.width - 1;
  h = canvas.height - 1;
  for (x = j = 0, ref = w; 0 <= ref ? j <= ref : j >= ref; x = 0 <= ref ? ++j : --j) {
    for (y = k = 0, ref1 = h; 0 <= ref1 ? k <= ref1 : k >= ref1; y = 0 <= ref1 ? ++k : --k) {
      n = .5 * (perlin3(x / 16, y / 256, offset)) + .5;
      n = 255 * n;
      index = (x + y * canvas.width) * 4;
      pixels[index + 0] = n;
      pixels[index + 1] = pixels[index + 2] = 0;
      pixels[index + 3] = 255;
    }
  }
  return ms = Date.now() - start;
};

draw = function() {
  generate();
  context.putImageData(image, 0, 0);
  context.font = '18px consolas';
  context.fillStyle = 'white';
  context.fillText(ms + "ms", 20, 20);
  return requestAnimationFrame(draw);
};

requestAnimationFrame(draw);