Player = baa.entity.extend("Player");

Player.init = function (parent) {
	Player.super.init(this);
	this.setImage("player",48,36);
	this.addAnimation("walk",[1,2,3,4],8);
	this.addAnimation("idle",[5,6,7,8,9,10],[0.3,1,8,8,8,8]);
	this.addAnimation("type",[11,12,13,14],10);
	this.addAnimation("hurt",[15]);
	this.addAnimation("jump",[4]);
	this.addAnimation("die",[16,17,18,19],4,"once");
	this.setAnimation("idle");
	this.x = 20;
	this.floor = 94;
	this.y = this.floor;
	this.width = 19;
	this.centerOrigin();

	this.dead = false;

	this.damage = 0;

	this.once = baa.once.new(this);
	this.activeWord = Word.new(this);
	parent.words.add(this.activeWord);

	this.typing = false;
	this.hurt = false;
	this.onGround = true;

	this.timerManager = baa.timerManager.new(this);
	this.timerHurt = this.timerManager.new(0.4).onComplete("stopHurt").onUpdate("setHurtAlpha");
	this.timerHurt.stop();

	this.type1 = baa.audio.newSource("type1");
	this.type2 = baa.audio.newSource("type2");
	this.type3 = baa.audio.newSource("type3");

	this.ding1 = baa.audio.newSource("ding1");
	this.ding2 = baa.audio.newSource("ding2");
	this.ding3 = baa.audio.newSource("ding3");
	this.ding1.setVolume(0.4);
	this.ding2.setVolume(0.4);
	this.ding3.setVolume(0.4);

}

Player.update = function () {
	if (!this.dead) {
		if (this.hurt) {
			this.setAnimation("hurt");
		}
		else if (!this.typing) {
			if (this.onGround) {
				// if (baa.keyboard.isDown("up")) {
				// 	this.velocity.y = -100;
				// 	this.setAnimation("jump")
				// 	this.onGround = false;
				// }
				if (!(baa.keyboard.isDown("left") && baa.keyboard.isDown("right") || (!baa.keyboard.isDown("left") && !baa.keyboard.isDown("right")))) {
					if (baa.keyboard.isDown("left")) {
						this.flip = true;
						this.velocity.x = -40;
						this.setAnimation("walk");
					}
					else if (baa.keyboard.isDown("right")) {
						this.flip = false;
						this.velocity.x = 40;
						this.setAnimation("walk");
					}
				}
				else {
					this.velocity.x = 0;
					this.setAnimation("idle");
				}
			}
		}
		else {
			this.velocity.x = 0;
			this.setAnimation("type");
		}

		if (!this.onGround)  {
			this.accel.y = 200;
			if (this.y > this.floor) {
				this.onGround = true;
				this.y = this.floor;
				this.velocity.y = 0;
				this.accel.y = 0;
			}
		}

		if (this.y < this.floor) {
			this.onGround = false;
		}

		this.timerManager.update();
	}
	Player.super.update(this);
	if (Play.inst.inBoss) {
		if (this.x < 270) {
			this.x = 270;
		}
	}
	else if (this.x < 0) {
		this.x = 0;
	}
	if (this.x > 500) {
		Play.inst.toNextLevel();
	}
}

Player.draw = function () {
	Player.super.draw(this);
	// this.words.draw();
}

Player.keypressed = function (key) {
	if (!this.dead) {
		this.typing = this.activeWord.keypressed(key);
		if (this.typing) {
			var toplay = _.sample([this.type1,this.type2,this.type3]);
			baa.audio.stop(toplay);
			baa.audio.play(toplay);
		}
	}
}

Player.newWord = function () {
	var playsound = _.sample([this.ding1,this.ding2,this.ding3]);
	baa.audio.play(playsound);

	this.activeWord = Word.new(this);
	Play.inst.words.add(this.activeWord);
}

Player.onOverlap = function (e) {
	if (!this.dead) {
		if (e.type() == "Thug") {
			if (e.punching) {
				this.once.do("getHurt");
			}
		}
		else if (e.type() == "Dumbell") {
			this.getDumbelled(e);
		} 
		else if (e.type()!="Word") {
			Player.super.onOverlap(this,e);
		}
		else {
			if (e.placed) {
				if (e.vertical) {
					Player.super.onOverlap(this,e);
				}
				else if (this.velocity.y > 0) {
					if (this.last.bottom() <= e.top()) {
						this.velocity.y = 0;
						this.onGround = true;
						this.bottom(e.top());
					}
				}
			}
		}
	}
}

Player.remove = function (e) {
	this.words.remove(e);
}

Player.stopHurt = function () {
	this.hurt = false;
	this.velocity.x = 0;
	this.alpha = 1;
	this.setAnimation("idle");
	this.once.back("getHurt");
}

Player.getHurt = function () {
	this.damage++;
	if (this.damage >= 9 ) {
		this.damage = 9
		this.setAnimation("die");
		this.velocity.x = 0;
		if (!this.dead) {
			Play.inst.IDied_RestartLevel();
		}
		this.dead = true;
		this.alpha = 1;
	} 
	else {
		this.hurt = true;
		this.timerHurt.reset();
		this.setAnimation("hurt")
		this.velocity.x = this.flip ? 10 : -10;
	}
}


Player.setHurtAlpha = function (time) {
	time = time * 5
	this.alpha = (time - Math.floor(time) > 0.5 ? alpha = 1 : 0.5);
}

Player.getHit = function (obj) {
	this.flip = obj.centerX() < this.centerX();
	this.getHurt();
	
}

Player.getDumbelled = function (obj) {
	this.flip = obj.centerX() < this.centerX();
	this.getHurt();
	Play.inst.objects.remove(obj);
	obj.dead = true;
	Play.inst.dumbells.remove(obj);	
}