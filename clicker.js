let score = 0;
const btn = document.getElementById('click-btn');
const scoreEl = document.getElementById('score');

btn.addEventListener('click', ()=>{
  score++;
  scoreEl.textContent = score;
});
