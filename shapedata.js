var shapes = {
  tank: {
    pts: [
      {x: 100, y: -50, z: 0}, {x: 100, y: 50, z: 0}, {x: -100, y: 50, z: 0}, {x: -100, y: -50, z: 0},
      {x: 115, y: -65, z: 20}, {x: 115, y: 65, z: 20}, {x: -115, y: 65, z: 20}, {x: -115, y: -65, z: 20},
      {x: 50, y: -30, z: 40}, {x: 50, y: 30, z: 40}, {x: -90, y: 30, z: 40}, {x: -90, y: -30, z: 40},
      {x: -60, y: -15, z: 75}, {x: -60, y: 15, z: 75},
      {x: 90, y: -5, z: 55}, {x: 90, y: 5, z: 55}, {x: 0, y: 5, z: 55}, {x: 0, y: -5, z: 55},
      {x: 90, y: -5, z: 65}, {x: 90, y: 5, z: 65}, {x: -27, y: 5, z: 65}, {x: -27, y: -5, z: 65}
    ],
    lines: [
      {start: 0, end: 1}, {start: 1, end: 2}, {start: 2, end: 3}, {start: 3, end: 0}, {start: 4, end: 5},
      {start: 5, end: 6}, {start: 6, end: 7}, {start: 7, end: 4}, {start: 0, end: 4}, {start: 1, end: 5},
      {start: 2, end: 6}, {start: 3, end: 7}, {start: 8, end: 9}, {start: 9, end: 10}, {start: 10, end: 11},
      {start: 11, end: 8}, {start: 8, end: 4}, {start: 9, end: 5}, {start: 10, end: 6}, {start: 11, end: 7},
      {start: 12, end: 13}, {start: 12, end: 8}, {start: 12, end: 11}, {start: 13, end: 9}, {start: 13, end: 10},
      {start: 14, end: 15}, {start: 15, end: 16}, {start: 16, end: 17}, {start: 17, end: 14}, {start: 18, end: 19},
      {start: 19, end: 20}, {start: 20, end: 21}, {start: 21, end: 18}, {start: 14, end: 18}, {start: 15, end: 19},
      {start: 16, end: 20}, {start: 17, end: 21}
    ]
  },
  cube: {
    pts: [
      {x: 50, y: -50, z: 0}, {x: 50, y: 50, z: 0}, {x: -50, y: 50, z: 0}, {x: -50, y: -50, z: 0},
      {x: 50, y: -50, z: 120}, {x: 50, y: 50, z: 120}, {x: -50, y: 50, z: 120}, {x: -50, y: -50, z: 120}
    ],
    lines: [
      {start: 0, end: 1}, {start: 1, end: 2}, {start: 2, end: 3}, {start: 3, end: 0},
      {start: 4, end: 5}, {start: 5, end: 6}, {start: 6, end: 7}, {start: 7, end: 4},
      {start: 0, end: 4}, {start: 1, end: 5}, {start: 2, end: 6}, {start: 3, end: 7}
    ]
  },
  halfcube: {
    pts: [
      {x: 50, y: -50, z: 0}, {x: 50, y: 50, z: 0}, {x: -50, y: 50, z: 0}, {x: -50, y: -50, z: 0},
      {x: 50, y: -50, z: 55}, {x: 50, y: 50, z: 55}, {x: -50, y: 50, z: 55}, {x: -50, y: -50, z: 55}
    ],
    lines: [
      {start: 0, end: 1}, {start: 1, end: 2}, {start: 2, end: 3}, {start: 3, end: 0},
      {start: 4, end: 5}, {start: 5, end: 6}, {start: 6, end: 7}, {start: 7, end: 4},
      {start: 0, end: 4}, {start: 1, end: 5}, {start: 2, end: 6}, {start: 3, end: 7}
    ]
  },
  pyramid: {
    pts: [
      {x: 50, y: -50, z: 0}, {x: 50, y: 50, z: 0}, {x: -50, y: 50, z: 0}, {x: -50, y: -50, z: 0},
      {x: 0, y: 0, z: 120}
    ],
    lines: [
      {start: 0, end: 1}, {start: 1, end: 2}, {start: 2, end: 3}, {start: 3, end: 0},
      {start: 0, end: 4}, {start: 1, end: 4}, {start: 2, end: 4}, {start: 3, end: 4},
    ],
  },
  bullet: {
    pts:[
      {x: -10, y: 5, z: 55}, {x: -10, y: 5, z: 65}, {x: -10, y: -5, z: 65},
      {x: -10, y: -5, z: 55}, {x: 10, y: 0, z: 60}
    ],
    lines:[
      {start: 0, end: 1}, {start: 1, end: 2}, {start: 2, end: 3},
      {start: 3, end: 0}, {start: 4, end: 0}, {start: 4, end: 1},
      {start: 4, end: 2}, {start: 4, end: 3}
    ]
  }
};

