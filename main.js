baa.load = function () {
	baa.graphics.setBackgroundColor(200,200,200);
	game = Game.new();
	baa.debug.watch(game,"Game");
	baa.debug.setActivate("1","2","q");
}

baa.update = function () {
	game.update();
}

baa.draw = function () {
	game.draw();
}

baa.keyPressed = function (key) {
	game.keypressed(key);
}

baa.config = function (t) {
	t.width = 249;
	t.height = 141;
	t.scale = 3;
}


baa.graphics.preload("png",
	"player",
	"thug",
	"bossthug",
	"dumbell",
	"ball",
	"life",
	"glass",
	"stage1",
	"stage2",
	"stage3",
	"cutscenes",
	"logo"
);

baa.audio.preload("ogg",
	"type1",
	"type2",
	"type3"
);

baa.audio.preload("wav",
	"ding1",
	"ding2",
	"ding3",
	"basket",
	"halls",
	"canteen"

);

baa.run();