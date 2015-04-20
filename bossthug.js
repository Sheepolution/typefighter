Bossthug =	Thug.extend("Bossthug");

Bossthug.init = function () {
	Bossthug.super.init(this);
	this.x = 420;
	this.y = 90
	this.setImage("bossthug",55,40);
	this.addAnimation("idle",[1]);
	this.addAnimation("throw",[2,3,4,1,1,1,1,5,6,7,8,1,1,1,1],8);
	this.addAnimation("die",[11,12,13,14],1.4,"once");
	this.setAnimation("throw");
	this.health = 10;
	this.throwing = true;
	this.counter = 2;
	this.onGround = true;
	this.idleTimer = this.timerManager.new(3).onComplete("stopIdle").setCondition({onGround:true});
	this.active = false;
}


Bossthug.update = function () {
	if (this.active) {
		if (!this.dead) {
			if (this.throwing) {
				if (this.getAnimation() == "throw") {
					if (this.getAnimationFrame() == 3) {
						this.once.do("throwRight");
					}
					else if (this.getAnimationFrame() == 11) {
						this.once.do("throwLeft");
					}
				}
			}
			this.timerManager.update(this);
		}

		if (!this.onGround) {
			this.angle += dt * 6.2;
			this.accel.y = 400;
			if  (this.y > 90) {
				this.y = 90;
				this.onGround = true;
				this.angle = 0;
				this.accel.y = 0;
				this.velocity.y = 0;
			}
		}
		Bossthug.super.update(this,true);
	}
}

// Bossthug.draw = function () {

// }

Bossthug.onOverlap = function (e) {
	if (e.type() == "Word") {
		if (e.shot && e.insideCamera) {
			this.getHurt(e.strength);
			this.follow = e.parent;
			e.onOverlap(this);
		}
	}
}

Bossthug.detectPlayer = function (player) {
	if (Math.abs(this.x - player.x) < 50) {
		this.follow = player;
	}
}

Bossthug.detectWord = function (word) {
	if (!this.dead) {
		if (!this.throwing && this.onGround) {
			if (word.shot) {
				if (word.right() > this.left() - 60 && word.right() < this.left()) {
					this.jump();
				}
			}
		}
	}
}

Bossthug.stopHurt = function () {
	this.hurt = false;
	this.velocity.x = 0;
	this.alpha = 1;
	// this.setAnimation("idle");
}

Bossthug.setHurtAlpha = function (time) {
	time = time * 5
	this.alpha = (time - Math.floor(time) > 0.5 ? alpha = 1 : 0.5);
}

Bossthug.getHurt = function (damage) {
	this.health -= damage;
	if (this.health > 0) {
		this.timerHurt.reset();
	}
	else {
		this.setAnimation("die");
		this.dead = true;
		this.alpha = 1;
		this.velocity.x = 0;
	}
}

Bossthug.hitPlayer = function () {

}

Bossthug.walkAround = function () {
	
}

Bossthug.stopWalk = function () {

}

Bossthug.normalIdle = function () {

}


Bossthug.jump = function () {
	this.velocity.y = -200;
	this.onGround = false;
}

Bossthug.throwLeft = function () {
	this.dumbell = Dumbell.new(this.x,this.y,this.flip)
	Play.inst.dumbells.add(this.dumbell);
	Play.inst.add(this.dumbell);
}


Bossthug.throwRight = function () {
	this.once.back("throwLeft");
	var dumbell = Dumbell.new(this.x,this.y,this.flip)
	Play.inst.dumbells.add(dumbell);
	Play.inst.add(dumbell);
}

Bossthug.throwLeft = function () {
	this.once.back("throwRight");
	var dumbell = Dumbell.new(this.x,this.y,this.flip)
	Play.inst.dumbells.add(dumbell);
	Play.inst.add(dumbell);
	this.counter--;
	if (this.counter == 0) {
		this.idleTimer.reset();
		this.throwing = false;
		this.setAnimation("idle");
	}
}

Bossthug.stopIdle = function () {
	this.counter = 2;
	this.throwing = true;
	this.setAnimation("throw");
}