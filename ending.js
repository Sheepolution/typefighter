Ending = Class.extend("Ending");

Ending.init = function () {
	baa.graphics.setBackgroundColor(0,0,0);
	this.keys = Object.keys(WORDS);

	this.start = 0;
	this.otherStart = 0;
	this.percentage = (Game.listOfWords.length/this.keys.length)*100;
	this.percentage = Math.floor(this.percentage*10000)/10000;
}

Ending.update = function () {
	if (!baa.keyboard.isDown(" ")) {
		this.start += 10;
		this.start = Math.min(this.start,this.keys.length-19);
		this.otherStart += dt;
		this.otherStart = Math.min(this.otherStart,Math.max(0,Game.listOfWords.length-19));
	}

	// a += dt;
}

Ending.draw = function () {
	baa.graphics.setFont(Game.fonts.typeSmall);
	baa.graphics.print("THE END","center",250,125,10);

	for (var i = this.start; i < this.start + 19; i++) {
		if (WORDS[this.keys[i]]) {
			baa.graphics.setColor(255,255,255);
		}
		else {
			baa.graphics.setColor(255,0,0);
		}

		baa.graphics.print(this.keys[i],2,5+(i-this.start)*7);
	}


	for (var i = Math.floor(this.otherStart); i < Math.floor(this.otherStart) + 21; i++) {
		if (Game.listOfWords[i]) {
			baa.graphics.print(Game.listOfWords[i],"right",250,248,2+(i-this.otherStart)*7);
		}
	}


	baa.graphics.print("You used","center",250,125,30);
	 
	baa.graphics.print(this.percentage + "%" ,"center",250,125,40);
	
	baa.graphics.print("of the dictionary","center",250,125,50);

	baa.graphics.print('Made by Daniël "Sheepolution" Haazen',"center",250,125,80);
	baa.graphics.print('For Ludum Dare #32',"center",250,125,90);
	baa.graphics.print('Theme: An Unconventional Weapon',"center",250,125,100);
	baa.graphics.print('Thanks for playing!',"center",250,125,115);

	baa.graphics.print("@sheepolution  |  www.sheepolution.com","center",250,125,130);

	baa.graphics.setColor(255,255,255);
	// baa.graphics.circle("fill",a);

}

Ending.keypressed = function (key) {
	if (key == "return") {
		game.state = Menu.new();
	}
}