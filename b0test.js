/*
World coordinates
- X-axis runs east-west (east is positive)
- Y-axis runs north-south (north is positive)
- Z-axis runs up-down (up is positive)
(Right hand rule)

Angles are in degrees.
Heading 0 is east; heading increases counter-clockwise (i.e. 90 is north)

Screen coordinates
- (0,0) is center of screen
- X-axis: right is positive
- Y-axis: down is positive



*/

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

resize();
window.addEventListener('resize', resize);

function resize() {
  canvas.width = document.querySelector('#drawdiv').clientWidth;
  canvas.height = document.querySelector('#drawdiv').clientHeight;
  redraw();
}

function rotate(x, y, degrees) {
  var a = degrees / 180 * Math.PI;
  var sin = Math.sin(a);
  var cos = Math.cos(a);
  var rx = cos * x - sin * y;
  var ry = sin * x + cos * y;
  return {x: rx, y: ry};
}

function redraw() {

  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(canvas.width/2, canvas.height/2);

  var dy = 500;
  var dx = 0;
  var txs = [];
  var tys = [];
  for (var p of tankPts) {
    var rot = rotate(p.x, p.y, -45);
    var x = rot.x;
    var y = rot.y;
    var z = p.z - 60;
    var w = 1000 / (dy + y);
    txs.push(x * w);
    tys.push(z * -w);
  }
  ctx.strokeStyle = 'green';
  for (var l of tankLines) {
    ctx.moveTo(txs[l.start], tys[l.start]);
    ctx.lineTo(txs[l.end], tys[l.end]);
  }
  ctx.stroke();
  ctx.restore();
}
