const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const size = 20;
let snake = [{x:10, y:10}];
let dir = {x:0,y:0};
let food = {x:5,y:5};
let speed = 5;

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // Draw food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x*size, food.y*size, size, size);

  // Draw snake
  ctx.fillStyle = 'lime';
  snake.forEach(s=>ctx.fillRect(s.x*size, s.y*size, size, size));
}

function update() {
  let head = {x:snake[0].x+dir.x, y:snake[0].y+dir.y};
  snake.unshift(head);

  // Eat food
  if(head.x===food.x && head.y===food.y){
    food={x:Math.floor(Math.random()*20), y:Math.floor(Math.random()*20)};
  } else snake.pop();

  // Check collision
  if(head.x<0||head.y<0||head.x>=20||head.y>=20 || snake.slice(1).some(s=>s.x===head.x && s.y===head.y)){
    alert("Game Over!");
    snake=[{x:10,y:10}]; dir={x:0,y:0}; food={x:5,y:5};
  }
}

document.addEventListener('keydown', e=>{
  if(e.key==='ArrowUp' && dir.y===0) dir={x:0,y:-1};
  if(e.key==='ArrowDown' && dir.y===0) dir={x:0,y:1};
  if(e.key==='ArrowLeft' && dir.x===0) dir={x:-1,y:0};
  if(e.key==='ArrowRight' && dir.x===0) dir={x:1,y:0};
});

function gameLoop(){
  update();
  draw();
}
setInterval(gameLoop, 1000/5);
