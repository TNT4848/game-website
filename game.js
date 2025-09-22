const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 30;
const rows = canvas.height / tileSize;
const cols = canvas.width / tileSize;

// World grid: 0 = empty, 1 = grass, 2 = dirt, 3 = stone
let world = [];
for (let y = 0; y < rows; y++) {
  world[y] = [];
  for (let x = 0; x < cols; x++) {
    if (y >= rows - 3) world[y][x] = 3;       // stone
    else if (y === rows - 4) world[y][x] = 2;  // dirt
    else if (y === rows - 5) world[y][x] = 1;  // grass
    else world[y][x] = 0;                      // sky
  }
}

// Player
let player = { x: 5 * tileSize, y: (rows - 6) * tileSize, width: tileSize, height: tileSize, velocityY: 0 };
const gravity = 0.5;
const jumpStrength = -8;
const speed = 3;

// Track keys pressed
let keys = {};

// Track mouse position
let mouse = { x: 0, y: 0 };

// Draw world
function drawWorld() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      switch(world[y][x]) {
        case 1: ctx.fillStyle = 'green'; break;        // grass
        case 2: ctx.fillStyle = 'saddlebrown'; break;  // dirt
        case 3: ctx.fillStyle = 'gray'; break;         // stone
        default: ctx.fillStyle = '#87CEEB';            // sky
      }
      ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
    }
  }
}

// Draw player
function drawPlayer() {
  ctx.fillStyle = 'red';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Update loop
function update() {
  // Gravity
  player.velocityY += gravity;

  // Vertical movement & collision
  let nextY = player.y + player.velocityY;
  let tileBelow = world[Math.floor((nextY + player.height)/tileSize)]?.[Math.floor(player.x/tileSize)] ?? 0;

  if (tileBelow !== 0) {
    player.y = Math.floor((nextY + player.height)/tileSize) * tileSize - player.height;
    player.velocityY = 0;
  } else {
    player.y = nextY;
  }

  // Horizontal movement
  if (keys['a']) {
    let tileLeft = world[Math.floor((player.y + player.height -1)/tileSize)]?.[Math.floor((player.x-1)/tileSize)] ?? 0;
    if(tileLeft === 0) player.x -= speed;
  }
  if (keys['d']) {
    let tileRight = world[Math.floor((player.y + player.height -1)/tileSize)]?.[Math.floor((player.x + player.width)/tileSize)] ?? 0;
    if(tileRight === 0) player.x += speed;
  }

  drawWorld();
  drawPlayer();
  requestAnimationFrame(update);
}

// Handle key events
document.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true;

  // Jump with space
  if(e.key === ' ') {
    let tileBelow = world[Math.floor((player.y + player.height)/tileSize)]?.[Math.floor(player.x/tileSize)] ?? 0;
    if(tileBelow !== 0) player.velocityY = jumpStrength;
  }
});

document.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false;
});

// Handle mouse movement
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

// Handle mouse clicks for placing/removing blocks
canvas.addEventListener('mousedown', (e) => {
  const tileX = Math.floor(mouse.x / tileSize);
  const tileY = Math.floor(mouse.y / tileSize);
  if (e.button === 0) {
    // Left click = place grass
    world[tileY][tileX] = 0;
  } else if (e.button === 2) {
    // Right click = remove block
    world[tileY][tileX] = 1;
  }
});

// Disable context menu on right click
canvas.addEventListener('contextmenu', (e) => e.preventDefault());

update();
