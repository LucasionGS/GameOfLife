/**
 * @type {HTMLCanvasElement}
 */
const game = document.getElementById("game");
const ctx = game.getContext("2d");

game.width = 768;
game.height = 768;

let ps = 16;
if (ps < 8) {
  ps = 8
}

class Dot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  enabled = false;
  x = 0;
  y = 0;
  
  enable() {
    this.enabled = true;
    return this;
  }
  
  disable() {
    this.enabled = false;
    return this;
  }

  draw() {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x * ps, this.y * ps, ps, ps);
  }
}

function get(x = 0, y = 0) {
  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i];
    if (dot.x == x && dot.y == y) {
      return dot;
    }
  }
  return null;
}

/**
 * @type {Dot[]}
 */
let dots = [];

let wp = game.width / ps;
let hp = game.height / ps;

update(ps);


setInterval(() => {
  applyRules();
}, 100);

function applyRules() {
  /**
   * @type {Dot[]}
   */
  let nDots = []
  for (let i = 0; i < dots.length; i++) {
    // Rules in here
    let dot = nDots[i] = new Dot(dots[i].x, dots[i].y);
    dot.enabled = dots[i].enabled;
    disableIf(dot, () => {
      let neighbors = getNeighborCount(dot);
      
      return neighbors < 2 || neighbors > 3;
    });

    enableIf(dot, () => {
      let neighbors = getNeighborCount(dot);
      
      return neighbors == 3;
    });
  }

  dots = nDots;

  ctx.clearRect(0, 0, game.width, game.height);
  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i];
    if (dot.enabled) dot.draw();
  }
};

/**
 * Rule
 * @param {Dot} dot 
 * @param {boolean | function() => boolean} condition 
 */
function enableIf(dot, condition) {
  if (dot.enabled) {
    return false;
  }
  if (typeof condition == "function") {
    condition = condition();
  }
  if (dot != null && condition) {
    dot.enable();
  }
  else {
    return false;
  }
}

/**
 * Rule
 * @param {Dot} dot 
 * @param {boolean | function() => boolean} condition 
 */
function disableIf(dot, condition) {
  if (!dot.enabled) {
    return false;
  }
  if (typeof condition == "function") {
    condition = condition();
  }
  if (dot != null && condition) {
    dot.disable();
  }
  else {
    return false;
  }
}

/**
 * @param {Dot} dot 
 */
function getNeighborCount(dot) {
  let neighbors = 0;
  let _d;
  _d = get(dot.x, dot.y - 1);
  if (_d && _d.enabled) neighbors++;
  _d = get(dot.x + 1, dot.y);
  if (_d && _d.enabled) neighbors++;
  _d = get(dot.x, dot.y + 1);
  if (_d && _d.enabled) neighbors++;
  _d = get(dot.x - 1, dot.y);
  if (_d && _d.enabled) neighbors++;
  _d = get(dot.x -1, dot.y - 1);
  if (_d && _d.enabled) neighbors++;
  _d = get(dot.x + 1, dot.y -1);
  if (_d && _d.enabled) neighbors++;
  _d = get(dot.x + 1, dot.y + 1);
  if (_d && _d.enabled) neighbors++;
  _d = get(dot.x - 1, dot.y + 1);
  if (_d && _d.enabled) neighbors++;

  return neighbors;
}

function update(size) {
  ps = size;
  wp = game.width / ps;
  hp = game.height / ps;
  dots = [];
  for (let y = 0; y < hp; y++) {
    for (let x = 0; x < wp; x++) {
      dots.push(new Dot(x, y));
    }
  }

  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i];
    let r = Math.random();
    if (r > 0.7) {
      dot.enable();
    }
  }
  document.getElementById("sizeNumber").innerText = size;
  document.getElementById("ps").value = size;
}