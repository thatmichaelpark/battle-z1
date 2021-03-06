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
  this.state = 'normal';                  // 'normal', 'hit', 'dead'
};

BZ1.Obj.prototype.tick = function (dt) {
  // Do nada.
};

// Obstacle -------------------------------------------------------------------
const hitTime = 0.5;

BZ1.Obstacle = function (x, y, type) {
// Allowed values for type: 'cube', 'halfcube', or 'pyramid'
  const hitRadius = {
    cube: 50,
    halfcube: 0,
    pyramid: 25
  }[type];
  BZ1.Obj.call(this, x, y, 0, type, null, hitRadius, 150);
  this.timer = 0; // 0 => normal; > 0 => hit, time left until normal again.
};

BZ1.Obstacle.prototype = Object.create(BZ1.Obj.prototype);
BZ1.Obstacle.prototype.constructor = BZ1.Obstacle;
BZ1.Obstacle.prototype.tick = function (dt) {
  if (this.timer) {
    this.timer -= dt;
    if (this.timer <= 0) {
      this.timer = 0;
      this.state = 'normal';
    }
  }
};
BZ1.Obstacle.prototype.hit = function (obj) {
    this.state = 'hit';
    this.timer = hitTime;
};

// Tank -----------------------------------------------------------------------

const initialHealth = 3;
const v_s = 300;   // tank speed in units/s
const bv_s = 250;  // bullet speed units/s for bullet sub-step (10 sub-steps per tank step)
const h_s = 20;    // turn speed in degrees/s
const reloadTime = 2;
const reviveTime = 10;
const bulletTime = 3;

BZ1.Tank = function (x, y, h, id) {
  BZ1.Obj.call(this, x, y, h, 'tank', id, 35, 200);
  this.move = {leftTrack: 0, rightTrack: 0, fire: true};
  this.score = 0;
  this.health = initialHealth;
  this.deathTimer = 0;  // 0 => alive; > 0 => time left until alive again.
  this.reloadTimer = 0; // 0 => ready to fire; > 0 => time left until ready to fire again.
  this.hitTimer = 0; // 0 => normal; > 0 => hit, time left until normal again.
};

BZ1.Tank.prototype = Object.create(BZ1.Obj.prototype);
BZ1.Tank.prototype.constructor = BZ1.Tank;
BZ1.Tank.prototype.tick = function (dt) {

  if (this.state === 'normal') {
    const v = v_s * dt * (this.move.rightTrack + this.move.leftTrack) / 2;
    const h = h_s * dt * (this.move.rightTrack - this.move.leftTrack);

    this.h += h;

    const rad = this.h / 180 * Math.PI;
    const dx = v * Math.cos(rad);
    const dy = v * Math.sin(rad);
    const x = this.x; // Save x and y in case we have to cancel the
    const y = this.y; //  move because of a collision.

    this.x += dx;
    this.y += dy;

    if (BZ1.world.isColliding(this)) {
      this.x = x;
      this.y = y;
    }
    if (this.reloadTimer === 0) {
      if (this.move.fire) {
        BZ1.world.createBullet(this, bv_s * Math.cos(rad), bv_s * Math.sin(rad));
        this.reloadTimer = reloadTime;
      }
    } else {
      this.reloadTimer = Math.max(this.reloadTimer - dt, 0);
    }
  } else if (this.state === 'hit') {
    this.hitTimer -= dt;
    if (this.hitTimer <= 0) {
      this.hitTimer = 0;
      this.state = 'normal';
    }
  }
};

BZ1.Tank.prototype.hit = function (obj) {
    this.state = 'hit';
    this.hitTimer = hitTime;
};


// Bullet ---------------------------------------------------------------------


BZ1.Bullet = function (x, y, h, id, vx_s, vy_s) {
  BZ1.Obj.call(this, x, y, h, 'bullet', id, 0, 0);
  this.vx_s = vx_s;
  this.vy_s = vy_s;
  this.timer = bulletTime;
};

