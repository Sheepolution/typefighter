Dumbell = baa.entity.extend("Dumbell");

Dumbell.init = function (x,y,flip) {
	Dumbell.super.init(this,x,y+15);
	this.setImage("dumbell");
	this.rotation = 3;
	this.velocity.x = flip ? -100 : 100;
}

Dumbell.update = function () {
	this.angle += this.rotation;
	Dumbell.super.update(this);
}

Dumbell.onOverlap = function (e) {
	if (e.type() == "Word") {
		this.dead = true;
		Play.inst.objects.remove(this);
		Play.inst.dumbells.remove(this);
		e.onOverlap(this);
	}
}