// Ship Class
function ship(canvas,x, y, w, h) {	
	// Variables
	this.context = canvas.getContext("2d");
	this.x=x;
	this.y=y;
	this.w=w;
	this.h=h;	
	this.speed=1;
	this.score=0;
	
	this.level=1;
	var exp=0;
	var img_use=1;
	
	//Check if it's hit by a bullet in a specific coordinate
	this.is_hit=function(bulletx, bullety){
		if(bullety <= this.y + this.h && bullet.y >= this.y
		&& bulletx >= this.x && bulletx <= this.x + this.h)
			return true;
		else
			return false;
	}
	
	//Move Left
	this.move_left=function(){
		if(this.x >= this.speed)
			this.x=this.x-this.speed;
	}
	
	//Move Right
	this.move_right=function(){
		if(this.x<(canvas.width-this.w)-this.speed)
			this.x=this.x+this.speed;
	}
	
	//Get Center(x), use for firing bullet
	this.getCenter=function(size){
		return this.x + (this.w / 2) - size/2;
	}
	
	//Modify the score
	this.add_score=function(iscore){
		this.score=this.score+iscore;
		return this.score;
	}
	
	//Gain exp
	this.gain_exp=function(gexp){
		exp=exp+gexp;
		exp_doc.innerHTML=exp;
		var total_exp=Math.floor(10*Math.pow(this.level,2));
		modify_prog_bar(exp,total_exp);		
		if(exp >= total_exp){//Exp Full, Level Up!!
			exp=0;
			this.level++;
			img_use=this.level;
			if(img_use>3) img_use=3;
			total_exp=Math.floor(10*Math.pow(this.level,2))
			level_doc.innerHTML=this.level;
			exp_doc.innerHTML=exp;
			total_exp_doc.innerHTML=total_exp;
			modify_prog_bar(exp,total_exp);			
			return true;
		}
		return false;
	}
	
	//shoot bullet, that is create bullet and store it in the bullets array
	this.shoot=function(){
		var size=10;	//bullet size
		var center=this.x + (this.w / 2) - size/2;
		if(this.level<4){
			if(bullet.total<this.level){
				bullets[bullet.total] = new bullet(gcontext,center,this.y,10);
			}
		}else{
			if(bullet.total < this.level){
				bullets[bullet.total] = new bullet(gcontext,center-8,this.y,10);				
				bullets[bullet.total] = new bullet(gcontext,center+8,this.y,10);
			}				
		}
	}
	
	//Draw the ship
	this.draw=function(){				
		this.context.drawImage(ship_images[img_use],this.x,this.y);
	}
}

//Bullet Class
function bullet(context, x, y, size){
	this.context = canvas.getContext("2d");
	this.x=x;
	this.y=y;
	this.size=size;
	
	this.constructor.total++;
	this.dir=-1;//-1:toward alien, 1:toward ship
	
	//Check if it's out of bound
	this.out_of_bounds = function(){
		if(this.y < 5)
			return true;
		else
			return false;
	}
	
	this.fly=function(){ //Let the bullet fly
		this.y=this.y+(this.constructor.speed*this.dir);
	}	
	
	//Draw the bullet
	this.draw=function(){
		this.context.drawImage(bullet_images[2],this.x,this.y);
	}
}
bullet.speed = 3;
bullet.total = 0;

function alien(context,x, y, type, color){
	this.context = context;
	this.x=x;
	this.y=y;
	this.type=type;
	this.w=alien_w[type];
	this.h=alien_w[type];
	this.color=color;
	this.score=1+stage;
	this.constructor.total++;

	//Check if it's hit by a bullet in specific location
	this.is_hit=function(bulletx, bullety, size){
		var y = this.y  + this.constructor.forward;
		var dy = bullety - y;
		var dx = bulletx - this.x;
		var dy2 = bullety - y;
		var dx2 = bulletx + size - this.x;						
		if(dy<=this.h && dy>=0 && dx<=this.w && dx>=0 ||
		   dy2<=this.h && dy2>=0 && dx2<=this.w && dx2>=0)
			return true;
		else
			return false;
	}
	
	//Move according to direction and speed
	this.move=function(){
		this.x=this.x + (this.constructor.dir * this.constructor.speed);
	}
		
	this.move_left=function(){
		this.x=this.x - this.constructor.speed;
	}
	this.move_right=function(){
		this.x=this.x + this.constructor.speed;
	}
	
	//Shock mode, make the alien look more realistic, optional
	this.shock_mode=function(){
		this.x+=Math.floor((Math.random()*3))-1; 
		this.y+=Math.floor((Math.random()*3))-1;
		if(this.x<0) this.x=0;
		else if(this.x+this.w>canvas_width) this.x=canvas_width-this.w;
		if(this.y<0) this.y=0;
	}
	
	//Draw the ship
	this.draw=function(){
		this.shock_mode();
		this.context.drawImage(alien_images[this.type],this.x,this.y+this.constructor.forward);
	}	
}
alien.speed=20;
alien.forward=0;
alien.dir = 1;
alien.total = 0;

