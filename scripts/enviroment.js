/*List of Global Variables needed and their initialization*/
//canvas
var canvas=document.getElementById("canvas");
var gcontext = canvas.getContext("2d");
var canvas_width=canvas.width;

//docs
var score_doc = document.getElementById("score");
var level_doc = document.getElementById("level");
var exp_doc = document.getElementById("exp");
var stage_doc = document.getElementById("stage");
var total_exp_doc = document.getElementById("total_exp");
var exp_prog_doc = document.getElementById("exp_prog");

//Images
var ship_images = [];
var bullet_images = [];	
var alien_images = [];	

var game_on=false;		
var stop_flag=true;	//Use for pause state
var stage;
var invader_move_timeout;
var mShip;
var bullets = [];	//Array to store bullet object
var aliens = [];	//Array to store alien object
var alien_w =[];
var alien_h =[];

//Load the Images
load_images();

//Load the Start Page: which contains title and instructions
start_page();

/* ========================================================================
 * The Fellowing Code handle the situation when a keyboard event occurs
 * ========================================================================
 */ 

var left_key_hold=false,
	right_key_hold=false,
	shoot_key_hold=false;

$(document.body).keydown(function (evt) {
	code=evt.keyCode;
	//alert(code);
	if(code == 65 || code == 37) { //When key 'a' or '←' pressed
		left_key_hold=true;
	}else if(code == 68 || code == 39) { //When key 'd' or '→' pressed
		right_key_hold=true;
	}else if(code == 74){	// not used in this version
		shoot_key_hold=true;
	}
});

$(document.body).keyup(function (evt) {
	code=evt.keyCode;
//	alert(code);
	if(code == 65 || code == 37) {	//When key 'a' or '←' pressed
		left_key_hold=false;
	}else if(code == 68 || code == 39) { //When key 'd' or '→' pressed
		right_key_hold=false;
	}else if(code == 74){	// not used in this version
		shoot_key_hold=false;
	}
});

function keypressed(e){
	var code = (e.keyCode ? e.keyCode : e.which);
	if(code == 106 || code == 32){ // 'j' or 'Space' is pressed
		mShip.shoot();
	}else if(code == 112){// key 'p' is pressed, toggle Pause event
		stop_flag=!stop_flag;
		time();
	}else if(code == 13 && !game_on){//Enter pressed when game in off state
		game_on=true;
		load_game();
	}else if(code == 27){//ESC pressed
		game_on=false;
		stop_flag=true;
		start_page();
	}
}

/* =====================================================================
 * Below are two functions that keep called while game is on
 * =====================================================================
 */ 

function time(){
	if(stop_flag)
		return;
		
	window.setTimeout(time,1);
	
	//clear the canvas, get ready for drawing
	gcontext.clearRect(0,0,canvas.width,canvas.height);
	
	//check which keys are pressed, and run their correspond functions
	key_event();
	
	//draw aliens
	draw_aliens();

	//draw ship
	mShip.draw();


	/* - handle each bullet exist
	 * - check if bullet hits an alien & perform correspond function
	 * - check if bullet is out of bound & perform correspond function
	 * - draw the bullet
	 * */
	for(var i=0; i < bullet.total; i++){		
		//Check if bullet[i] hits an alien
		var hit_flag=false;		
		for(var j=0; j < alien.total; j++){
			if(aliens[j].is_hit(bullets[i].x, bullets[i].y, bullets[i].size)){
				handle_hit(j,i);				
				hit_flag=true;
				break;
			}
		}		
		if(hit_flag)
			continue;
		
		//Check if Bullet is out of bound
		if(bullets[i].out_of_bounds()){
			bullets.splice(i,1);
			bullet.total--;
			continue;
		}
		
		//Draw bullet
		bullets[i].fly();
		bullets[i].draw();
	}
	
	//handle the situation when all aliens are defeated
	if(alien.total==0){
		//Increase the speed of the aliens
		invader_move_timeout=invader_move_timeout-50;
		//Procced to next stage by create another wave of aliens
		stage++;
		stage_doc.innerHTML=stage;
		create_alien_wave(stage);
	}		
}

//aliens moved every 'invader_move_timeout' milliseconds
function invader_move(){
	if(stop_flag)
		return;
	window.setTimeout(invader_move,invader_move_timeout);
	
	/* - Find the Leading Alien(Left Most / Right Most)
	 * - Store It's index in lflag
	 * */
	var lflag=0;
	var small=999;
	var large=0;
	for(var i=0; i < alien.total; i++){
		if(alien.dir < 0){ // Current direction: Left
			if(aliens[i].x < small){
				small=aliens[i].x;
				lflag=i;
			}
		}else{//Current direction: Right
			if(aliens[i].x > large){
				large=aliens[i].x;
				lflag=i;
			}
		}
	}
		
	//Handle the situation when alien hit the left/right wall(Boundary)
	if(alien.total!=0){
		if(aliens[lflag].x < alien.speed){
			alien.dir=1;
			alien.forward+=alien.speed;
		}else if(aliens[lflag].x > (canvas.width - aliens[lflag].w - alien.speed)){
			alien.dir=-1;
			alien.forward+=alien.speed;
		}
	}	
	for(var i=0; i < alien.total; i++){	
		aliens[i].move();
	}
	
	//Handle the situation when alien reached the bottom
	for(var i=0; i < alien.total; i++){
		if(aliens[i].y+aliens[i].h+alien.forward >= canvas.height){
			stop_flag=true;
			game_on=false;
			end_page();
		}
	}
}
