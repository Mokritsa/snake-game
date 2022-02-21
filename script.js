var context = document.querySelector('.game').getContext('2d');
const control = document.querySelector(".control-panel");
const size = document.querySelector(".size");
const speed = document.querySelector(".speed");
const currentScore = document.querySelector(".current");
const bestScr = document.querySelector(".best");
let valSpeed = 1;
const box = 20;
let canvasSize = 60;
let bestScore = 0;
let score = 0;
window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', getLocalStorage);
context.canvas.width = canvasSize;
context.canvas.height = canvasSize;
var timeoutID;
let drowStatus;
size.textContent = 'Size:\n' + canvasSize / box;
speed.textContent = 'Speed:\n' + valSpeed;
bestScr.textContent = "Champion:\n" + bestScore;
currentScore.textContent = "Score:\n" + score;
var foodImg = new Image();
foodImg.src = "assets/svg/strawberry.svg";
let food = {
	x: '',
	y: ''
}
document.querySelector('.up-size').addEventListener("click", (event) => {
	if((canvasSize + box) / box <= 10){
		canvasSize += + box;
		size.textContent = 'Size:\n' + canvasSize / box;
  	restartGame();
	}
});
document.querySelector('.down-size').addEventListener("click", (event) => {
	if((canvasSize - box) / box >= 2){
		canvasSize += - box;
		size.textContent = 'Size:\n' + canvasSize / box;
  	restartGame();
	}
});
document.querySelector('.up-speed').addEventListener("click", (event) => {
	if(valSpeed + 1 <= 9){
		valSpeed++;
		speed.textContent = 'Speed:\n' + valSpeed;
		restartGame();
	}
});
document.querySelector('.down-speed').addEventListener("click", (event) => {
	if(valSpeed - 1 >= 1){
		valSpeed--;
		speed.textContent = 'Speed:\n' + valSpeed;
		restartGame();
	}
});
let dir;
let snake = [];
snake[0] = {
	x: box * Math.floor(canvasSize/(2 * box)),
	y: box * Math.floor(canvasSize/(2 * box))
};
let startHead = snake[0];
setFoodPos();
startDrow();
document.addEventListener("keydown", (event) => {
	timeoutID = setTimeout(direction, 100, event);
});

function setLocalStorage() {
  localStorage.setItem('bestScore', bestScore);
  localStorage.setItem('size', canvasSize);
	localStorage.setItem('speed', valSpeed);
}
function getLocalStorage() {
	stopDrow();
	if(isNaN(localStorage.getItem('bestScore')))
		bestScore = 0;
	else
  	bestScore = parseInt(localStorage.getItem('bestScore'));
	canvasSize = parseInt(localStorage.getItem('size'));
	valSpeed = parseInt(localStorage.getItem('speed'));
	size.textContent = 'Size:\n' + canvasSize / box;
	speed.textContent = 'Speed:\n' + valSpeed;
	currentScore.textContent = "Score:\n" + score;
	bestScr.textContent = "Champion:\n" + bestScore;
	context.canvas.width = canvasSize;
	context.canvas.height = canvasSize;
	snake[0].x = box * Math.floor(canvasSize/(2 * box));
	snake[0].y = box * Math.floor(canvasSize/(2 * box));
	setFoodPos();
	startDrow();
}
function direction(event) {
	if(event.keyCode == 37 && dir != "right")
		dir = "left";
	else if(event.keyCode == 38 && dir != "down")
		dir = "up";
	else if(event.keyCode == 39 && dir != "left")
		dir = "right";
	else if(event.keyCode == 40 && dir != "up")
		dir = "down";
}

function startDrow(){
  drowStatus = setInterval(gameDrow, 900 - valSpeed * 100);
}

function stopDrow(){
  clearInterval(drowStatus);
}

function checkGameOver() {
	let head = {
		x: snake[0].x,
		y: snake[0].y
	};
	if(dir == "left") head.x -= box;
	if(dir == "right") head.x += box;
	if(dir == "up") head.y -= box;
	if(dir == "down") head.y += box;
	for(let i = 1; i < snake.length - 1; i++) {
		if(head.x == snake[i].x && head.y == snake[i].y){
			if(score > bestScore){
				bestScore = score;
				bestScr.textContent = "Champion:\n" + bestScore;
				alert(`Game Over! You ate yourself!\nBut your are new Champion: ${score}`);
			}
			else
      	alert(`Game Over! You ate yourself!\nYour Score: ${score}`);
			restartGame();
			return startHead;
    }
	}
  if(head.x < 0 || head.x >= canvasSize
		|| head.y < 0 || head.y >= canvasSize){
		if(score > bestScore){
			bestScore = score;
			bestScr.textContent = "Champion:\n" + bestScore;
			alert(`Game Over! You hit a barrier!\nBut your are new Champion: ${score}`);
		}
		else
    	alert(`Game Over! You hit a barrier!\nYour Score: ${score}`);
		restartGame();
		return startHead;
  }
	return head;
}

function fonDrow(){
  for(let i = 0; i < canvasSize/box; i++){
    for(let j = 0; j < canvasSize/box; j++){
      if((i + j) % 2 === 0)
        context.fillStyle = '#82E0AA';
      else  
        context.fillStyle = '#ABEBC6';
      context.fillRect(i * box, j * box, box, box);
    }
  }
	context.drawImage(foodImg, food.x, food.y, 20, 20);
}

function setFoodPos() {
	if((score + 1) == Math.pow((canvasSize/box), 2)){
		context.fillRect(food.x, food.y, box, box);
		setTimeout(sayWon, 100);
		setTimeout(restartGame, 1000);
		stopDrow();
	}
	else{
		food.x = Math.floor((Math.random() * (canvasSize / box))) * box;
		food.y = Math.floor((Math.random() * (canvasSize / box))) * box;
		console.log(canvasSize, box);
		for(let i = 0; i < snake.length; i++)
			if(food.x == snake[i].x && food.y == snake[i].y){
				setFoodPos();
			}
		context.drawImage(foodImg, food.x, food.y, 20, 20);
	}
}

function snakeDrow(newHead) {
	snake.unshift(newHead);	
	if(snake[0].x == food.x && snake[0].y == food.y) {
		score++;
		currentScore.textContent = "Score:\n" + score;
		setFoodPos();
	} else
		snake.pop();
	for(let i = 0; i < snake.length; i++) {
		context.fillStyle = i == 0 ? "green" : "red";
		context.fillRect(snake[i].x, snake[i].y, box, box);
	}
}
function sayWon() {
	if(score > bestScore){
		bestScore = score;
		bestScr.textContent = "Champion:\n" + bestScore;
		alert(`Congratulations, you have passed this level!\nYour are new Champion: ${score}`);
	}
	else
		alert(`Congratulations, you have passed this level!\nYour Score: ${score}`);
}

function gameDrow() {
  fonDrow();
	let newHead = checkGameOver();
	if(dir == '')
		snakeDrow(snake[0]);
	else
		snakeDrow(newHead);
	//console.log(food);
}

function restartGame(){
	stopDrow();
	snake.length = 1;
	score = 0;
	currentScore.textContent = "Score:\n" + score;
	context.canvas.width = canvasSize;
	context.canvas.height = canvasSize;
	dir = "";
	snake[0].x = box * Math.floor(canvasSize/(2 * box));
	snake[0].y = box * Math.floor(canvasSize/(2 * box));
	console.log(snake[0]);
	setFoodPos();
	gameDrow();
	startDrow();
}

