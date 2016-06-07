require('module');

var BZ1 = BZ1 || {};  // BZ1 namespace

// Define the Bz1.Object constructor
BZ1.Obj = function (x, y, h, type, id, hitRadius, collisionRadius) {
  this.x = x;                             // X coordinate of object (+ve is east).
  this.y = y;                             // Y coordinate of object (+ve is north).
  this.h = h;                             // Heading in degrees (0 is east).
  this.type = type;                       // 'tank', 'bullet', 'cube', 'halfcube', 'pyramid'.
  this.id = id;                           // For tanks and bullets, the id of the owning player.
  this.hitRadius = hitRadius;             // If a bullet gets this close it's considered a hit.
  this.collisionRadius = collisionRadius; // A tank that gets this close will be blocked (unable to move forward)
  this.state = 'normal';                  //
  this.timer = 0;
};

BZ1.Obj.prototype.tick = function (dt) {
  // Do nada.
};

// Obstacle -------------------------------------------------------------------

BZ1.Obstacle = function (x, y, type) {
// Allowed values for type: 'cube', 'halfcube', or 'pyramid'
  const hitRadius = {
    cube: 50,
    halfcube: 0,
    pyramid: 25
  }[type];
  BZ1.Obj.call(this, x, y, 0, type, null, hitRadius, 150);
};

BZ1.Obstacle.prototype = Object.create(BZ1.Obj.prototype);
BZ1.Obstacle.prototype.constructor = BZ1.Obstacle;

// Tank -----------------------------------------------------------------------

BZ1.Tank = function (x, y, h, id) {
  BZ1.Obj.call(this, x, y, h, 'tank', id, 35, 200);
  this.move = {left: false, right: true, fwd: false, rev: false, fire: true};
};

BZ1.Tank.prototype = Object.create(BZ1.Obj.prototype);
BZ1.Tank.prototype.constructor = BZ1.Tank;
BZ1.Tank.prototype.tick = function (dt) {
  const v_s = 300;   // units/s
  const bv_s = 300;  // units/s for bullet sub-step (10 sub-steps per tank step)
  const h_s = 30;    // degrees/s

  const v = v_s * dt;
  const bv = bv_s * dt;
  const h = h_s * dt;

  if (this.move.left) {
    this.h += h;
  }
  if (this.move.right) {
    this.h -= h;
  }
  const rad = this.h / 180 * Math.PI;
  const dx = v * Math.cos(rad);
  const dy = v * Math.sin(rad);
  if (this.move.fwd) {
    this.x += dx;
    this.y += dy;
  }
  if (this.move.rev) {
    this.x -= dx;
    this.y -= dy;
  }
};

// Bullet ---------------------------------------------------------------------

BZ1.Bullet = function (x, y, h, id) {
  BZ1.Obj.call(this, x, y, h, 'bullet', id, 0, 0);
};

BZ1.Bullet.prototype = Object.create(BZ1.Obj.prototype);
BZ1.Bullet.prototype.constructor = BZ1.Bullet;

// World ----------------------------------------------------------------------

const nObstacles = 15;
const worldSpan = 6000;  // Objects are created inside square centered on origin with sides of length worldSpan.
const minDistance = 1000; // Objects are created at least minDistance away from other objects.

BZ1.world = [];

BZ1.tanks = {};

BZ1.world.create = function () {
  for (var i=0; i<nObstacles; ++i) {
    var pt = this.findLonelyPoint();
    var obj = new BZ1.Obstacle(pt.x, pt.y, ['cube', 'halfcube', 'pyramid'][Math.floor(Math.random() * 3)]);
    this.push(obj);
  }
};

BZ1.world.findLonelyPoint = function () {
// Returns a point {x:x, y:y} that is at least minDistance from everything
// else in the world.
  function tooClose(x, y) {
    function distance(x0, y0, x1, y1) {
      return Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
    }
    for (let i = 0; i < this.length; ++i) {
      const obj = this[i];
      if (distance(x, y, obj.x, obj.y) < minDistance) {
        return true;
      }
    }
    return false;
  }
  let x;
  let y;
  do {
    x = worldSpan * (Math.random() - 0.5);
    y = worldSpan * (Math.random() - 0.5);
  } while (tooClose(x, y));
  return {x: x, y: y};
};

BZ1.world.createTank = function (playerId) {
  const pt = this.findLonelyPoint();
  const tank = new BZ1.Tank(pt.x, pt.y, Math.random() * 360, playerId);
  this.push(tank);
  BZ1.tanks[playerId] = tank;
};

BZ1.world.createBullet = function (x, y, h, playerId) {
  const bullet = new BZ1.Bullet(x, y, h, playerId);
  this.push(bullet);
};

BZ1.world.update = function (dt) {
  this.forEach(function (obj) {
    obj.tick(dt);
  })
};

module.exports = BZ1;
