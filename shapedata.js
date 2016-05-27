
var tankPts = [
  {x: 100, y: -50, z: 0}, {x: 100, y: 50, z: 0}, {x: -100, y: 50, z: 0}, {x: -100, y: -50, z: 0},
  {x: 115, y: -65, z: 20}, {x: 115, y: 65, z: 20}, {x: -115, y: 65, z: 20}, {x: -115, y: -65, z: 20},
  {x: 50, y: -30, z: 40}, {x: 50, y: 30, z: 40}, {x: -90, y: 30, z: 40}, {x: -90, y: -30, z: 40},
  {x: -60, y: -15, z: 75}, {x: -60, y: 15, z: 75}, {x: 90, y: -5, z: 55}, {x: 90, y: 5, z: 55},
  {x: 0, y: 5, z: 55}, {x: 0, y: -5, z: 55}, {x: 90, y: -5, z: 65}, {x: 90, y: 5, z: 65},
  {x: -25, y: 5, z: 65}, {x: -25, y: -5, z: 65}
];

var tankLines = [
  {start: 0, end: 1}, {start: 1, end: 2}, {start: 2, end: 3}, {start: 3, end: 0}, {start: 4, end: 5},
  {start: 5, end: 6}, {start: 6, end: 7}, {start: 7, end: 4}, {start: 0, end: 4}, {start: 1, end: 5},
  {start: 2, end: 6}, {start: 3, end: 7}, {start: 8, end: 9}, {start: 9, end: 10}, {start: 10, end: 11},
  {start: 11, end: 8}, {start: 8, end: 4}, {start: 9, end: 5}, {start: 10, end: 6}, {start: 11, end: 7},
  {start: 12, end: 13}, {start: 12, end: 8}, {start: 12, end: 11}, {start: 13, end: 9}, {start: 13, end: 10},
  {start: 14, end: 15}, {start: 15, end: 16}, {start: 16, end: 17}, {start: 17, end: 14}, {start: 18, end: 19},
  {start: 19, end: 20}, {start: 20, end: 21}, {start: 21, end: 18}, {start: 14, end: 18}, {start: 15, end: 19},
  {start: 16, end: 20}, {start: 17, end: 21}
];

var obstaclePts = [
  {x: 50, y: -50, z: 0}, {x: 50, y: 50, z: 0}, {x: -50, y: 50, z: 0}, {x: -50, y: -50, z: 0},
  {x: 50, y: -50, z: 55}, {x: 50, y: 50, z: 55}, {x: -50, y: 50, z: 55}, {x: -50, y: -50, z: 55},
  {x: 50, y: -50, z: 120}, {x: 50, y: 50, z: 120}, {x: -50, y: 50, z: 120}, {x: -50, y: -50, z: 120},
  {x: 0, y: 0, z: 120}
];

var cubeLines = [
  {start: 0, end: 1}, {start: 1, end: 2}, {start: 2, end: 3}, {start: 3, end: 0},
  {start: 8, end: 9}, {start: 9, end: 10}, {start: 10, end: 11}, {start: 11, end: 8},
  {start: 0, end: 8}, {start: 1, end: 9}, {start: 2, end: 10}, {start: 3, end: 11}
];

var halfcubeLines = [
  {start: 0, end: 1}, {start: 1, end: 2}, {start: 2, end: 3}, {start: 3, end: 0},
  {start: 4, end: 5}, {start: 5, end: 6}, {start: 6, end: 7}, {start: 7, end: 4},
  {start: 0, end: 4}, {start: 1, end: 5}, {start: 2, end: 6}, {start: 3, end: 7},
];

var pyramidLines = [
  {start: 0, end: 1}, {start: 1, end: 2}, {start: 2, end: 3}, {start: 3, end: 0},
  {start: 0, end: 12}, {start: 1, end: 12}, {start: 2, end: 12}, {start: 3, end: 12},
];

var bulletPts = [
  {x: -10, y: 5, z: 55}, {x: -10, y: 5, z: 65}, {x: -10, y: -5, z: 65},
  {x: -10, y: -5, z: 55}, {x: 10, y: 0, z: 60}
];

var bulletLines = [
  {start: 0, end: 1}, {start: 1, end: 2}, {start: 2, end: 3},
  {start: 3, end: 0}, {start: 4, end: 0}, {start: 4, end: 1},
  {start: 4, end: 2}, {start: 4, end: 3}
];
