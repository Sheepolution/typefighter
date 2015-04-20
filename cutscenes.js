Cutscenes = baa.sprite.extend("Cutscenes");

Cutscenes.init = function () {
	Cutscenes.super.init(this);
	this.setImage("cutscenes",250,140);

	this.scene = 0;
	this.topText = "hoi";
	this.bottomText = "doei"
	this.fontSize = 10;
	this.bottomY = 0;
	baa.graphics.setBackgroundColor(0,0,0);

}

Cutscenes.update = function () {
	Cutscenes.super.update(this);
	switch(this.scene) {
		case 0:
		this.topText = "Alt to Mute | Arrow keys to walk";
		this.bottomText = "Hit Enter";
		this._currentFrame = 1;
		this.alpha = 0;
		this.fontSize = 10;
		this.bottomY = 0;
		break;
		case 1: 
		this.alpha = 1;
		this.topText = "I didn't want to go to this school..";
		this.bottomText = "It was my mom's idea";
		this._currentFrame = 1;
		this.fontSize = 10;
		this.bottomY = 0;
		break;
		case 2:
		this.topText = "But mom!";
		this.fontSize = 8;
		this.bottomText =  "I don't want to go to Swagsdale High!"
		this._currentFrame = 2;
		this.bottomY = 3;
		break;
		case 3:
		this.topText = "Now now son...";
		this.fontSize = 7;
		this._currentFrame = 2;
		this.bottomText = "Your father and I had a fair discussion, and we both agreed on this school.";
		this.bottomY = 0;
		break;
		case 4:
		this.topText = "Not a day goes by without these thugs bullying me.";
		this.fontSize = 7;
		this.bottomY = 5;
		this._currentFrame = 3;
		this.bottomText = "But that ends now. I will make them pay!";
		break;
		case 5:
		this.topText = "I created a typewriter that can shoot words!";
		this.fontSize = 7;
		this.bottomY = 5;
		this._currentFrame = 4;
		this.bottomText = "The longer the word, the more damage it does!";
		break;
		case 6:
		this.topText = "But you can only use every word once.";
		this.fontSize = 7;
		this.bottomY = 5;
		this._currentFrame = 4;
		this.bottomText = "That is rather... unconventional.";
	}

	

	// this._currentFrame = 1;
}

Cutscenes.draw = function () {
	Cutscenes.super.draw(this);
	baa.graphics.setColor(255,255,255,1);
	Game.fonts.type.setSize(this.fontSize);
	Game.fonts.type.setHeight(10);
	baa.graphics.setFont(Game.fonts.type);
	baa.graphics.print(this.topText,"center",500,125,5);
	baa.graphics.print(this.bottomText,"center",250,125,120 + this.bottomY);

}

Cutscenes.keypressed = function (key) {
	if (key == "return") {
		this.scene++;
		if (this.scene > 6) {
			Game.fonts.type.setSize(10);
			game.state = Menu.new();
		}
	}
}
