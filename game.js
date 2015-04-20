Game = Class.extend("Game");

Game.fonts = {
	typeSmall : baa.graphics.newFont("typewriter",5),
	type : baa.graphics.newFont("typewriter",10)
}

Game.listOfWords = [];

Game.songs = [];

Game.init = function () {
	Game.songs = [
		baa.audio.newSource("basket"),
		baa.audio.newSource("canteen"),
		baa.audio.newSource("halls")
	];

	Game.songs[0].setLooping(true);
	Game.songs[1].setLooping(true);
	Game.songs[2].setLooping(true);
	Game.listOfWords = [];
	this.state = Cutscenes.new();

	// this.state = Play.new(1);
}

Game.update = function () {
	this.state.update();
}

Game.draw = function () {
	baa.graphics.setAlpha(1);
	this.state.draw();
}

Game.keypressed = function (key) {
	this.state.keypressed(key);
}


Game.toPlay = function () {
	delete(Play.inst);
	this.state = Play.new();
	Play.lifes = 8;
	Play.inst = this.state;
}