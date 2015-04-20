Menu = Class.extend("Menu");

Menu.init = function () {
	loadWords()
	Game.listOfWords = [];
	this.logo = baa.sprite.new();
	this.logo.setImage("logo");
	this.logo.scale.x = 2;
	this.logo.scale.y = 2;
	this.logo.x = 70;
	this.logo.y = 40;

	this.background = baa.sprite.new();
	this.background.setImage("stage1");
	this.background.x = -250;

	function toLeft() {
		Tween.to(this.background,5,{x:-150}).ease("inout","quad").delay(1).to(5,{x:-250}).ease("inout","quad").onComplete(toLeft,this).delay(1);
	}
	Tween.to(this.background,5,{x:-150}).ease("inout","quad").to(5,{x:-250}).ease("inout","quad").onComplete(toLeft,this).delay(1);

	function scaling() {
		Tween.to(this.logo.scale,1.2,{x:0.7,y:0.7}).to(1.2,{x:2,y:2}).onComplete(scaling,this);
	}

	Tween.to(this.logo.scale,1.2,{x:0.7,y:0.7}).to(1.2,{x:2,y:2}).onComplete(scaling,this);

	function rotating() {
		Tween.to(this.logo,1.6,{angle:-baa.util.sign(this.logo.angle)*baa.util.random(0.1,0.4)}).onComplete(rotating,this);;
	}
		Tween.to(this.logo,1.6+Math.random(),{angle:-baa.util.sign(this.logo.angle)*Math.random()}).onComplete(rotating,this);


	baa.audio.stop(Game.songs[0]);
	baa.audio.stop(Game.songs[1]);
	baa.audio.stop(Game.songs[2]);
	baa.audio.play(Game.songs[1]);

}

Menu.update = function () {
}

Menu.draw = function () {
	this.background.draw();
	this.logo.draw();
}

Menu.keypressed = function (key) {
	if (key == "return") {
		game.toPlay();
	}
}