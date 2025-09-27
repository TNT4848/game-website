const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let bird = {x:50, y:300, vy:0};
const gravity = 0.01;
const jump = -10;

let pipes = [];
const pipeWidth = 50;
const gap = 150;
let frame = 0;

function draw() {
  ctx.fillStyle = '#70c5ce';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // Pipes
  ctx.fillStyle='green';
  pipes.forEach(p=>{
    ctx.fillRect(p.x,0,pipeWidth,p.top);
    ctx.fillRect(p.x,canvas.height-p.bottom,pipeWidth,p.bottom);
  });

  // Bird
  ctx.fillStyle='yellow';
  ctx.fillRect(bird.x,bird.y,20,20);
}

function update() {
  bird.vy += gravity;
  bird.y += bird.vy;

  // Add pipes
  if(frame%90===0){
    const top = Math.random()*200 + 50;
    const bottom = canvas.height - top - gap;
    pipes.push({x:canvas.width, top, bottom});
  }

  // Move pipes
  pipes.forEach(p=>p.x-=2);

  // Remove offscreen pipes
  pipes = pipes.filter(p=>p.x+pipeWidth>0);

  // Collision
  pipes.forEach(p=>{
    if(bird.x+20>p.x && bird.x< p.x+pipeWidth && (bird.y< p.top || bird.y+20 > canvas.height-p.bottom)){
      reset();
    }
  });
  if(bird.y+20>canvas.height || bird.y<0) reset();

  frame++;
}

function reset(){
  bird={x:50,y:300,vy:0};
  pipes=[];
  frame=0;
}

document.addEventListener('keydown', ()=> bird.vy = jump);

function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
