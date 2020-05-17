import { Component } from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  
})
export class AppComponent {
  title = 'Snake App';
  control = {
	  //Set controls to WASD
	  left: 97, //A
	  right: 100, //D
	  up: 119, //W
	  down: 115 //S
  };
  
  game_colors = {
	food: "#f4f4f4",
	head: "#3c9036",
	tail: "#63d15c",
	board: "#a3c2c1",
	lose: "#ab3300"
  }
  game_over = false;
  board = [];
  game_on = false;
  inter = 0;
  food = {x: -1, y: -1};
  current_dir = this.control.left;
  
  snake = {
	direct: this.control.left,
	parts: [
		{x: -1, y: -1}
	]
  };
  
  
  
  constructor() {
	  this.board_init();
  }
  
  board_init() {
	//Setup board for game start
	  for (let i = 0; i < 20; i++){
		  this.board[i] = [];
		  for (let j = 0; j < 20; j++){
			  this.board[i][j] = false;
		  }
	  }
  }
  
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(press: KeyboardEvent) {
	//Handle control key strokes to move the snake
	console.log(press.keyCode);
	console.log(press);
	if (press.keyCode === this.control.left && this.snake.direct !== this.control.right){
		this.current_dir = this.control.left;
	}
	else if (press.keyCode === this.control.right && this.snake.direct !== this.control.left){
		this.current_dir = this.control.right;
	}
	else if (press.keyCode === this.control.up && this.snake.direct !== this.control.down){
		this.current_dir = this.control.up;
	}
	else if (press.keyCode === this.control.down && this.snake.direct !== this.control.up){
		this.current_dir = this.control.down;
	}
  }
  
  move_snake() {
	//Move the snake head based on user input
	let head_move = Object.assign({}, this.snake.parts[0]);
	if (this.current_dir === this.control.left){
		head_move.x -= 1;
	}
	else if (this.current_dir === this.control.right){
		head_move.x += 1;
	}
	else if (this.current_dir === this.control.up){
		head_move.y -= 1;
	}
	else if (this.current_dir === this.control.down){
		head_move.y += 1;
	}
	return head_move;
  }
  
  snake_location(col, row) {
	//Set the color to reflect movement of the snake and food
	if (this.game_over) {
		return this.game_colors.lose;
	}
	else if (this.food.x === row && this.food.y === col){
		return this.game_colors.food;
	}
	else if (this.snake.parts[0].x === row && this.snake.parts[0].y === col){
		return this.game_colors.head;
	}
	else if (this.board[col][row] === true){
		return this.game_colors.tail;
	}
	return this.game_colors.board;
  }
  
  update_location() {
	//Update where the location and check for collisions
	let head_move = this.move_snake();
	  
	if (this.board_hit(head_move)){
	  return this.game_end();
	}
	
	if (this.self_hit(head_move)){
		return this.game_end();
	}
	else if (this.food_hit(head_move)){
		this.eat_food();
	}
	
	let old_tail = this.snake.parts.pop();
	this.board[old_tail.y][old_tail.x] = false;
	
	this.snake.parts.unshift(head_move);
	this.board[head_move.y][head_move.x] = true;
	
	this.snake.direct = this.current_dir;
	
	setTimeout(() => {
		this.update_location();
	}, this.inter);
  }
  
  food_reset(){
	//Move food to new location after last eat
	let x = Math.floor(Math.random() * 20);
	let y = Math.floor(Math.random() * 20);
	
	if (this.board[y][x] === true){
		return this.food_reset();
	}
	this.food = {x: x, y: y};
  }
  
  eat_food(){
	//Add tail piece to snake
	let snake_tail = Object.assign({}, this.snake.parts[this.snake.parts.length - 1]);
	
	this.snake.parts.push(snake_tail);
	this.food_reset();
	
  }
  
  board_hit(piece){
	//Check if snake collides with edge
	return piece.x === 20 || piece.y === 20 || piece.x === -1 || piece.y === -1;
  }
  
  self_hit(piece){
	//Check if snake collides with self
	return this.board[piece.y][piece.x] === true;
  }
  
  food_hit(piece){
	//Check if snake collides with food
	return piece.x === this.food.x && piece.y === this.food.y;
  }
  
  game_end(){
	//Game Over
	this.game_over = true;
	this.game_on = false;
	
	this.board_init();
  }
  
  begin_game() {
	//Enter game
	this.game_on = true;
	this.current_dir = this.control.left;
	this.game_over = false;
	this.inter = 150;
	
	this.snake = {direct: this.control.left, parts: []};
	
	for (let i = 0; i < 3; i++){
		this.snake.parts.push({x: 6 + i, y: 6});
	}
	
	this.food_reset();
	this.update_location();
  }
  
  
  
}
