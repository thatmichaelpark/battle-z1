const BZ1 = require('./bz1.js');

BZ1.world.create();
BZ1.world.createTank('Player0');
BZ1.world.createTank('Player1');
BZ1.world.createBullet(BZ1.tanks['Player1'].x, BZ1.tanks['Player1'].y, BZ1.tanks['Player1'].h, 'Player1');
BZ1.world.forEach((obj) => {
  obj.tick(1);
});

console.log('hi');
