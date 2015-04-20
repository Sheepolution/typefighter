Thug = baa.entity.extend("Thug");

Thug.init = function (x,y) {
	Thug.super.init(this,x,90);
	this.setImage("thug",40,40);
	this.kind = baa.util.random(1,4);
	if (this.kind > 1) {
		this.normalIdle();
	}
	else {
		this.addAnimation("idle",[4,5,6],5,"pingpong");
	}

	this.once = baa.once.new(this);

	this.addAnimation("walk",[7,8,9,10],8);
	this.addAnimation("hurt",[11]);
	this.addAnimation("hit",[12,13,14],[15,10,3],"once");
	this.addAnimation("die",[15,16,17],1.5,"once");
	this.addAnimation("throw",[18,19,20],[5,5,1],"once");
	this.follow;
	this.timerManager = baa.timerManager.new(this);
	this.timerHurt = this.timerManager.new(0.4).onComplete("stopHurt").onUpdate("setHurtAlpha");
	this.timerHurt.stop();
	this.timerWalk = this.timerManager.new(Math.random()).onComplete("stopWalk");
	// this.hurt = true;
	this.flip = true;
	this.health = 10;
	this.throwing = false;
	this.dumbell;

}

Thug.update = function (boss) {
	if (!boss) {
		if (!this.dead) {
			if (this.hurt) {
				this.velocity.x = this.flip ? 20 : -20;
			}
			
			else if (this.getAnimation() == "hit") {
				if (this.getAnimationFrame() == 3) {
					if (Math.abs(this.centerX() - this.follow.centerX()) < 25) {
						this.once.do("hitPlayer");
					}
				}
				if (this.hasAnimationEnded()) {
					this.setAnimation("idle");
					this.punching = false;
					this.once.back("hitPlayer");
				}
			}
			else {
				if (!this.throwing) {
					if (this.follow && !this.follow.dead) {
						var succes = false;
						if (this.kind==1) {
							succes = this.once.do("throw");
						}
						if (!succes) {
							if (Math.abs(this.centerX() - this.follow.centerX()) < 15) {
								this.setAnimation("hit");
								this.velocity.x = 0;
							}
							else {
								if (this.follow.x < this.x) {
									this.velocity.x = -45;
									this.flip = true;
									this.setAnimation("walk");
								}
								else {
									this.velocity.x = 80;
									this.flip = false;
									this.setAnimation("walk");
								}
							}
						}
					}
					else {
						if (baa.util.random(0,3000) < 10) {
							if (this.kind != 1) {
								this.once.do("walkAround");
							}
						}
					}
				}
				else {
					if (this.getAnimation() == "throw") {
						if (this.getAnimationFrame() == 3) {
							this.once.do("actualThrow");
						}
					}
					if (this.dumbell && this.dumbell.dead) {
						this.throwing = false;
					}
				}
			}
			this.timerManager.update(this);
		}
	}


	Thug.super.update(this);
}

Thug.onOverlap = function (e) {
	if (!this.dead) {
		if (e.type() == "Word") {
			if (e.shot && e.insideCamera) {
				this.getHurt(e.strength);
				this.follow = e.parent;
				e.onOverlap(this);
			}
		}
	}
}

Thug.detectPlayer = function (player) {
	if (Math.abs(this.x - player.x) < 50) {
		this.follow = player;
	}
}

Thug.stopHurt = function () {
	this.hurt = false;
	this.velocity.x = 0;
	this.alpha = 1;
	this.setAnimation("idle");
}

Thug.setHurtAlpha = function (time) {
	time = time * 5
	this.alpha = (time - Math.floor(time) > 0.5 ? alpha = 1 : 0.5);
}

Thug.getHurt = function (damage) {
	this.health -= damage;
	if (this.health > 0) {
		this.hurt = true;
		this.timerHurt.reset();
		this.setAnimation("hurt");
	}
	else {
		this.alpha = 1;
		this.setAnimation("die");
		this.dead = true;
		this.velocity.x = 0;
	}
}

Thug.hitPlayer = function () {
	this.follow.getHit(this);
}

Thug.walkAround = function () {
	this.flip = !this.flip;
	this.velocity.x = this.flip ? -20 : 20;
	this.timerWalk.reset(Math.random()*2);
	this.setAnimation("walk");
}

Thug.stopWalk = function () {
	this.setAnimation("idle");
	this.velocity.x = 0;
	this.once.back("walkAround");
}

Thug.throw = function () {
	this.setAnimation("throw");
	this.normalIdle();
	this.throwing = true;
	this.velocity.x = 0;
	return true;
}

Thug.actualThrow = function () {
	this.dumbell = Dumbell.new(this.x,this.y,this.flip)
	Play.inst.dumbells.add(this.dumbell);
	Play.inst.add(this.dumbell);
}

Thug.normalIdle = function () {
	this.addAnimation("idle",[1,2,3],[Math.max(0.2,Math.random()),4,3]);
}