BZ1.Bullet.prototype = Object.create(BZ1.Obj.prototype);
BZ1.Bullet.prototype.constructor = BZ1.Bullet;
BZ1.Bullet.prototype.tick = function (dt) {
  const dx = this.vx_s * dt;
  const dy = this.vy_s * dt;

  for (i = 0; i < 10; ++i) {
    this.x += dx;
    this.y += dy;
    const collision = BZ1.world.hitTest(this);
    if (collision && collision.id !== this.id) {
      collision.hit(this);
      BZ1.world.delete(this);
      return;
    }
  }
  this.timer -= dt;
  if (this.timer <= 0) {
     BZ1.world.delete(this);
  }
};

// World ----------------------------------------------------------------------

const nObstacles = 20;
const worldSpan = 7000;  // Objects are created inside square centered on origin with sides of length worldSpan.
const minDistance = 1000; // Objects are created at least minDistance away from other objects.

BZ1.world = [];

BZ1.tanks = {};

BZ1.objectsToDelete = [];

BZ1.world.create = function () {
  for (var i=0; i<nObstacles; ++i) {
    var pt = this.findLonelyPoint();
    var obj = new BZ1.Obstacle(pt.x, pt.y, ['cube', 'halfcube', 'pyramid'][Math.floor(Math.random() * 3)]);
    this.push(obj);
  }
};

BZ1.world.delete = function (obj) {
// Objects are deleted during the world update.
  BZ1.objectsToDelete.push(obj);
};

function distance(x0, y0, x1, y1) {
  return Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
}

BZ1.world.findLonelyPoint = function () {
// Returns a point {x:x, y:y} that is at least minDistance from everything
// else in the world.
  function tooClose(x, y) {
    for (let i = 0; i < this.length; ++i) {
      const obj = this[i];
      if (obj.state === 'dead') {
        continue;
      }
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
  } while (tooClose.call(this, x, y));
  return {x: x, y: y};
};

BZ1.world.createTank = function (playerId) {
  const pt = this.findLonelyPoint();
  const tank = new BZ1.Tank(pt.x, pt.y, Math.random() * 360, playerId);
  this.push(tank);
  BZ1.tanks[playerId] = tank;
};

BZ1.world.createBullet = function (tank, vx_s, vy_s) {
  const bullet = new BZ1.Bullet(tank.x, tank.y, tank.h, tank.id, vx_s, vy_s);
  this.push(bullet);
};

BZ1.world.update = function (dt) {
  for (let i = 0; i < this.length; ++i) { // Use this form of loop because it handles new objects being added to the end of the array (i.e. when a bullet is created).
    const obj = this[i];
    obj.tick(dt);
  }
  for (const obj of BZ1.objectsToDelete) {
    BZ1.world.splice(BZ1.world.indexOf(obj), 1);
  }
  BZ1.objectsToDelete = [];
};

BZ1.world.isColliding = function (tank) {
// Check for collisions between tank and the rest of the world objects.
// Disregard collisions between tank and itself.
// Return true on collision, false otherwise.
  for (let i=0; i<this.length; ++i) {
    const obj = this[i];
    if (obj === tank || obj.state === 'dead') {
      continue;
    }
    if (distance(obj.x, obj.y, tank.x, tank.y) < obj.collisionRadius) {
      return true;
    }
  }
  return false;
};

BZ1.world.hitTest = function (bullet) {
// Check for hits between bullet and the rest of the world objects.
// Disregard hits between bullet and itself.
// Return hit object if there is one, null otherwise.
  for (let i=0; i<this.length; ++i) {
    const obj = this[i];
    if (obj === bullet || obj.state === 'dead') {
      continue;
    }
    if (Math.abs(obj.x - bullet.x) < obj.hitRadius &&
        Math.abs(obj.y - bullet.y) < obj.hitRadius) {
      return obj;
    }
  }
  return null;
};

module.exports = BZ1;
