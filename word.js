Word = baa.entity.extend("Word");

Word.shiftKeys = {
	"1" : "!",
	"2" : "@",
	"3" : "#",
	"4" : "$",
	"5" : "%",
	"6" : "^",
	"7" : "&",
	"8" : "*",
	"9" : "(",
	"0" : ")",
	"-" : "_",
	"=" : "+",
	"[" : "{",
	"]" : "}",
	";" : ":",
	"," : "<",
	"." : ">",
	"/" : "?",
	"\\" : "|"
}

Word.init = function (parent) {
	Word.super.init(this);
	this.text = "";
	this.shot = false;
	this.parent = parent;
	this.kind;
	this.activated = false;
	this.placed = false;
	this.vertical = false;
	this.separatePriority = 10;
	this.strength = 0;

}

Word.update = function () {
	var camera = Play.inst.camera;
	this.insideCamera = this.x > camera.x && this.right() < camera.right();
	if (this.x > camera.right()) {
		Play.inst.remove(this);
		Play.inst.words.remove(this);
	}
	if (!this.activated) {
		this.x = this.parent.x;
		this.y = this.parent.y - 9;
	}
	Word.super.update(this);
}

Word.draw = function () {
	// Word.super.draw(this);
	baa.graphics.setFont(this.activated ? Game.fonts.type : Game.fonts.typeSmall);
	if (this.shot) {
		baa.graphics.setScissor(
			function () {
				if (this.parent.flip) {
					baa.graphics.rectangle("scissor",this.parent.left()-500,this.y,500,20);
				}
				else {
					baa.graphics.rectangle("scissor",this.parent.right(),this.y,500,20);
				}
			},this
		)
		baa.graphics.setColor(0,0,0);
	}
	else {
		if (Word.__getValid(this.text)) {
			baa.graphics.setColor(0,0,0)
		}
		else {
			baa.graphics.setColor(255,0,0)
		}
	}
	baa.graphics.setColor(255,255,255)
	baa.graphics.print(this.text,this.x-0.5 + this.offset.x,this.y-0.5 + this.offset.y,this.vertical ? -Math.PI/2 : 0);
	baa.graphics.print(this.text,this.x-0.5 + this.offset.x,this.y+0.5 + this.offset.y,this.vertical ? -Math.PI/2 : 0);
	baa.graphics.print(this.text,this.x-0.5 + this.offset.x,this.y + this.offset.y,this.vertical ? -Math.PI/2 : 0);
	baa.graphics.print(this.text,this.x+0.5 + this.offset.x,this.y-0.5 + this.offset.y,this.vertical ? -Math.PI/2 : 0);
	baa.graphics.print(this.text,this.x+0.5 + this.offset.x,this.y+0.5 + this.offset.y,this.vertical ? -Math.PI/2 : 0);
	baa.graphics.print(this.text,this.x+0.5 + this.offset.x,this.y + this.offset.y,this.vertical ? -Math.PI/2 : 0);
	baa.graphics.print(this.text,this.x + this.offset.x,this.y+0.5 + this.offset.y,this.vertical ? -Math.PI/2 : 0);
	baa.graphics.print(this.text,this.x + this.offset.x,this.y-0.5 + this.offset.y,this.vertical ? -Math.PI/2 : 0);
	if (Word.__getValid(this.text) || this.shot) {
		baa.graphics.setColor(0,0,0)
	}
	else {
		baa.graphics.setColor(255,0,0)
	}
	baa.graphics.print(this.text,this.x + this.offset.x,this.y + this.offset.y,this.vertical ? -Math.PI/2 : 0);
	if (this.shot) { baa.graphics.setScissor(); };
}

Word.keypressed = function (key) {
	if (!this.activated) {
		if (key.length == 1  && key != " " ) {

			if (baa.keyboard.isDown("shift")) {
				if (_.has(Word.shiftKeys,key)) {
					key = Word.shiftKeys[key];
				}
				else {
					key = key.toUpperCase();
				}
			}

			this.text = this.text + key;
			return true;
		}
		else {
			if (key == "backspace") {
				if (this.text.length > 0) {
					this.text = this.text.substring(0,this.text.length-1);
					return true;
				} 
			}
			else if (key == "tab" || key == "return" || key == " ") {
				if (this.text.length > 0) {
					if (Word.__getValid(this.text)) {
						this.create();
					}
				}
			}
			// else if (key == "ctrl") {
			// 	this.vertical = !this.vertical;
			// }
		}
		return false;
	}
}

Word.create = function () {
	WORDS[this.text] = 0;
	Game.listOfWords.push(this.text);
	this.width = this.vertical ? 10 : baa.graphics.getTextWidth(this.text);
	this.height = this.vertical ? baa.graphics.getTextWidth(this.text) : 10;
	this.offset.y = this.vertical ? this.height : 0;
	this.shoot();
	this.strength = this.text.length;
}

Word.shoot = function () {
	this.shot = true;
	this.activated = true;
	this.velocity.x = this.parent.flip ? -300 : 300;
	this.setInBackOfParent();
	this.parent.newWord();
	Play.inst.add(this);
}

Word.setInBackOfParent = function () {
	this.x = this.parent.x - this.width + 20;
	this.y = this.parent.centerY()-5;
}

Word.setInFrontOfParent = function () {
	this.y = this.vertical ? this.parent.centerY()-20 : this.parent.centerY()-5;
	this.x = this.parent.flip ? this.parent.left() - this.width : this.parent.right();
}

Word.onOverlap = function (e) {
	if (this.insideCamera)	{
		if (e.is("Thug") || e.is("Dumbell")) {
			Play.inst.words.remove(this);
			this.dead = true;
			Play.inst.remove(this);
		}
	}
}

Word.__getValid = function (word) {
	if (_.has(WORDS,word)) {
		return WORDS[word];
	}
	return false;
}