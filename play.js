Play = Class.extend("Play");

Play.inst;

Play.lifes = 1;

Play.stage = 1;

Play.init = function (num,first) {
	this.stage = Play.stage;
	var src = Game.songs[this.stage-1];
	if (src!=Game.songs[0]) {
		Game.songs[0].stop();
	}
	if (src!=Game.songs[1]) {
		Game.songs[1].stop();
	}
	if (src!=Game.songs[2]) {
		Game.songs[2].stop();
	}
	
	baa.audio.play(src);

	this.words = baa.group.new();
	this.words.prepare(Word.new);
	this.backgroundImage = baa.graphics.newImage("stage" + this.stage);
	this.player = Player.new(this);
	this.thugs = baa.group.new();
	this.thugs.add(
		Thug.new(120),
		Thug.new(135),
		Thug.new(140),
		Thug.new(175),
		Thug.new(193),
		Thug.new(240)

	)

	if (this.stage!=3) {
		this.thugs.add(
			Thug.new(284),
			Thug.new(300),
			Thug.new(370)
		)
	}

	if (this.stage == 3) {
		this.bossThug = Bossthug.new();
		this.thugs.add(this.bossThug);
	}

	this.toAddThugs = [];
	for (var i = 0; i < 4; i++) {
		this.toAddThugs.push(Thug.new(-100));
	}

	this.objects = baa.group.new(this.player);
	this.objects.add(this.thugs);

	this.dumbells = baa.group.new();
	this.dumbells.prepare(Dumbell);

	this.addedThugs = 0;
	this.glasses = baa.sprite.new(5,5);
	this.glasses.setImage("glass",52,21);
	this.glasses.addAnimation("idle",[1,2,3,4,5,6,7,8,9,10]);

	this.camera = baa.camera.new(0,0,250,141);
	this.camera.setWorld(0,0,498,141);
	this.camera.speed = 6;
	this.camera.setFollow(this.player)
	this.drawTransition = true;
	this.transition = baa.rect.new(0,0,250,250);
	this.transition.color = [0,0,0];
	this.transition.alpha = 1;
	Tween.to(this.transition,0.4,{x:250}).delay(0.3).onComplete(function() { this.drawTransition = false},this);

	this.cinTopBar = baa.rect.new(0,-10,250,10);
	this.cinBotBar = baa.rect.new(0,141,250,50);

	this.cameraFocus = baa.rect.new(370,100);
	this.inBoss = false;
	this.inCinema = false;

	this.volumeDown = false;
}

Play.update = function () {
	if (!this.inCinema) {
		this.player.update();

		if (this.player.x > 100 && this.player.x < 200) {
			this.addThugFromLeft(0);
		}
		else if (this.player.x > 200 && this.player.x < 250) {
			this.addThugFromLeft(1);
		}
		else if (this.player.x > 250 && this.player.x < 330 && this.stage!=3) {
			this.addThugFromLeft(2);		
		}
		else if (this.player.x > 330 && this.player.y < 350 && this.stage!=3) {
			this.addThugFromLeft(3);
		}

		this.words.update();
		this.thugs.update();
		this.thugs.detectPlayer(this.player);
		if (this.stage == 3) {
			if (!this.inBoss) {
				if (this.player.x > 280) {
					this.player.x = 280;
					this.player.setAnimation("idle");
					this.cinematic();
				}
			}
			else {
				for (var i = 0; i < this.words.length; i++) {
					this.bossThug.detectWord(Game.listOfWords[i]);
				}
			}

		}
		this.glasses.setAnimationFrame(this.player.damage + 1);
		this.dumbells.update();
		this.objects.resolveCollision(baa.group.one);
	}
	this.camera.update();

	// if (baa.keyboard.isPressed("escape")) {
	// 	this.init();
	// }

	// if (baa.keyboard.isPressed(" ")) {
	// 	this.cinematic();
	// }
}

Play.draw = function () {
	this.camera.start();
	// baa.graphics.translate(-300,0);
	this.backgroundImage.draw();
	// baa.graphics.translate(300,0);
	// baa.graphics.scale(2);
	baa.graphics.translate(0,-10);
	this.player.draw();
	this.words.draw();
	this.thugs.draw();
	this.dumbells.draw();
	this.camera.stop();
	if (this.inCinema) {
		baa.graphics.setColor(0,0,0);
		this.cinTopBar.draw();
		this.cinBotBar.draw();
	}
	else {
		this.glasses.draw();
		for (var i = 0; i < 8; i++) {
			if (Play.lifes > i) {
				baa.graphics.setAlpha(1);
			}
			else{
				baa.graphics.setAlpha(0.2);
			}
			baa.graphics.draw("life",64 + i*23,5)
		}
	}
	baa.graphics.setAlpha(1);
	if (this.drawTransition) {
		this.transition.draw("fill");
		baa.graphics.setAlpha(this.transition.alpha);
	}
}

Play.keypressed = function (key) {
	if (key == "alt") {
		// if () {
		var vol = this.volumeDown ? 1 : 0;
		Game.songs[0].setVolume(vol);
		Game.songs[1].setVolume(vol);
		Game.songs[2].setVolume(vol);
		this.player.type1.setVolume(vol);
		this.player.type2.setVolume(vol);
		this.player.type3.setVolume(vol);

		var vol = this.volumeDown ? 0.4 : 0;

		this.player.ding1.setVolume(vol);
		this.player.ding2.setVolume(vol);
		this.player.ding3.setVolume(vol);

		this.volumeDown = !this.volumeDown;
	}
	else {
		this.player.keypressed(key)
	}
}

Play.add = function (obj) {
	this.objects.add(obj);
}

Play.remove = function (obj) {
	this.objects.remove(obj);
}

Play.addThugFromLeft = function (counter) {
	if (this.addedThugs == counter) {
		print(this.toAddThugs);
		this.toAddThugs[counter].follow = this.player;
		this.thugs.add(this.toAddThugs[counter]);
		this.objects.add(this.toAddThugs[counter]);
		this.addedThugs++;
		this.toAddThugs[counter].right(this.camera.x);
	}
}

Play.IDied_RestartLevel = function () {
	Play.lifes--;
	this.transition.x = -250;
	this.drawTransition = true;
	if (Play.lifes == 0) {
		Tween.to(this.transition,0.4,{x:0}).delay(2).onComplete(function () { game.state = Menu.new(); },this);
	}
	else {
		Tween.to(this.transition,0.4,{x:0}).delay(2).onComplete("init",this);
	}
}

Play.cinematic = function () {
	this.inCinema = true;
	Tween.to(this.cinTopBar,0.4,{y:0});
	Tween.to(this.cinBotBar,0.4,{y:131});
	this.camera.speed = 2;
	this.camera.setFollow(this.cameraFocus);
	this.startBossFight = Timer.new(this,2.5,"once").onComplete("startBoss");
	this.thugs.flush()
	this.thugs.add(this.bossThug);
}

Play.startBoss = function () {
	Tween.to(this.cinTopBar,0.4,{y:-10});
	Tween.to(this.cinBotBar,0.4,{y:141}).onComplete(function () { this.inCinema = false},this);
	this.bossThug.active = true;
	this.inBoss = true;
}

Play.toNextLevel = function () {
	if (this.stage!=3) {
		Play.stage++;
		this.init()
	}
	else {
		game.state = Ending.new();
	}
}