var rawBkgdData = [
  [0, -0.01], [30, 25], [70, 3], [85, 7], [96, 15], [120, 0],
  [175, -0.01], [220, 12], [260, 0],
  [250, -3], [280, 18], [300, 9], [319, 7],
  [280, -18], [350, 0],
  [362, -0.01], [388, 9],
  [383, -0.01], [388, 9], [404, 0],
  [450, -0.01], [482, 8], [519, 4],
  [515, -0.01], [529, 14], [540, 17], [566, 0],
  [600, -0.01], [607, 12], [612, 9], [620, 0],
  [680, -0.01], [720, 6], [730, 16], [735, 16], [750, 8], [780, 0],
  [765, -4], [787, 10], [798, 4],
  [790, -0.01], [815, 12], [840, 0],
  [900, -0.01], [920, 15], [953, 0], [920, -15], [980, 0], [1005, 18], [1017, 7], [1035, 23], [1053, 0],
  [1017, -7], [1035, 0],
  [1100, -0.01], [1125, 13], [1133, 6], [1144, 11], [1169, 5],
  [1160, -0.01], [1175, 8], [1200, 8], [1240, 0],
  [1260, -0.01], [1275, 12], [1295, 0],
  [1320, -0.01], [1342, 5],
  [1337, -0.01], [1350, 12], [1370, 4],
  [1366, -0.01], [1385, 18], [1400, 15], [1425, 0],
  [1470, -0.01], [1485, 15], [1505, 7],
  [1500, -0.01], [1511, 14], [1525, 18], [1540, 0],
  [1537, -4], [1555, 8], [1560, 4], [1600, 0],
];

const GBOFs = [
  {x: 0, y: 2, vx: (Math.random() - 0.5) * 10, vy: 5 + Math.random() * 5, limit: -5 - Math.random() * 5},
  {x: 0, y: 2, vx: (Math.random() - 0.5) * 10, vy: 5 + Math.random() * 5, limit: -5 - Math.random() * 5},
  {x: 0, y: 2, vx: (Math.random() - 0.5) * 10, vy: 5 + Math.random() * 5, limit: -5 - Math.random() * 5},
  {x: 0, y: 2, vx: (Math.random() - 0.5) * 10, vy: 5 + Math.random() * 5, limit: -5 - Math.random() * 5},
  {x: 0, y: 2, vx: (Math.random() - 0.5) * 10, vy: 5 + Math.random() * 5, limit: -5 - Math.random() * 5},
  {x: 0, y: 2, vx: (Math.random() - 0.5) * 10, vy: 5 + Math.random() * 5, limit: -5 - Math.random() * 5},
  {x: 0, y: 2, vx: (Math.random() - 0.5) * 10, vy: 5 + Math.random() * 5, limit: -5 - Math.random() * 5},
  {x: 0, y: 2, vx: (Math.random() - 0.5) * 10, vy: 5 + Math.random() * 5, limit: -5 - Math.random() * 5}
];
