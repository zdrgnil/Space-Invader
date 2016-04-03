/* =====================================================================
 * Below are a list of helper functions/procedures
 * =====================================================================
 */ 
 
/* 
 * - Load the game, Reset variables
 * - Only Loaded when game_on flags is set to true;
 */
function load_game(){
	//Initialization
	stage=1;
	invader_move_timeout=1000;
	aliens.splice(0,aliens.length);
	alien.total=0;
	bullets.splice(0,bullets.length);
	bullet.total=0;
	score_doc.innerHTML=0;
	stage_doc.innerHTML=1;
	level_doc.innerHTML=1;
	exp_doc.innerHTML=0;
	total_exp_doc.innerHTML=10;	
	modify_prog_bar(0,10);
	
	//Create Required objects and set the flags
	mShip = new ship(canvas, 250, 550, 50, 38);	
	create_alien_wave(stage);	
	stop_flag=false;

	//Game start
	time();
	invader_move();
}

 
/* 
 * - check which key is still down
 * - run the correspond function
 * */
function key_event(){
	if(left_key_hold) {
		mShip.move_left();
	}
	if(right_key_hold) {
		mShip.move_right();
	}
}

/* 
 * - When alien x hitted by bullet y
 * */
function handle_hit(alien_id, bullet_id){
	var score=mShip.add_score(aliens[alien_id].score);
	score_doc.innerHTML=score;
	mShip.gain_exp(aliens[alien_id].score);	
	
	bullets.splice(bullet_id,1);
	aliens.splice(alien_id,1);
	alien.total--;
	bullet.total--;	
}

/* 
 * - Create a wave of aliens, number of aliens depends on the stage
 * - Store the alien objects in the array aliens
 * */
function create_alien_wave(stage){
	alien.forward=0;
	if(stage > 7)
		stage = 7;
	for(var j=0; j <=stage ;j++){
		var type=Math.floor((Math.random()*4)+1); 
		for(var i=0; i <=10; i++){
			aliens[alien.total] = new alien(gcontext, 35+(i*35), 35+(j*40), type, "#FF00AA")
		}
	}
}

/*
 *  - Draw the aliens in the array
 * */
function draw_aliens(){
	for(var i=0; i < alien.total; i++){
		aliens[i].draw();
	}	
}

/*
 * - Procedure for loading the images required
 * - This can be improve so that it will return true after verifying
 *   that every image have been loaded
 * */
function load_images(){
	ship_images[1] = new Image();
	ship_images[1].src = 'images/1.png';
	ship_images[2] = new Image();
	ship_images[2].src = 'images/2.png';
	ship_images[3] = new Image();
	ship_images[3].src = 'images/3.png';

	bullet_images[1] = new Image();
	bullet_images[1].src = 'images/b_1.png';	
	bullet_images[2] = new Image();
	bullet_images[2].src = 'images/b_2.png';	
	bullet_images[3] = new Image();
	bullet_images[3].src = 'images/b_3.png';	
	bullet_images[4] = new Image();
	bullet_images[4].src = 'images/b_4.png';	
	
	alien_images[1] = new Image();
	alien_images[2] = new Image();
	alien_images[3] = new Image();
	alien_images[4] = new Image();

	alien_images[1].src = 'images/a_1.png';	
	alien_images[2].src = 'images/a_2.png';	
	alien_images[3].src = 'images/a_3.png';	
	alien_images[4].src = 'images/a_4.png';
	
	//img.width & img.height work differently in different browser
	//to save time(from researching) hard code the size
	alien_w[1]=25;
	alien_w[2]=25;
	alien_w[3]=25;
	alien_w[4]=25;

	alien_h[1]=30;
	alien_h[2]=22;
	alien_h[3]=51;
	alien_h[4]=18;
}

/*
 *  - Modify the exp progress bar
 * */
function modify_prog_bar(exp,total_exp){
	var width=Math.floor(150*(exp/total_exp));
	exp_prog_doc.style.width=width+"px";
}

/*
 * - This is the game over screen 
 * */
function end_page(){
	//alert("Game Over!");
	var instr = canvas.getContext("2d");	
	instr = canvas.getContext("2d");			
	instr.font="60px Georgia";
	instr.fillStyle = 'yellow';
	instr.fillText("Game Over!",80,200);

	instr.font = "25px Georgia" 
	instr.fillStyle = 'yellow';
	instr.fillText("Press ENTER to Restart",110, 290);
}

/*
 *  - This is the game start screen with title and instructions
 * */
function start_page(){
	var title = canvas.getContext("2d");	
	gcontext.clearRect(0,0,canvas.width,canvas.height);
	title.font = "50px Georgia" 
	title.fillStyle = 'yellow';
	title.fillText("SPACE INVADERS",37,120);
	var instr = canvas.getContext("2d");	
	instr.font = "25px Georgia" 
	instr.fillStyle = 'yellow';
	instr.fillText("CONTROL KEYS",150, 200);

	var x=90;
	instr.font = "bold 16px Courier" 
	instr.fillStyle = 'yellow';
	instr.fillText("Move Left:            ←   or  A", x, 240);
	instr.fillText("Move Right:           →   or  D", x, 280);
	instr.fillText("Fire Bullet:        space or  J",x, 320);
	instr.fillText("Pause Game:                   P",x, 360);
	instr.fillText("Main Menu:                  ESC",x, 400);

	instr.font = "25px Georgia" 
	instr.fillStyle = 'yellow';
	instr.fillText("Press ENTER to Start",120, 460);
}

