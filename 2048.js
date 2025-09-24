const container = document.getElementById('game-container');
let tiles = Array(16).fill(0);

function drawGrid() {
  container.innerHTML = '';
  tiles.forEach(val => {
    const div = document.createElement('div');
    div.classList.add('tile');
    if(val !== 0) div.textContent = val;
    container.appendChild(div);
  });
}

function addRandomTile() {
  let empty = tiles.map((v,i)=>v===0?i:-1).filter(i=>i!==-1);
  if(empty.length===0) return;
  tiles[empty[Math.floor(Math.random()*empty.length)]] = Math.random()<0.9?2:4;
}

function slide(row){
  let arr = row.filter(v=>v);
  for(let i=0;i<arr.length-1;i++){
    if(arr[i]===arr[i+1]) { arr[i]*=2; arr[i+1]=0; }
  }
  arr = arr.filter(v=>v);
  while(arr.length<4) arr.push(0);
  return arr;
}

function move(dir){
  for(let i=0;i<4;i++){
    let row = [];
    for(let j=0;j<4;j++){
      if(dir==='ArrowLeft') row.push(tiles[i*4+j]);
      if(dir==='ArrowRight') row.push(tiles[i*4+(3-j)]);
      if(dir==='ArrowUp') row.push(tiles[j*4+i]);
      if(dir==='ArrowDown') row.push(tiles[(3-j)*4+i]);
    }
    row = slide(row);
    for(let j=0;j<4;j++){
      if(dir==='ArrowLeft') tiles[i*4+j]=row[j];
      if(dir==='ArrowRight') tiles[i*4+(3-j)]=row[j];
      if(dir==='ArrowUp') tiles[j*4+i]=row[j];
      if(dir==='ArrowDown') tiles[(3-j)*4+i]=row[j];
    }
  }
  addRandomTile();
  drawGrid();
}

document.addEventListener('keydown',e=>{
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){
    e.preventDefault();
    move(e.key);
  }
});

addRandomTile();
addRandomTile();
drawGrid();
