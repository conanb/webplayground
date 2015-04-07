// Generated by CoffeeScript 1.9.1
var canvas, context, draw, findClosest, generate, image, points, smooth;

canvas = document.getElementsByTagName('canvas')[0];

context = canvas.getContext('2d');

points = [];

image = context.createImageData(canvas.width, canvas.height);

findClosest = function(x, y) {
  var closest, closestDist, dist, i, len, point;
  closest = {
    r: 0,
    g: 0,
    b: 0
  };
  closestDist = canvas.width * canvas.height;
  for (i = 0, len = points.length; i < len; i++) {
    point = points[i];
    dist = (x - point.x) * (x - point.x) + (y - point.y) * (y - point.y);
    if (dist < closestDist) {
      closestDist = dist;
      closest = point;
    }
  }
  return closest;
};

generate = function() {
  var i, n, point, results;
  points = [];
  results = [];
  for (n = i = 0; i <= 512; n = ++i) {
    point = {
      index: n,
      count: 0,
      avg: {
        x: 0,
        y: 0
      },
      x: canvas.width * Math.random(),
      y: canvas.height * Math.random(),
      r: 255 * Math.random() | 0,
      g: 255 * Math.random() | 0,
      b: 255 * Math.random() | 0
    };
    results.push(points.push(point));
  }
  return results;
};

smooth = function() {
  var closest, closestDist, dist, i, j, k, l, len, len1, len2, p, point, randomPoints, results;
  for (i = 0, len = points.length; i < len; i++) {
    point = points[i];
    point.count = 0;
    point.avg = {
      x: 0,
      y: 0
    };
  }
  randomPoints = [];
  for (j = 0; j <= 4096; j++) {
    p = {
      x: canvas.width * Math.random(),
      y: canvas.height * Math.random()
    };
    closest = 0;
    closestDist = canvas.width * canvas.height;
    for (k = 0, len1 = points.length; k < len1; k++) {
      point = points[k];
      dist = (p.x - point.x) * (p.x - point.x) + (p.y - point.y) * (p.y - point.y);
      if (dist < closestDist) {
        closestDist = dist;
        closest = point.index;
      }
    }
    points[closest].count += 1;
    points[closest].avg.x += p.x;
    points[closest].avg.y += p.y;
  }
  results = [];
  for (l = 0, len2 = points.length; l < len2; l++) {
    point = points[l];
    point.x = point.avg.x / point.count;
    results.push(point.y = point.avg.y / point.count);
  }
  return results;
};

draw = function() {
  var h, i, index, j, ms, point, ref, ref1, start, w, x, y;
  start = Date.now();
  smooth();
  w = canvas.width - 1;
  h = canvas.height - 1;
  for (x = i = 0, ref = w; 0 <= ref ? i <= ref : i >= ref; x = 0 <= ref ? ++i : --i) {
    for (y = j = 0, ref1 = h; 0 <= ref1 ? j <= ref1 : j >= ref1; y = 0 <= ref1 ? ++j : --j) {
      point = findClosest(x, y);
      index = (x + y * canvas.width) * 4;
      image.data[index + 0] = point.r;
      image.data[index + 1] = point.g;
      image.data[index + 2] = point.b;
      image.data[index + 3] = 255;
    }
  }
  ms = Date.now() - start;
  context.putImageData(image, 0, 0);
  context.font = '18px consolas';
  context.fillStyle = 'white';
  context.fillText(ms + "ms", 20, 20);
  context.fillText("R to regenerate", 20, 40);
  return requestAnimationFrame(draw);
};

document.onkeyup = function(e) {
  if (e.keyCode === 'R'.charCodeAt(0)) {
    generate();
  }
  if (e.keyCode === 'S'.charCodeAt(0)) {
    return smooth();
  }
};

generate();

requestAnimationFrame(draw);
