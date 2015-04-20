/*
BBBBBBBBBBBBBBBBB               AAA                              AAA               
B::::::::::::::::B             A:::A                            A:::A              
B::::::BBBBBB:::::B           A:::::A                          A:::::A             
BB:::::B     B:::::B         A:::::::A                        A:::::::A            
  B::::B     B:::::B        A:::::::::A                      A:::::::::A           
  B::::B     B:::::B       A:::::A:::::A                    A:::::A:::::A          
  B::::BBBBBB:::::B       A:::::A A:::::A                  A:::::A A:::::A         
  B:::::::::::::BB       A:::::A   A:::::A                A:::::A   A:::::A        
  B::::BBBBBB:::::B     A:::::A     A:::::A              A:::::A     A:::::A       
  B::::B     B:::::B   A:::::AAAAAAAAA:::::A            A:::::AAAAAAAAA:::::A      
  B::::B     B:::::B  A:::::::::::::::::::::A          A:::::::::::::::::::::A     
  B::::B     B:::::B A:::::AAAAAAAAAAAAA:::::A        A:::::AAAAAAAAAAAAA:::::A    
BB:::::BBBBBB::::::BA:::::A             A:::::A      A:::::A             A:::::A   
B:::::::::::::::::BA:::::A               A:::::A    A:::::A               A:::::A  
B::::::::::::::::BA:::::A                 A:::::A  A:::::A                 A:::::A 
BBBBBBBBBBBBBBBBBAAAAAAA                   AAAAAAAAAAAAAA                   AAAAAAA

Barely an angine

*/


/**
 * Saves time from writing console.log, and writes complete functions
 */
print = function () {
	var str = ""
	for (var i = 0; i < arguments.length; i++) {
		if (i<arguments.length-1) {
			str = str + arguments[i] +", ";
		}
		else {
			str = str + arguments[i];
		}
	}
	console.log(str);
}


/**
 * Saves time from writing console.log
 */
printf = function () {
	console.log(arguments);
}


//////////////
///CLASSIST///
//////////////

/**
 * Let's you create classes, that allow extending, implementing, and type checking.
 * @example
 * //Create a new class.
 * Animal = Class.extend("Animal");
 *
 * //Static variable
 * Animal.types = [
 * 	"Mammal",
 * 	"Fish",
 * 	"Insect"
 * ]
 * 
 * //The constructor. This is called when creating a new instance.
 * Animal.init = function () {
 * 		this.health = 100;
 * 		
 * }
 *
 * //Give functions to the class like this.
 * Animal.draw = function () {
 * 		baa.graphics.rectangle("fill",100,100,this.health);
 * }
 *
 * //Extend an existing class
 * Bear = Animal.extend("Bear");
 *
 *
 * Bear.init = function () {
 * 		//Call the original function of the extended class
 * 		Bear.super.init();
 * }
 *
 * Bear.draw = function () {
 * 		Bear.super.draw();
 * }
 *
 * //Static function. You can't use 'this' here.
 * Bear.__doStuff = function () {
 * 
 * }
 * @class
 * @type {object}
 */
Class = {};

/**
 * The names of the class. For each extension there is a new name.
 * @type {string[]}
 */
Class._names = ["Class"];

/**
 * This is used to check if something is a class
 */
Class._isClass = true;

/**
 * Clones an existing class to create a new type of class.
 * @param  {string} name The name of the class
 * @return {Class}      A clone of the class
 */
Class.extend = function (name) {
	if (typeof(name) != "string") {
		throw("Missing argument name in Class.extend");
	}
	var temp = {};
	var supr = {};
	for(var key in this) {
		temp[key] = this.__clone(this[key]);
		if (typeof(this[key])=="function" && key!="isClass") {
			supr[key] = this.__clone(this[key],true);
		}
	}
	temp.super = supr;
	temp._names.push(name);
	return temp;
}

/**
 * Creates a new instance of the class
 * @return {Class} The new instance of the class.
 */
Class.new = function () {
	var self = this.__clone(this);

	if (!self.init) {
		throw(this.type() + " has no constructor");
	}

	self.init.apply(self,arguments);
	
	return self;
}

/**
 * Copies the functions of a different class
 * @param  {Class} obj   The class to implement
 * @param  {boolean} force Whether to overwrite existing functions.
 */
Class.implement = function (obj,force) {
	baa._checkType("Class",obj,"Class");
	baa._checkType("force",force,"boolean",null);

	for(var key in obj) {
		if (this[key] == null || force) {
			this[key] = this.__clone(obj[key]);
		}
	}
}

/**
 * If something is specific class
 * @example
 * var rect = baa.rect.new();
 * 
 * //Returns true
 * rect.is(baa.rect);
 *
 * //Returns true
 * rect.is(baa.point);
 *
 * //Returns false
 * rect.is(baa.sprite);
 * 
 * @param  {Class|string}  obj The value you want to check
 * @return {boolean}  If it is of the type obj 
 */
Class.is = function (obj) {
	baa._checkType("object",obj,"Class","string",null);
	if (obj == null) { return false; }
	var t = typeof(obj);
	for (var i = 0; i < this._names.length; i++) {
		if ((t == "object" && this._names[i] == obj.type()) || (obj == this._names[i])) {
			return true;
		}
	}
	return false;
}

/**
 * Returns the top-layer-type of the class
 * @example
 * // returns "baa.rectangle"
 * baa.rectangle = baa.point.extend("baa.rectangle");
 * baa.rectangle.type();
 * @return {string} The type of the class
 */
Class.type = function () {
	if (this._names[this._names.length-1].length == null) {
		throw("Add a type name! class.extend([TYPE])");
	}
	return this._names[this._names.length-1];
}

/**
 * Clones the properties of obj
 * @private
 * @param  {object} obj  The object to clone properties from
 * @param  {boolean} supr If this is for extending or not
 * @return {object}      The cloned object
 */
Class.__clone = function(obj,supr) {
	if (supr) {
		var _super  = function () {
			var args = Array.prototype.slice.call(arguments);
			var _this = args[0];
			args.splice(0,1);
			// _this.__superWasCalled = true;
			return obj.apply(_this,args);
		}
		return _super;
	}
	//Check if it's an object. If not then just return it
	if(obj == null || typeof(obj) != "object") {
		return obj;
	}
	if (Array.isArray(obj)) {
		return obj.slice(0);
	}
	var temp = obj.constructor();
	for(var key in obj) {
		if (key == "super") { continue; }
		if (key == "__clone" || key == "isClass" || key == "new" || key.substring(0,2) == "__") { continue; }
		temp[key] = this.__clone(obj[key],supr);
	}
	return temp;
}

/**
 * Ìf something is a class or not
 * @param  {dynamic}  obj The value to check
 * @return {boolean}   If it's a class or not
 */
Class.isClass = function (obj) {
	if (obj!=null) {
		if (typeof(obj) == "object") {
			if (obj["_isClass"]) {
				return true;
			}
		}
	}
	return false;
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////


var _baa_init = function () {
	baa.graphics.canvas = document.getElementById('canvas');
	baa.graphics._defaultCanvas = baa.graphics.canvas;
	baa.graphics.ctx = baa.graphics.canvas.getContext('2d');
	baa.graphics._defaultCtx = baa.graphics.ctx;

	document.addEventListener("keydown",baa.keyboard._downHandler, false);
	document.addEventListener("keyup",baa.keyboard._upHandler, false);
	document.addEventListener("mousemove",baa.mouse._move, false);
	document.addEventListener("mousedown",baa.mouse._downHandler, false);
	document.addEventListener("mouseup",baa.mouse._upHandler, false);
	document.addEventListener("mousewheel",baa.mouse._wheelHandler, false);
}

/**
 * baa.js is a library created by Daniël Haazen. It's heavily inspired by the LÖVE framework.
 * @constructor
 * @type {object}
 */
baa = {};

/**
 * Whether to use type safety. Is turned off in release-mode.
 * @type {boolean}
 */
baa._typesafe = true;

/**
 * Checks if the type of obj is one of the given types, and throws an error if it's not
 * @param  {string} name The name of the object
 * @param  {object} obj  The object
 * @param {dynamic} ... The allowed types
 */
baa._checkType = function (name,obj) {
	if (!this._typesafe) { return; };
	var t = typeof(obj);
	if (t == arguments[2]) { return; };
	str = ""
	var type = obj == null ? null : Array.isArray(obj) ? "array" : t;
	var clss =  Class.isClass(obj);
	for (var i = 2; i < arguments.length; i++) {
		
		str = str + arguments[i];
		if (arguments[i] == type) {
			return;
		}
		else if (clss && (obj.is(arguments[i]))) {
			return;
		}
	
		if (i != arguments.length-1) {
			str = str + ", ";
		}
	}
	throw("Wrong type '" + type + "' for " + name + ". Correct types: " + str);
}

/**
 * Number of assets that are loaded
 * @type {number}
 */
baa._assetsLoaded = 0;

/**
 * Total number of assets that have to be loaded before starting the program
 * @type {number}
 */
baa._assetsToBeLoaded = 0;

/**
 * The object containing information for deltatime
 * @constructor
 * @type {object}
 */
baa._time = {dt:0,last:0};

/**
 * Returns the current time
 * @return {number} The current time
 */
baa._time.stamp = function () {
	return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

/**
 * The time of the previous loop
 * @type {number}
 */
baa._time.last = baa._time.stamp();


//Point
//////////////////////////////////

/**
 * A point class. Containing an x and y.
 * @constructor
 * @property {number} x The horizontal position
 * @property {number} y The vertical position
 * @param  {number} [x=0] The horizontal position
 * @param  {number} [y=x] The vertical position
 * @type {Class}
 */
baa.point = Class.extend("baa.point");


baa.point.init = function (x,y) {
	baa._checkType("x",x,"number",null);
	baa._checkType("y",y,"number",null);
	
	this.x = x || 0;
	this.y = y == null ? this.x : y;
}

/**
 * Sets the x and y of the point
 * @param  {number} [x=0] The horizontal position
 * @param  {number} [y=x] The vertical position
 */
baa.point.set = function (x,y) {
	baa._checkType("x",x,"number",null);
	baa._checkType("y",y,"number",null);

	this.x = x || 0;
	this.y = y == null ? this.x : y;
}

/**
 * Clones the x and y of another point
 * @param  {baa.point} p The point to clone from
 */
baa.point.clone = function (point) {
	baa._checkType("point",point,"baa.point");

	this.x = point.x;
	this.y = point.y;
}

/**
 * If the point overlaps with a rectangle
 * @param  {baa.rectangle} r The rectangle you want to check overlap with
 * @return {boolean}   If there is overlap
 */
baa.point.overlaps = function (rect) {
	baa._checkType("rect",r,"baa.rect");
	return rect.x + rect.width > this.x && rect.x < this.x
		&& rect.y + rect.height > this.y && rect.y < this.y;
}

//Rect
//////////////////////////////////

/**
 * A rectangle class. Extends baa.point with a width and height.
 * @constructor
 * @property {number} width The width of the rectangle
 * @property {number} height The height of the rectangle
 * @property {object} color The color of the rectangle. Use an array of 3 numbers.
 * @param {number} [x=0] The horizontal position
 * @param {number} [y=x] The vertical position
 * @param {number} [width=0] The width
 * @param {number} [height=width] The height
 * @type {Class}
 */
baa.rect = baa.point.extend("baa.rect");

baa.rect.init = function (x,y,width,height) {
	baa.rect.super.init(this,x,y);
	baa._checkType("width",width,"number",null);
	baa._checkType("height",height,"number",null);

	this.width = width || 0;
	this.height = height == null ? this.width : height;
	this.color;
}

/**
 * Draws the rectangle
 * @param  {string} [mode="fill"] Whether to use fill, line or both when drawing
 * @param  {number} r    How much rounding to use
 */
baa.rect.draw = function (mode,r) {
	if (this.color) {
		baa.graphics.setColor(this.color);
	}
	baa.graphics.rectangle(mode || "fill",this.x,this.y,this.width,this.height,r);
}

/**
 * Sets new values for the rectangle
 * @param  {number} [x=0] The horizontal position
 * @param  {number} [y=x] The vertical position
 * @param {number} [width=0] The width
 * @param {number} [height=width] The height
 * @override
 */
baa.rect.set = function (x,y,width,height) {
	baa.rect.super.set(this,x,y);
	baa._checkType("width",width,"number",null);
	baa._checkType("height",height,"number",null);

 	this.width = width;
	this.height = height == null ? width : height;
}

/**
 * Clones the values of another rectangle
 * @param  {baa.rectangle} r The rectangle to clone from
 * @override
 */
baa.rect.clone = function (rect) {
	baa._checkType("rect",rect,"baa.rect");

	this.x = rect.x;
	this.y = rect.y;
	this.width = rect.width;
	this.height = rect.height;
}

/**
 * Sets and returns the left side of the rectangle
 * @param  {number} [x] The horizontal position you want the left side to be at
 * @return {number}   The horizontal position the left side is at
 */
baa.rect.left = function (x) {
	baa._checkType("x",x,"number",null);

	if (x!=null) { this.x = x; }
	return this.x;
}

/**
 * Sets and returns the right side of the rectangle
 * @param  {number} [x] The horizontal position you want the right side to be at
 * @return {number}   The horizontal position the right side is at
 */
baa.rect.right = function (x) {
	baa._checkType("x",x,"number",null);

	if (x!=null) { this.x = x - this.width};
	return this.x + this.width;
}

/**
 * Sets and returns the top side of the rectangle
 * @param  {number} [y] The vertical position you want the top side to be at
 * @return {number}   The vertical position the top side is at
 */
baa.rect.top = function (y) {
	baa._checkType("y",y,"number",null);

	if (y!=null) { this.y = y; }
	return this.y;
}

/**
 * Sets and returns the bottom side of the rectangle
 * @param  {number} [y] The vertical position you want the bottom side to be at
 * @return {number}   The vertical position the bottom side is at
 */
baa.rect.bottom = function (y) {
	baa._checkType("y",y,"number",null);

	if (y!=null) { this.y = y - this.height};
	return this.y + this.height;
}

/**
 * Sets and returns the horizontal center of the rectangle
 * @param  {number} [x] The horizontal position you want the horizontal center to be at
 * @return {number}   The horizontal position the horizontal center is at
 */
baa.rect.centerX = function (x) {
	baa._checkType("x",x,"number",null);

	if (x!=null) { this.x = x - this.width/2 };
	return this.x + this.width/2;
}

/**
 * Sets and returns the vertical center of the rectangle
 * @param  {number} [y] The vertical position you want the vertical center to be at
 * @return {number}   The vertical position the vertical center is at
 */
baa.rect.centerY = function (y) {
	baa._checkType("y",y,"number",null);

	if (y!=null) { this.y = y - this.height/2 };
	return this.y + this.height/2;
}

/**
 * If the rectangle overlaps with another rectangle or point
 * @param  {baa.rectangle|baa.point} r The rectangle or point you want to check overlap with
 * @return {boolean}   If there is overlap
 * @override
 */
baa.rect.overlaps = function (rect) {
	baa._checkType("rect",rect,"baa.rect","baa.point");
	return this.x + this.width > rect.x && this.x < rect.x + (rect.width || 0) 
		&& this.y + this.height > rect.y && this.y < rect.y + (rect.height || 0) ;
}

/**
 * If the rectangle overlaps horizontally with another rectangle or point
 * @param  {baa.rectangle|baa.point} r The rectangle or point you want to check horizontal overlap with
 * @return {boolean}   If there is horizontal overlap
 */
baa.rect.overlapsX = function (rect) {
	baa._checkType("rect",rect,"baa.rect","baa.point");

	return this.x + this.width > rect.x && this.x < rect.x + r.width;
}

/**
 * If the rectangle overlaps vertically with another rectangle or point
 * @param  {baa.rectangle|baa.point} r The rectangle or point you want to check vertical overlap with
 * @return {boolean}   If there is vertical overlap
 */
baa.rect.overlapsY = function (rect) {
	baa._checkType("rect",rect,"baa.rect","baa.point");

	return this.y + this.height > rect.y && this.y < rect.y + rect.height;
}

//Circle
///////////////////////////////

/**
 * A circle class. Extends baa.point with a size
 * @constructor
 * @property {number} size The size of the circle
 * @property {array} color The color of the circle. Use an array of 3 numbers.
 * @param {number} [x=0] The horizontal position
 * @param {number} [y=x] The vertical position
 * @param {number} [size=0] The size
 * @type {Class}
 */
baa.circle = baa.point.extend("baa.circle");

baa.circle.init = function (x,y,size) {
	baa.circle.super.init(this,x,y);
	baa._checkType("size",size,"number",null);

	this.size = size || 0;
	this.color;
}

/**
 * Draws the circle
 * @param  {string} mode Wether to use fill, line or both when drawing
 */
baa.circle.draw = function (mode) {
	if (this.color) {
		baa.graphics.setColor(this.color);
	}
	baa.graphics.circle(mode || "fill",this.x,this.y,this.size);
}

/**
 * Sets new values for the circle
 * @param  {number} [x=0] The horizontal position
 * @param  {number} [y=x] The vertical position
 * @param {number} [size=0] The size
 * @override
 */
baa.circle.set = function (x,y,size) {
	baa.circle.super.init(x,y);
	baa._checkType("size",size,"number",null);

	this.size = size || 0;
}

/**
 * Clones the values of another circle
 * @param  {baa.circle} r The circle to clone from
 * @override
 */
baa.circle.clone = function (circle) {
	baa._checkType("circle",circle,"baa.circle");

	this.x = circle.x;
	this.y = circle.y;
	this.size = circle.size;
}

/**
 * If the circle overlaps with another circle or point
 * @param  {baa.circle|baa.point} r The circle or point you want to check overlap with
 * @return {boolean}   If there is overlap
 * @override
 */
baa.circle.overlaps = function (circle) {
	baa._checkType("circle",circle,"baa.circle","baa.point");

	return Math.sqrt(Math.pow(this.x - circle.x,2) + Math.pow(this.y - circle.y,2)) < this.size/2 + (circle.size || 0)/2;
}


//Sprite
//////////////////////////////

/**
 * A sprite class. Extends baa.rectangle with image and animations.
 * @constructor
 * @property {baa.point} origin The point the object is rotated around and scaled to
 * @property {baa.point} offset How far the image should be drawn from the hitbox
 * @property {baa.point} scale How much the image should scale
 * @property {number} alpha The opacity of the sprite. Use a value between 0 and 1.
 * @property {number} angle The angle of the image in radians
 * @property {boolean} flip If the image should be mirrored. Useful for characters walking left and right.
 * @property {boolean} visible If the sprite should be drawn
 * @property {baa._image} image The image to draw
 * @property {array} _frames The frames the sprite has and can be used to make animations with
 * @property {object} _animations The animations that are made
 * @property {number} _animTimer Counts up during animation and rounds up to get current frame
 * @property {number} _animTimerDir The direction _animTimer goes to. 1 for up, -1 for down.
 * @property {number} _currentFrame At what frame the animation currently is
 * @property {string} _currentAnim The animation currently in use
 * @property {boolean} _animPlaying Whether the animation is playing at the moment
 * @property {boolean} _animEnded Whether the animation has ended
 * @param {number} [x=0] The horizontal position
 * @param {number} [y=x] The vertical position
 * @param {number} [width=0] The width
 * @param {number} [height=width] The height
 * @type {Class}
 */
baa.sprite = baa.rect.extend("baa.sprite");

baa.sprite.init = function (x,y,width,height) {
	baa.sprite.super.init(this,x,y,width,height);
	this.origin = baa.point.new(0,0);
	this.offset = baa.point.new(0,0);
	this.scale = baa.point.new(1,1);
	this.alpha = 1;
	this.angle = 0;
	this.flip = false;
	this.visible = true;

	this.image;
	this._frames = [];
	this._animations = {}
	this._animTimer = 1;
	this._animTimerDir = 1;
	this._currentFrame = 1;
	this._realFrame = 0;
	this._currentAnim = "idle";
	this._animPlaying = true;
	this._animEnded = false;
}

/**
 * Updates the sprite
 */
baa.sprite.update = function () {
	this.animate();
}

/**
 * Draws the image. If no image is assigned, it will draw a rectangle instead.
 */
baa.sprite.draw = function () {
	if (this.visible) {
		if (this.image) {
			baa.graphics.setAlpha(this.alpha);
			this.image.draw(this._frames[this._currentFrame-1],
			this.x+this.offset.x + this.origin.x,this.y+this.offset.y + this.origin.y,
			this.angle,this.flip ? -this.scale.x : this.scale.x,this.scale.y,this.origin.x,this.origin.y);
			baa.graphics.setAlpha(1);
		}
		else {
			baa.sprite.super.draw(this);
		}
	}

	if (baa.debug && baa.debug.active) {
		this.drawDebug();
	}
}

/**
 * Draws debug lines. This is called when baa.debug is active.
 */
baa.sprite.drawDebug = function () {
	baa.graphics.setAlpha(1);
	baa.graphics.setLineWidth(2);
	baa.graphics.setColor(255,0,0);
	baa.graphics.rectangle("line",this.x,this.y,this.width,this.height);
}

/**
 * Sets the given image. Makes frames based on the given width and height. Automatically centers the origin based on the width and height.
 * @example
 * //The sprite's width and height become that of the image.
 * this.setImage("player");
 *
 * //the image is cut down to smaller images, frames, that can be used for animations.
 * this.setImage("player",16,16);
 * @param {string} url    The url of the string
 * @param {number} [width]  The width of the frames
 * @param {number} [height] The height of the frames
 * @param {boolean} [smooth] If the image should use smoothing when drawing
 */
baa.sprite.setImage = function (url,width,height,smooth) {
	baa._checkType("url",url,"string");
	baa._checkType("width",width,"number",null);
	baa._checkType("height",height,"number",null);
	baa._checkType("smooth",smooth,"boolean",null);

	this.image = baa.graphics.newImage(url,smooth);
	this.width = width || this.image.getWidth();
	this.height = height || this.image.getHeight();
	this._frames = [];
	for (var i=0; i < this.image.getHeight()/this.height; i++) {
		for (var j=0; j < this.image.getWidth()/this.width; j++) {
			this._frames.push({x:j*this.width,y:i*this.height,width:this.width,height:this.height});
		}
	}
	this.centerOrigin();
}

/**
 * Centers the origin. This is automatically called by setImage
 */
baa.sprite.centerOrigin = function () {
	this.origin.x = this.width/2;
	this.origin.y = this.height/2;
}

/**
 * Adds an animation
 * @param {string} name   The name of the animation
 * @param {number[]} frames  The frames the animation. Use numbers between 1 and the number of frames.
 * @param {number} [speed=12]  The speed the animations plays with
 * @param {string} [mode="loop"]   The loop mode. "loop" for looping, "once" for the animation playing only once,
 *  and "pingpong" for the animation to go back and forth.
 * @param {number} [semi=0]	When ended, and looping, where the frame should start from instead. 
 * Useful for animations with a starting animation you only want to play once.   
 */
baa.sprite.addAnimation = function (name,frames,speed,mode,semi) {
	baa._checkType("name",name,"string");
	baa._checkType("frames",frames,"array");
	baa._checkType("speed",speed,"number","array",null);
	baa._checkType("mode",mode,"string",null);
	baa._checkType("semi",semi,"number",null);

	var obj = {};
	obj.frames = frames;
	obj.numberOfFrames = frames.length;
	obj.speed = speed || 12;
	obj.mode = mode || "loop";
	obj.semi = semi || 1;

	this._animations[name] = obj;
}

/**
 * Handles the animating. Is automatically called by update.
 */
baa.sprite.animate = function () {
	if (this._animPlaying) {
		if (this._animations.hasOwnProperty(this._currentAnim)) {
			var anim = this._animations[this._currentAnim];
			if (anim.numberOfFrames == 1) {
				this._animTimer = 0;
				this._currentFrame = anim.frames[this._animTimer];
				return;
			}

			if (typeof(anim.speed) == "number") {
				this._animTimer += anim.speed * this._animTimerDir * dt;
			}
			else {
				this._animTimer += anim.speed[this._realFrame] * this._animTimerDir * dt;
			}

			if (this._animTimer > anim.numberOfFrames+1 || this._animTimer < 1) {
				if (anim.mode == "loop") {
					this._animTimer = anim.semi;
					this._animEnded = true;
				}
				else if (anim.mode == "once") {
					this._animTimer = anim.numberOfFrames
					this._animPlaying = false;
					this._animEnded = true;
				}
				else if (anim.mode == "pingpong") {
					this._animTimer = this._animTimerDir > 0 ? anim.numberOfFrames : 2;
					this._animTimerDir = -this._animTimerDir;
				}
			}
			this._realFrame = Math.floor(this._animTimer)-1;
			this._currentFrame = anim.frames[this._realFrame];
		}
	}
}

/**
 * Plays the animation
 */
baa.sprite.playAnimation = function () {
	this._animPlaying = true;
}

/**
 * Pauses the animation
 */
baa.sprite.pauseAnimation = function () {
	this._animPlaying = false;
}

/**
 * Stops the animation, and goes back to the first frame.
 */
baa.sprite.stopAnimation = function () {
	this._animPlaying = false;
	this.setAnimationFrame(1);
}

/**
 * Sets the frame to 1, and plays the animation.
 */
baa.sprite.replayAnimation = function () {
	this._animPlaying = true;
	this.setAnimationFrame(1);
	this._animEnded = false;
}

/**
 * Whether the animation has ended
 */
baa.sprite.hasAnimationEnded = function () {
	return this._animEnded;
}

/**
 * Whether the animation is playing
 */
baa.sprite.isAnimationPlaying = function () {
	return this._animPlaying;
}

/**
 * Sets the animation to be played. Has no effect when the current animation is the same as the given one. Unless you use force.
 * @param {string} anim  The name of the animation
 * @param {boolean} force Forces the animation to be set to the given animation, even when the current animiation is already the given one.
 */
baa.sprite.setAnimation = function (anim, force) {
	baa._checkType("anim",anim,"string");
	baa._checkType("force",force,"boolean",null);

	if (this._currentAnim != anim || force) {
		this._currentAnim = anim;
		this._animEnded = false;
		this._animPlaying = true;
		this._frameTimer = this._animations[anim].frames[0];
		this._frameTimerDir = 1;
		this._realFrame = 1;
		this._animTimer = 1;
	}
}

/**
 * Returns the name of the current animation
 * @return {string} The current animation

 */
baa.sprite.getAnimation = function () {
	return this._currentAnim;
}

/**
 * Sets the frame of the animation
 * @throws {Error} If frame is higher than the number of frames the current animation has.
 * @param {number} frame The frame to set
 */
baa.sprite.setAnimationFrame = function (frame) {
	baa._checkType("frame",frame,"number");

	var anim = this._animations[this._currentAnim];
	if (anim.numberOfFrames < frame) {
		throw("There are only " + anim.numberOfFrames +" frames. Not " + frame);
	}
	this._currentFrame = frame;
	this._frameTimer = frame;
}

/**
 * Returns the current frame
 * @return {number} The current frame
 */
baa.sprite.getAnimationFrame = function () {
	return this._realFrame + 1;
}

//TODO: Maybe seperate animation from sprite, to be its own class



//Entity
//////////////////////////////

/**
 * An entity class. Extends baa.sprite with collision-handling and movement.
 * @constructor
 * @property {baa.rect} last The previous values of the entity. Useful for checking direction.
 * @property {baa.point} velocity The velocity the entity moves with
 * @property {baa.point} accel The amount the entity accelerates with. The higher the value, the fast the entity accelerates.
 * @property {baa.point} drag The amount of drag the entity has. Is only used when accel[axis] is 0. The higher the value, the faster the entity slows down. 
 * @property {baa.point} bounce How much the entity should bounce when colliding. 2 would make it go twice as fast.
 * @property {number} separatePriority This decides which of the colliding entities will be moved from it's original position. The lower priority will be moved.
 * @property {boolean} solid If false, the entity will not handle collision, and is not effected by other solid objects.
 * @property {boolean} dead If true, the entity wil lstop updating and drawing, and has no collision anymore with other entities. 
 * @param {number} [x=0] The horizontal position
 * @param {number} [y=x] The vertical position
 * @param {number} [width=0] The width
 * @param {number} [height=width] The height
 */
baa.entity = baa.sprite.extend("baa.entity");

baa.entity.init = function (x,y,w,h) {
	baa.entity.super.init(this,x,y,w,h);
	this.last = baa.rect.new(x,y,w,h);
	this.velocity = baa.point.new();
	this.maxVelocity = baa.point.new(99999,99999);
	this.accel = baa.point.new();
	this.drag = baa.point.new();
	this.bounce = baa.point.new();

	this.separatePriority = 0;
	this.solid = true;
	this.dead = false;
}

/**
 * Updates the entity
 */
baa.entity.update = function () {
	baa.entity.super.update(this);
	this.updateMovement();
}

/**
 * Draws the entity. If baa.debug is active, it will call baa.entity.drawDebug as well.
 */
baa.entity.draw = function () {
	baa.entity.super.draw(this);
}

/**
 * Updates the movement. Acceleration is added to the velocity. The position moves with velocity, and the velocity is lowered with drag.
 */
baa.entity.updateMovement = function () {
	this.last.clone(this);

	this.velocity.x += this.accel.x * dt;
	if (Math.abs(this.velocity.x) > this.maxVelocity.x) {
		this.velocity.x = this.maxVelocity.x * (this.velocity.x > 0 ? 1 : -1);
	}
	this.x += this.velocity.x * dt;
	if (this.accel.x == 0 && this.velocity.x != 0 && this.drag.x != 0) {
		if (this.drag.x * dt > Math.abs(this.velocity.x)) {
			this.velocity.x = 0;
		}
		else {
			this.velocity.x += this.drag.x * dt * (this.velocity.x>0 ? -1 : 1);
		}
	}

	this.velocity.y += this.accel.y * dt;

	if (Math.abs(this.velocity.y) > this.maxVelocity.y) {
		this.velocity.y = this.maxVelocity.y * (this.velocity.y > 0 ? 1 : -1);
	}

	this.y += this.velocity.y * dt;

	if (this.accel.y == 0 && this.velocity.y != 0 && this.drag.y != 0) {
		if (this.drag.y * dt > Math.abs(this.velocity.y)) {
			this.velocity.y = 0;
		}
		else {
			this.velocity.y += this.drag.y * dt * (this.velocity.y>0 ? -1 : 1);
		}
	}
}

/**
 * Checks if there is collision with the given entity, and calls baa.entity.onOverlap if so.
 * @param  {baa.entity} e The entity you want to check collision with
 */
baa.entity.resolveCollision = function (e) {
	if (this.overlaps(e)) {
		this.onOverlap(e);
	}
}

/**
 * Extends baa.rect.overlaps by checking if both entities aren't dead.
 * @param  {baa.entity} e The entity you want to check collision with
 * @return {boolean}   If there is collision
 */
baa.entity.overlaps = function (e) {
	// print(e.dead);
	return this!= e && !this.dead && !e.dead && baa.entity.super.overlaps(this,e);
}

/**
 * Called by baa.entity.resolveCollision when there is overlap. Calls baa.entity.separate if both entities are solid.
 * @param  {baa.entity} e The entity there is overlap with
 */
baa.entity.onOverlap = function (e) {
	if (this.solid && e.solid) {
		this.separate(e);
	} 
}

/**
 * Calls baa.entity.separateAxis. This wrapper handles the arguments it gives by checking if there was also overlap with this.last and e.last.
 * @param  {baa.entity} e The entity to separate from
 * @return {[type]}   [description]
 */
baa.entity.separate = function (e) {
	this.separateAxis(e, this.last.overlapsY(e.last) ? "x" : "y");
}

/**
 * Separates itself from the collided entity, or the other way around, based on their separatePriority.
 * @param  {baa.entity} e The entity to separate from
 * @param  {string} a The axis used to seperate from the entity
 */
baa.entity.separateAxis = function (e, a) {
	var s = (a == "x") ? "width" : "height";
	if (this.separatePriority >= e.separatePriority) {
		if ((e.last[a] + e.last[s] / 2) < (this.last[a] + this.last[s] / 2)) {
			e[a] = this[a] - e[s];
		}
		else {
			e[a] = this[a] + this[s];
		}
		e.velocity[a] = e.velocity[a] * -e.bounce[a];
	}
	else {
		e.separateAxis(this, a);
	}
}


//Button
//////////////////////////////

/**
 * A button that can call functions when you click on it. You can make the shape of the button either squared or round.
 * By default, buttons won't activate until you release them.
 * @constructor
 * @property {string} shape The shape of the button. The default shape can be set by changing baa.button.defaultShape.
 * @property {boolean} hold If the button is currently hold down.
 * @property {object} obj The object that is used for calling the function.
 * @property {function|string} func The function you want to call when the button is pressed.
 * @property {function|string} func The function you want to call when the button is pressed.
*  @property {boolean} [onRelease=true] If the button should be activated on release. If this is false, it will be activated on press.
*  @property {string|array} [buttons="l"] What button(s) can activate this button.
 * This can either be the name of the function as string, or a function on its own.
 * @param {number} x The horizontal position of the button. 
 * @param {number} y The vertical position of the button.
 * @param {object} [obj] The object that is used for calling the function.
 * @param {function|string} [func] The function you want to call when the button is pressed.
 * This can either be the name of the function as string, or a function on its own. 
 * @param {string} [shape] The shape of the button. The default shape can be set by changing baa.button.defaultShape.
 * @param {boolean} [onRelease=true] If the button should be activated on release. If this is false, it will be activated on press. 
 */
baa.button = baa.sprite.extend("baa.button");

/**
 * The default shape. This is normally "rectangle", but can be changed to "circle" if you have a lot of round buttons.
 */
baa.button.defaultShape = "rectangle";

baa.button.init = function (x,y,obj,func,shape,onRelease,buttons) {
	baa.button.super.init(this,x,y);
	baa._checkType("object",obj,"object");
	baa._checkType("function",func,"function","string");
	baa._checkType("shape",shape,"string",null);
	this.shape = shape || baa.button.defaultShape;
	this.hold = false;
	this.obj = obj;
	this.func = func;
	this.onRelease = onRelease || true;
	this.buttons = buttons || "l";
}

/**
 * Updates the button
 */
baa.button.update = function () {
	baa.button.super.update(this);
	if (this.overlaps(baa.mouse)) {
		baa.mouse.setCursor("hand");
		if (this.image) { this.setAnimation("hover"); };
		if (baa.mouse.isPressed("l")) {
			this.hold = true;
		}
	}
	else {
		if (this.image) {this.setAnimation("idle"); }
	}

	if (this.hold) {
		if (this.image) { this.setAnimation("hold"); }
	}

	if ( ( this.onRelease && baa.mouse.isReleased("l") ) || (!this.onRelease && baa.mouse.isPressed("l")) ) {
		if (this.hold && this.overlaps(baa.mouse)) {
			this._active();
			if (this.image) { this.setAnimation("active") };
		}
		this.hold = false;
	} 
}

/**
 * Sets an image. The frames will be used to create the following animations:
 * "idle", when the mouse is not on the button. "hover", when you're hovering over the button.
 * "hold", when you're holding your mouse down on the button.  "release", when you release the button.
 * @param {string} url    The name of image.
 * @param {number} width  The width of each frame.
 * @param {nubmer} height The height of each frame.
 */
baa.button.setImage = function (url,width,height) {
	baa.button.super.setImage(this,url,width,height);
	if (this.shape == "circle") {
		this.offset.x = -this.origin.x;
		this.offset.y = -this.origin.y;
	}

	var a1, a2, a3;
	a1 = this._frames.length > 1 ? 2 : 1;
	a2 = this._frames.length > 2 ? 3 : a1;
	a3 = this._frames.length > 3 ? 4 : a2;
	
	this.addAnimation("idle",[1]);
	this.addAnimation("hover",[a1]);
	this.addAnimation("hold",[a2]);
	this.addAnimation("active",[a3]);
}

/**
 * This is called when the button is clicked, and calls the function that is set.
 */
baa.button._active = function () {
	baa.util.call(this.obj,this.func);
}

/**
 * Sets the function button needs to call when activated
 */
baa.button.setFunction =  function (func) {
	this.func = func;
}


///////////////////////////////
///////////////////////////////

//Graphics

/**
 * Handles everything you see on the screen
 * @constructor
 * @type {object}
 */
baa.graphics = {};

/**
 * The default context
 * @type {object}
 */
baa.graphics._defaultCtx = null;

/**
 * The default canvas
 * @type {object}
 */
baa.graphics._defaultCanvas = null;

/**
 * The default smoothing
 * @type {boolean}
 */
baa.graphics._defaultSmooth = false;

/**
 * The default font
 * @type {baa._font}
 */
baa.graphics._defaultFont;

/**
 * The scale of the game.1
 * @type {Number}
 */
baa.graphics._globalScale = 1;

/**
 * The current canvas
 * @type {object}
 */
baa.graphics._currentCanvas = null;

/**
 * All the preloaded images
 * @see  baa.graphics.preload
 * @type {object}
 */
baa.graphics._images = {};

/**
 * The color to use with drawing
 * @see  baa.graphics.setColor
 * @type {object}
 */
baa.graphics._color = {r:255,g:255,b:255,a:1};

/**
 * The background color
 * @see  baa.graphics.setBackgroundColor
 * @type {object}
 */
baa.graphics._backgroundColor = {r:0,g:0,b:0};

/**
 * The current font
 * @type {baa.graphics._font}
 */
baa.graphics._currentFont = null;

/**
 * A number that mimics the number of stack created and destroyed by baa.graphics.push and baa.graphics.pop.
 * @type {Number}
 */
baa.graphics._stacks = 0;

/**
 * The width of the canvas
 */
baa.graphics.width = 0;

/**
 * The height of the canvas
 */
baa.graphics.height = 0;

/**
 * Use this to preload images. Assumes all images are in the folder images/
 * @param {string} ext The extension of the images. Examples: "png", "gif", "jpg"
 * @param {string} ... Names of the images. Example: "player", "logo", "enemy" NOT: "images/player.png", "images/logo", "enemy.png"
 */
baa.graphics.preload = function (ext) {
	var ext = "." + ext
	for (var i = 1; i < arguments.length; i++) {
		var name = arguments[i];
		var img;
		img = new Image();
		img.onload = function(){
			baa._assetsLoaded++;
		}
		img.src = "images/" + name + ext;
		this._images[name] = img;
		baa._assetsToBeLoaded++;
		
	}
}

//Drawing functions

/**
 * Draws a rectangle
 * @param  {string} mode Whether to draw the rectangle filled, in lines, or both.
 * @param  {number|baa.rectangle} x    The horizontal position OR an object of type baa.rect. Using an object changes y in r, and ignores the other arguments.
 * @param  {number} [y]    The vertical position
 * @param  {number} [w]    The width
 * @param  {number} [h]    The height
 * @param  {number} [r]    The rounding
 */
baa.graphics.rectangle = function (mode,x,y,w,h,r) {
	baa._checkType("mode",mode,"string");
	baa._checkType("x",x,"number","baa.rect");
	

	if (Class.isClass(x) && x.is(baa.rect)) {
		r = y;
		y = x.y;
		w = x.width;
		h = x.height;
		x = x.x;
	}

	baa._checkType("y",y,"number");
	baa._checkType("width",w,"number");
	baa._checkType("height",h,"number");
	baa._checkType("rounding",r,"number",null);

	if (mode != "scissor") { this.ctx.beginPath(); }
	
	if (r==null) {
		h = h==null ? w : h;
		this.ctx.rect(x,y,w,h);
		this._mode(mode);
	}
	else {
		r = Math.min(7,Math.max(0,r));
		r*=Math.min(w/25,h/25);
		x += r;
		w -= r*2;
		y += r;
		h -= r*2;

		this.ctx.moveTo(x+r, y-r);
		this.ctx.lineTo(x+w-r, y-r);
		this.ctx.quadraticCurveTo(x+w+r, y-r, x+w+r, y+r);
		this.ctx.lineTo(x+w+r, y+h-r);
		this.ctx.quadraticCurveTo(x+w+r, y+h+r, x+w-r, y+h+r);
		this.ctx.lineTo(x+r, y+h+r);
		this.ctx.quadraticCurveTo(x-r, y+h+r, x-r, y+h-r);
		this.ctx.lineTo(x-r, y+r);
		this.ctx.quadraticCurveTo(x-r, y-r, x+r, y-r);
		this._mode(mode);
	}

	if (baa.debug) { baa.debug.drawCalls++; };
}

/**
 * Draws a circle
 * @param  {string} mode Whether to draw the circle filled, in lines, or both.
 * @param  {number|baa.circle} x    The horizontal position OR an object of type baa.circle. Using an object ignores the other arguments.
 * @param  {number} y    The vertical position
 * @param  {number} r    The radius of the circle
 */
baa.graphics.circle = function (mode,x,y,r) {
	baa._checkType("mode",mode,"string");
	baa._checkType("x",x,"number","baa.circle");

	if (Class.isClass(x) && x.is(baa.circle)) {
		y = x.y;
		r = x.size;
		x = x.x;
	}

	baa._checkType("y",y,"number");
	baa._checkType("r",r,"number");

	if (mode != "scissor") { this.ctx.beginPath(); }

	this.ctx.arc(x,y,Math.abs(r),0,2*Math.PI);
	this._mode(mode);

	if (baa.debug) { baa.debug.drawCalls++; };
}

/**
 * Draws a convex
 * @param  {string} mode Whether to draw the convex filled, in lines, or both.
 * @param  {number} x    The horizontal position
 * @param  {number} y    The vertical position
 * @param  {number} r    The radius of the convex
 * @param  {number} p 	 The number of points the convex should have
 * @param  {number} rot  The rotation of the convex in radians
 */
baa.graphics.convex = function (mode,x,y,r,p,rot) {
	baa._checkType("mode",mode,"string");
	baa._checkType("x",x,"number");
	baa._checkType("y",y,"number");
	baa._checkType("r",r,"number");
	baa._checkType("p",p,"number");

	p = Math.max(3,p);

	if (mode != "scissor") { this.ctx.beginPath(); }

	for (var i = 0; i < p; i++) {
		this.ctx.lineTo(x+Math.cos((i*(360/p))/180 *Math.PI + rot)*r,
						y+Math.sin((i*(360/p))/180 *Math.PI + rot)*r);
	}
	this.ctx.lineTo(x+Math.cos((i*(360/p))/180 *Math.PI + rot)*r,
					y+Math.sin((i*(360/p))/180 *Math.PI + rot)*r);
	this._mode(mode);

	if (baa.debug) { baa.debug.drawCalls++; };
}

/**
 * Draws a star
 * @param  {string} mode Whether to draw the star filled, in lines, or both.
 * @param  {number} x    The horizontal position
 * @param  {number} y    The vertical position
 * @param  {number} r1   The inner radius
 * @param  {number} r2   The outer radius
 * @param  {number} p    The number of points the star should have
 * @param  {number} r    The rotation of the star in radians
 */
baa.graphics.star = function (mode,x,y,r1,r2,p,r) {
	baa._checkType("mode",mode,"string");
	baa._checkType("x",x,"number");
	baa._checkType("y",y,"number");
	baa._checkType("r1",r1,"number");
	baa._checkType("r2",r2,"number");
	baa._checkType("p",p,"number");
	baa._checkType("r",r,"number",null);

	r = r || 0;

	p = Math.max(3,p);
	if (mode != "scissor") { this.ctx.beginPath(); }

	for (var i = 0; i < p; i++) {
		this.ctx.lineTo(x+Math.cos((i*(360/p))/180 *Math.PI + r)*r1,
						y+Math.sin((i*(360/p))/180 *Math.PI + r)*r1);

		this.ctx.lineTo(x+Math.cos((i*(360/p)+(180/p))/180 *Math.PI + r)*r2,
						y+Math.sin((i*(360/p)+(180/p))/180 *Math.PI + r)*r2);

	}
	this.ctx.lineTo(x+Math.cos((i*(360/p))/180 *Math.PI + r)*r1,
					y+Math.sin((i*(360/p))/180 *Math.PI + r)*r1);

	this._mode(mode);

	if (baa.debug) { baa.debug.drawCalls++; };
}

/**
 * Draws an arc, a part of a circle
 * @param  {string} mode Whether to draw the arc filled, in lines, or both.
 * @param  {number} x    The horizontal position
 * @param  {number} y    The vertical position
 * @param  {number} r    The radius of the arc
 * @param  {number} a1   The start of the arc
 * @param  {number} a2   The end of the arc
 */
baa.graphics.arc = function (mode,x,y,r,a1,a2) {
	baa._checkType("mode",mode,"string");
	baa._checkType("x",x,"number");
	baa._checkType("y",y,"number");
	baa._checkType("r",r,"number");
	baa._checkType("a1",a1,"number");
	baa._checkType("a2",a2,"number");

	if (mode != "scissor") { this.ctx.beginPath(); }

	this.ctx.lineTo(x,y);
	this.ctx.arc(x,y,Math.abs(r),a1,a2);
	this.ctx.lineTo(x,y);
	this._mode(mode);
	
	if (baa.debug) { baa.debug.drawCalls++; };
}

/**
 * Draws a line
 * @param {array|number} points An array of numbers, x and y alternately, or a number, assuming all numbers are in arguments.
 * @param {number} ... The x and y of the points the lines goes to alternately
 */
baa.graphics.line = function () {
	this.ctx.beginPath();
	if (typeof(arguments[0]) == "object") {
		var verts = arguments[0];

		baa._checkType("verts",verts[0],"number",null);
		baa._checkType("verts",verts[1],"number",null);
	
		this.ctx.moveTo(verts[0],verts[1]);
		for (var i = 0; i < verts.length-2; i+=2) {
		
			baa._checkType("verts",verts[i+2],"number",null);
			baa._checkType("verts",verts[i+3],"number",null);
		
			this.ctx.lineTo(verts[i+2],verts[i+3]);
		};
		
	}
	else {
		baa._checkType("verts",arguments[0],"number",null);
		baa._checkType("verts",arguments[1],"number",null);
		
		this.ctx.moveTo(arguments[0],arguments[1]);
		for (var i = 0; i < arguments.length-2; i+=2) {

			baa._checkType("verts",arguments[i+2],"number",null);
			baa._checkType("verts",arguments[i+3],"number",null);
		
			this.ctx.lineTo(arguments[i+2],arguments[i+3]);
		};
	}
	this.ctx.stroke();

	if (baa.debug) { baa.debug.drawCalls++; };
}

/**
 * Draws a polygon
 * @param  {string} mode Whether to draw the polygon filled, in lines, or both.
 * @param {array|number} points An array of numbers, x and y alternately, or a number, assuming all numbers are in arguments.
 * @param {number} ... The x and y of the points the polygon goes to alternately
 */
baa.graphics.polygon = function (mode) {
	baa._checkType("mode",mode,"string");

	if (mode != "scissor") { this.ctx.beginPath(); }
	
	if (typeof(arguments[1]) == "object") {
		var verts = arguments[1];

		baa._checkType("verts",verts[1],"number",null);
		baa._checkType("verts",verts[2],"number",null);
	
		this.ctx.moveTo(verts[1],verts[2]);
		for (var i = 1; i < verts.length-2; i+=2) {
		
			baa._checkType("verts",verts[i+2],"number",null);
			baa._checkType("verts",verts[i+3],"number",null);
		
			this.ctx.lineTo(verts[i+2],verts[i+3]);
		};
		
	}
	else {
		baa._checkType("verts",arguments[1],"number",null);
		baa._checkType("verts",arguments[2],"number",null);
		
		this.ctx.moveTo(arguments[1],arguments[2]);
		for (var i = 0; i < arguments.length-2; i+=2) {

			baa._checkType("verts",arguments[i+2],"number",null);
			baa._checkType("verts",arguments[i+3],"number",null);
		
			this.ctx.lineTo(arguments[i+2],arguments[i+3]);
		};
	}
	this.ctx.closePath();
	this._mode(mode);

	if (baa.debug) { baa.debug.drawCalls++; };
}

/**
 * Clears the canvas, and draws the background
 */
baa.graphics.clear = function () {
	this.push();
	this.origin();
	this.ctx.fillStyle = this._rgb(this._backgroundColor.r,this._backgroundColor.g,this._backgroundColor.b);
	this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
	this.ctx.fillStyle = this._rgb(this._color.r,this._color.g,this._color.b);
	this.pop();
	if (baa.debug) { baa.debug.drawCalls++; };
}

/**
 * Draws text. If the second argument is a string, it will use alignment, else, it will assume the first argument is x.
 * @param  {string} t     The text to draw
 * @param  {string} [align] Use this for text-alignment. Options: "left", "center" and "right". 
 * Using a number here will take this argument as x, will take limit as y, and shift all the arguments.
 * @param  {string} [limit] [description]
 * @param  {number} [x=0]     The horizontal position
 * @param  {number} [y=x]     The vertical position
 * @param  {number} [r=0]     The rotation in radians
 * @param  {number} [sx=0]    The horizontal scaling
 * @param  {number} [sy=sx]    The vertical scaling
 * @param  {number} [ox=0]    The horizontal origin. The origin point is from where the text rotates and scales.
 * @param  {number} [oy=ox]    The vertical origin. The origin point is from where the text rotates and scales.
 * @param  {number} [kx=0]    The horizontal shearing factor
 * @param  {number} [ky=kx]    The vertical shearing factor
 */
baa.graphics.print = function (t,align,limit,x,y,r,sx,sy,ox,oy,kx,ky) {
	if (typeof(align) == "number") {
		this._print(t,"left",align,limit,x,y,r,sx,sy,ox,oy);
	}
	else {
		this._print(t,align,x,y,r,sx,sy,ox,oy,kx,ky,limit);
	}

	if (baa.debug) { baa.debug.drawCalls++; };
}

/**
 * Psst, baa.graphics.print is actually a wrapper, to call this function with the correct arguments. But don't tell anyone.
 */
baa.graphics._print = function (t,align,x,y,r,sx,sy,ox,oy,kx,ky,limit) {
	baa._checkType("text",t,"string","number",null);
	baa._checkType("align",align,"string",null);
	baa._checkType("x",x,"number",null);
	baa._checkType("y",y,"number",null);
	baa._checkType("r",r,"number",null);
	baa._checkType("sx",sx,"number",null);
	baa._checkType("sy",sy,"number",null);
	baa._checkType("ox",ox,"number",null);
	baa._checkType("oy",oy,"number",null);
	baa._checkType("kx",kx,"number",null);
	baa._checkType("ky",ky,"number",null);
	baa._checkType("limit",limit,"number",null);

	x = x == null ? 0 : x;
	y = y == null ? x : y;
	r = r == null ? 0 : r;
	sx = sx == null ? 1 : sx;
	sy = sy == null ? sx : sy;
	ox = ox == null ? 0 : ox;
	oy = oy == null ? ox : oy;
	kx = kx == null ? 0 : kx;
	ky = ky == null ? kx : ky;
	this.ctx.textAlign=align;
	if (limit!=null) {
		t = t + '';
		var words = t.split(' ');
		var line = '';
		for(var i = 0; i < words.length; i++) {
			var testLine = line + words[i] + ' ';
			var metrics = this.ctx.measureText(testLine);
			var testWidth = metrics.width;
			if (testWidth > limit && i > 0) {
				this.ctx.save();
				this.ctx.transform(1,ky,kx,1,0,0);
				this.ctx.translate(x,y);
				this.ctx.scale(sx,sy);
				this.ctx.rotate(r);
				this.ctx.fillText(line, -ox,-oy+this._currentFont.size);
				this.ctx.restore();
				line = words[i] + ' ';
				y += this._currentFont.height+sy;
			}
			else {
				line = testLine;
			}
		}
	}
	else {
		line = t;
	}
	this.ctx.save();
	this.ctx.transform(1,ky,kx,1,0,0);
	this.ctx.translate(x,y);
	this.ctx.scale(sx,sy);
	this.ctx.rotate(r);
	this.ctx.fillText(line, -ox,-oy+this._currentFont.size);
	this.ctx.restore();
	this.ctx.textAlign="left";
}

/**
 * Draws an image. If the second argument is an object, a quad, it will draw only part of the image. Else, it will assume the second argument is x.
 * @throws {Error} If img is a non-existing image.
 * @param  {baa.graphics._image|string} img  The image you want draw, or a string of the name of the image.
 * @param  {object} [quad] An object with an x, y, width and height. 0, 0, 32, 32 would be the top left part of the image, and a 32x32 rectangle. 
 * Using a number here will take this argument as x, and shift all the arguments.  
 * @param  {number} [x=0]     The horizontal position
 * @param  {number} [y=x]     The vertical position
 * @param  {number} [r=0]     The rotation in radians
 * @param  {number} [sx=0]    The horizontal scaling
 * @param  {number} [sy=sx]    The vertical scaling
 * @param  {number} [ox=0]    The horizontal origin. The origin point is from where the text rotates and scales.
 * @param  {number} [oy=ox]    The vertical origin. The origin point is from where the text rotates and scales.
 * @param  {number} [kx=0]    The horizontal shearing factor
 * @param  {number} [ky=kx]    The vertical shearing factor
 */
baa.graphics.draw = function (img,quad,x,y,r,sx,sy,ox,oy,kx,ky) {
	if (typeof(quad) != "object") {
		this._draw(img,quad,x,y,r,sx,sy,ox,oy,kx,ky);
	}
	else{
		this._draw(img,x,y,r,sx,sy,ox,oy,kx,ky,quad);
	}

	if (baa.debug) { baa.debug.drawCalls++; };
}

/**
 * Psst, baa.graphics.draw is actually a wrapper, to call this function with the correct arguments. But don't tell anyone.
 */
baa.graphics._draw = function (img,x,y,r,sx,sy,ox,oy,kx,ky,quad) {
	baa._checkType("image",img,"baa.graphics.image","string");
	baa._checkType("x",x,"number",null);
	baa._checkType("y",y,"number",null);
	baa._checkType("r",r,"number",null);
	baa._checkType("sx",sx,"number",null);
	baa._checkType("sy",sy,"number",null);
	baa._checkType("ox",ox,"number",null);
	baa._checkType("oy",oy,"number",null);
	baa._checkType("kx",kx,"number",null);
	baa._checkType("ky",ky,"number",null);
	baa._checkType("quad",quad,"object",null);
	
	var url = typeof(img) == "string" ? img : img.url;
	if (this._images[url]==null) {
		throw("The image " + img + " doesn't exist. Did you forget to preload it?");
	}

	x = x == null ? 0 : x;
	y = y == null ? x : y;
	r = r == null ? 0 : r;
	sx = sx == null ? 1 : sx;
	sy = sy == null ? sx : sy;
	ox = ox == null ? 0 : ox;
	oy = oy == null ? ox : oy;
	kx = kx == null ? 0 : kx;
	ky = ky == null ? kx : ky;

	var smooth = img.smooth == null ? this._defaultSmooth : img.smooth;
	this.ctx.imageSmoothingEnabled = smooth;
	this.ctx.mozImageSmoothingEnabled = smooth;
	this.ctx.oImageSmoothingEnabled = smooth;
	this.ctx.save();
	this.ctx.transform(1,ky,kx,1,0,0);
	this.ctx.translate(x,y);
	this.ctx.scale(sx,sy);
	this.ctx.rotate(r);
	if (quad) {
		this.ctx.drawImage(this._images[url],quad.x,quad.y,quad.width,quad.height,-ox,-oy,quad.width,quad.height);
	}
	else{
		this.ctx.drawImage(this._images[url],-ox,-oy);
	}
	this.ctx.restore();
	this.ctx.imageSmoothingEnabled = this.defaultFilter == "linear";
}



//image
///////////////////

/**
 * An image object. Makes it able to read data of the image, and set smoothing for specific images.
 * @constructor
 * @throws {Error} If url is a non-existing image.
 * @param {string} url The url of the image
 * @param {boolean} [smooth=null] The smoothing of the image.
 * @property {string} url The url of the image.
 * @property {boolean} smooth The smoothing of the image. If this is null, default smoothing will be used instead. This can be set with baa.graphics.setSmooth.
 */
baa.graphics._image = Class.extend("baa.graphics.image");

baa.graphics._image.init = function (url,smooth) {
	baa._checkType("url",url,"string");
	baa._checkType("smooth",smooth,"boolean",null);
	if (baa.graphics._images[url]==null) { throw ("Image '" + url + "' doesn't exist. Did you forgot to preload it?")}
	this.url = url;
	this.smooth = smooth;
}

/**
 * Draws the image.
 * @see  baa.graphics.draw
 */
baa.graphics._image.draw = function (quad,x,y,r,sx,sy,ox,oy,kx,ky) {
	baa.graphics.draw(this,quad,x,y,r,sx,sy,ox,oy,kx,ky);
}

/**
 * Sets the smoothing of the image
 * @param {boolean} smooth If the image should use smoothing or not.
 */
baa.graphics._image.setSmooth = function (smooth) {
	baa._checkType("smooth",smooth,"boolean",null);
	return this.smooth = smooth;
}

/**
 * Returns the current smoothing of the image. Returns null if no smoothing is assigned yet.
 * @return {boolean|null} The smoothing of the image
 */
baa.graphics._image.getSmooth = function () {
	return this.smooth;
}

/**
 * Returns the width of the image.
 * @return {number} The width of the image.
 */
baa.graphics._image.getWidth = function () {
	return baa.graphics._images[this.url].width;
}

/**
 * Returns the height of the image.
 * @return {number} The height of the image.
 */
baa.graphics._image.getHeight = function () {
	return baa.graphics._images[this.url].height;
}

/**
 * Creates a new image. This is used to keep image a private object.
 * @see  baa.graphics._image
 * @return {baa.graphics._image} The new image
 */
baa.graphics.newImage = function (url,smooth) {
	return this._image.new(url, smooth);
}


//font
/////////////////

/**
 * A font object. Allows you to set the size and height of a font. Fonts are loaded in CSS.
 * @example
 *  <style>
 *  @font-face {
 *      font-family: "score";
 *      src: url(fonts/score.otf);
 *  }
 *  </style>
 *
 * baa.graphics.newFont("score",12);
 * @constructor
 * @alias baa.graphics.font
 * @param {string} name The name of the font.
 * @param {number} size The size of the font.
 * @param {string} [style="normal"] The style of the font. Options: "normal", "italic" and "oblique".
 * @param {number} [height=size*2]  The height of the font. This will be used when using alignment and limit for multilining.
 * @property {string} name The name of the font.
 * @property {number} size The size of the font.
 * @property {string} style The style of the font. Options: "normal", "italic" and "oblique".
 * @property {number} height  The height of the font. This will be used when using alignment and limit for multilining.
 */
baa.graphics._font = Class.extend("baa.graphics.font");

baa.graphics._font.init = function (name,size,style,height) {
	baa._checkType("name",name,"string");
	baa._checkType("size",size,"number");
	baa._checkType("style",style,"string",null);
	baa._checkType("height",height,"number",null);

	this.name = name;
	this.size = size;
	this.style = style || "normal";
	this.height = height==null ? size*2 : height;
}

/**
 * Sets the size of the font
 * @param {number} size The size of the font
 */
baa.graphics._font.setSize = function (size) {
	baa._checkType("size",size,"number");
	this.size = size;
	baa.graphics._resetFont();
	return this.size;
}

/**
 * Returns the size of the font
 * @return {number} The size of the font
 */
baa.graphics._font.getSize = function () {
	return this.size;
}

/**
 * Sets the height of the font
 * @param {number} height The height of the font
 */
baa.graphics._font.setHeight = function (height) {
	baa._checkType("height",height,"number");
	this.height = height;
	baa.graphics._resetFont();
	return this.height;
}

/**
 * Returns the height of the font
 * @return {number} The height of the font
 */
baa.graphics._font.getHeight = function () {
	return this.height;
}

/**
 * Creates a new font. This is used to keep font a private object.
 * @see  baa.graphics._image
 * @return {baa.graphics._image} The new image
 */
baa.graphics.newFont = function (name,size,style,height) {
	return this._font.new(name,size,style,height);
}

baa.graphics._defaultFont = baa.graphics.newFont("arial",10);

//Canvas
/////////////////

/**
 * Everything is drawn on a canvas. You can create your own canvas, draw stuff on that canvas, and then draw the canvas on the real canvas.
 * @constructor
 * @param {number} width The width of the canvas.
 * @param {number} height The height of the canvas.
 * @param {boolean} smooth If the cnavas should draw everything smooth on default.
 * @property {object} drawable The canvas itself.
 * @property {object} context The context of drawable. This is used to draw everything on the canvas.
 * @property {boolean} [smooth=false] If the canvas should draw everything smooth on default.  
 */
baa.graphics._canvas = Class.extend("baa.graphics.canvas");

baa.graphics._canvas.init = function (width,height,smooth) {
	baa._checkType("width",width,"number");
	baa._checkType("height",height,"number");
	baa._checkType("smooth",smooth,"boolean",null);

	this.drawable = document.createElement('canvas');
	this.context = this.drawable.getContext('2d');
	this.smooth = smooth || false;
	width = Math.max(0,width);
	height = Math.max(0,height);
	this.drawable.width = width;
	this.drawable.height = height;
}

/**
 * Returns the width of the canvas.
 * @return {number} The width of the canvas.
 */
baa.graphics._canvas.getWidth = function () {
	return this.drawable.width;
}

/**
 * Returns the height of the canvas.
 * @return {number} The height of the canvas.
 */
baa.graphics._canvas.getHeight = function () {
	return this.drawable.height;
}

/**
 * Sets the width of the canvas
 * @param {number} width The width of the canvas
 */
baa.graphics._canvas.setWidth = function (width) {
	baa._checkType("width",width,"number");
	width = Math.max(0,width);
	return this.drawable.width = width;
}

/**
 * Sets the height of the canvas
 * @param {number} height The height of the canvas
 */
baa.graphics._canvas.setHeight = function (height) {
	baa._checkType("height",height,"number");
	height = Math.max(0,height);
	return this.drawable.height = height;
}

/**
 * Sets the default smoothing of the canvas
 * @param {boolean} smooth The default smoothing of the canvas
 */
baa.graphics._canvas.setSmooth = function (smooth) {
	baa._checkType("smooth",smooth,"boolean");
	return this.smooth = smooth;
}

/**
 * Returns the default smoothing of the canvas
 * @return {boolean} The default smoothing of the canvas
 */
baa.graphics._canvas.getSmooth = function () {
	return this.smooth;
}

/**
 * Creates a new canvas. This is used to keep canvas a private object.
 * @see  baa.graphics._canvas
 * @return {baa.graphics._canvas} The new canvas
 */
baa.graphics.newCanvas = function (width,height,smooth) {
	return this._canvas.new(width,height,smooth);
}

////////////////


//Set functions

/**
 * Sets the default smoothing.
 * @param {boolean} smooth The default smoothing.
 */
baa.graphics.setSmooth = function (smooth) {
	baa._checkType("smooth",smooth,"boolean");
	this._defaultSmooth = smooth;
}

/**
 * Sets the color the canvas uses to draw geometry. r, g, and b use numbers between 0 and 255. a (for alpha), uses a number between 0 and 1.
 * @param {number|array} r Red. If this is an array, the function assumes all numbers are in that array, and disregard all the other arguments.
 * @param {number} g Green.
 * @param {number} b Blue.
 * @param {number} a Alpha
 */
baa.graphics.setColor = function (r,g,b,a) {
	if (a && a > 1) { print("Warning: Alpha uses 0 to 1, not 0 to 255!"); }
	if (typeof(r)=="object") {
		baa._checkType("red",r[0],"number",null);
		baa._checkType("green",r[1],"number",null);
		baa._checkType("blue",r[2],"number",null);
		baa._checkType("alpha",r[3],"number",null);
		this._color.r = r[0];
		this._color.g = r[1];
		this._color.b = r[2];
		this._color.a = r[3];
	}
	else {
		baa._checkType("red",r,"number",null);
		baa._checkType("green",g,"number",null);
		baa._checkType("blue",b,"number",null);
		baa._checkType("alpha",a,"number",null);

		this._color.r = r==null ? this._color.r : r;
		this._color.g = g==null ? this._color.g : g;
		this._color.b = b==null ? this._color.b : b;
		this._color.a = a==null ? this._color.a : a;
	}
	this.ctx.fillStyle = this._rgb(this._color.r,this._color.g,this._color.b);
	this.ctx.strokeStyle = this._rgb(this._color.r,this._color.g,this._color.b);
	this.ctx.globalAlpha = this._color.a;
}

/**
 * Sets the alpha the canvas uses to draw geometry and images.
 * @param {number} a The alpha, a number between 0 and 1.
 */
baa.graphics.setAlpha = function (a) {
	baa._checkType("alpha",a,"number");

	this._color.a = Math.min(1,Math.max(0,a));
	return this.ctx.globalAlpha = this._color.a;
}

/**
 * The same as setColor, except for the background. The background color can have no alpha. Uses numbers between 0 and 255.
 * @param {number|array} r Red. If this is an array, the function assumes all numbers are in that array, and disregard all the other arguments.
 * @param {number} g Green.
 * @param {number} b Blue.
 */
baa.graphics.setBackgroundColor = function (r,g,b) {
	if (typeof(r)=="object") {
		baa._checkType("red",r[0],"number",null);
		baa._checkType("green",r[1],"number",null);
		baa._checkType("blue",r[2],"number",null);

		this._backgroundColor.r = r[0] || this._backgroundColor.r;
		this._backgroundColor.g = r[1] || this._backgroundColor.g;
		this._backgroundColor.b = r[2] || this._backgroundColor.b;
	}
	else {
		baa._checkType("red",r,"number",null);
		baa._checkType("green",g,"number",null);
		baa._checkType("blue",b,"number",null);

		this._backgroundColor.r = r==null ? this._backgroundColor.r : r;
		this._backgroundColor.g = g==null ? this._backgroundColor.g : g;
		this._backgroundColor.b = b==null ? this._backgroundColor.b : b;
	}
}

/**
 * Sets the line width the canvas uses to draw geometry. Is standard on 1.
 * @param {number} width The width of line.
 */
baa.graphics.setLineWidth = function (width) {
	baa._checkType("width",width,"number",null);

	this.ctx.lineWidth = width;
}

/**
 * Combines baa.graphics.newFont and baa.graphics.setFont to be able to create and set a new font at the same time
 * @see baa.graphics.newFont
 * @see baa.graphics.setfont
 */
baa.graphics.setNewFont = function (fnt,size,style,height) {
	fnt = this.newFont(fnt,size,style,height);
	this.setFont(fnt);
	return fnt;
}

/**
 * Sets a font the canvas uses for printing text.
 * @param {baa.graphics._font} fnt The font to set
 */
baa.graphics.setFont = function (fnt) {
	baa._checkType("font",fnt,"baa.graphics.font");

	this._currentFont = fnt;
	this.ctx.font = fnt.style + " " + fnt.size + "pt " + fnt.name;

}

/**
 * Sets the blend mode of the canvas. 
 * Options: "source-over", "source-in", "source-out", "source-atop", "destination-over", 
 * "destination-in", "destination-out", "destination-atop", "lighter", "darker", "copy", and "xor".
 * @param {string} mode the blend mode to set.
 */
baa.graphics.setBlendMode = function (mode) {
	baa._checkType("mode",mode,"string");

	this.ctx.globalCompositeOperation = mode;
}

/**
 * Sets the canvas all future draw operations will be drawn on.
 * @see  baa.graphics._canvas
 * @param {baa.graphics._canvas} cvs The canvas to set
 */
baa.graphics.setCanvas = function (cvs) {
	baa._checkType("canvas",cvs,"baa.graphics.canvas",null);

	if (cvs==null) {
		this.ctx = this._defaultCtx;
		this.canvas = this._defaultCanvas;
		this._currentCanvas = null;
	}
	else{
		this.ctx = cvs.context;
		this.canvas = cvs.drawable;
		this._currentCanvas = cvs;
	}
}

/**
 * Cuts out a shape, that makes only things drawn inside this shape to appear on the screen.
 * @param {function} [shape] A function with geometry draw calls. The draw calls must use "scissor" as draw mode.
 * @param {object} obj   The object to call the shape function with.
 */
baa.graphics.setScissor = function (shape,obj) {
	if (shape!=null) {
		this.push();
		this.ctx.beginPath();
		baa.util.call(obj,shape)
		this.ctx.clip();
	}
	else {
		this.pop();
	}
}

//Get functions

/**
 * Returns the default smoothing of the default canvas.
 * @return {[type]} [description]
 */
baa.graphics.getSmooth = function () {
	return this._defaultSmooth;
}

/**
 * Returns the color currently being used to draw geometry. 
 * @return {array} The color currently in use.
 */
baa.graphics.getColor = function () {
	return [this._color.r,this._color.g,this._color.b,this._color.a];
}

/**
 * Returns the alpha the canvas uses for drawing.
 * @return {number} The alpha currently in use.
 */
baa.graphics.getAlpha = function () {
	return this._color.a;
}

/**
 * Returns the background color
 * @return {array} The background color
 */
baa.graphics.getBackgroundColor = function () {
	return [this._backgroundColor.r,this._backgroundColor.g,this._backgroundColor.b];
}

/**
 * Returns the width of the line currently being used to draw geometry.
 * @return {number} The width of the line
 */
baa.graphics.getLineWidth = function () {
	return this.ctx.lineWidth;
}

/**
 * Returns the current font being used to print text.
 * @return {baa.graphics._font} The font currently in use.
 */
baa.graphics.getFont = function () {
	return this.font;
}

/**
 * Returns the current canvas being used to draw on.
 * @return {baa.graphics._canvas} The current canvas in use.
 */
baa.graphics.getCanvas = function () {
	return this.cvs;
}

/**
 * Returns the width of the current canvas.
 * @return {number} The width of the current canvas in use.
 */
baa.graphics.getWidth = function () {
	return this.canvas.width;
}

/**
 * Returns the height of the current canvas.
 * @return {number} The height of the current canvas in use.
 */
baa.graphics.getHeight = function () {
	return this.canvas.height;
}

/**
 * Returns the text width of a sample text.
 * @param  {string} text The text you want to know the width from.
 * @return {number}   The width of the text;
 */
baa.graphics.getTextWidth = function (text) {
	return this.ctx.measureText(text).width;
}


//Coordinate System

/**
 * Removes all the translating, scaling, rotating  and shearing.
 */
baa.graphics.origin = function () {
	this.ctx.setTransform(1, 0, 0, 1, 0, 0);
	this.ctx.scale(baa.graphics._globalScale,baa.graphics._globalScale);
}

/**
 * Moves all drawing operations horizontal with x, and vertical with y. This also sets the origin for .rotate, .scale and .shear.
 * @param  {number} x The horizontal movement
 * @param  {number} y The vertical movement
 */
baa.graphics.translate = function (x,y) {
	baa._checkType("x",x,"number");
	baa._checkType("y",y,"number",null);
	y = y == null ? x : y;
	this.ctx.translate(x,y);
}

/**
 * Rotates all the drawing operations. Note that this rotates the whole canvas (at the top left), and not each drawing operation on its own.
 * @param  {number} r The rotation is radians
 */
baa.graphics.rotate = function (r) {
	baa._checkType("r",r,"number");
	this.ctx.rotate(r);
}

/**
 * Scales all the drawing operations. Note that this scales the whole canvas (at the top left), and not each drawing operation on its own.
 * @param  {number} x The horizontal scaling
 * @param  {number} y The vertical scaling
 */
baa.graphics.scale = function (x,y) {
	baa._checkType("x",x,"number");
	baa._checkType("y",y,"number",null);
	y = y == null ? x : y;
	this.ctx.scale(x,y);
}

/**
 * Scales all the drawing operations. Note that this shears the whole canvas (at the top left), and not each drawing operation on its own.
 * @param  {number} x The horizontal shearing
 * @param  {number} y The vertical shearing
 */
baa.graphics.shear = function (x,y) {
	baa._checkType("x",x,"number");
	baa._checkType("y",y,"number",null);
	y = y == null ? x : y;
	this.ctx.transform(1,y,x,1,0,0);
}

/**
 * Pushes all the current translating, rotating, scaling and shearing on a stack.
 */
baa.graphics.push = function () {
	this.ctx.save();
	this._stacks++;
}

/**
 * Pops the highest stack, removing all translating, rotating, scaling and shearing on that stack.
 */
baa.graphics.pop = function () {
	if (this._stacks > 0) {
		this.ctx.restore();
		this._stacks--;
	}
}

//Utils

/**
 * This is called after every geometry function, to draw the shape filled, in lines or both.
 * @param  {string} mode The fill mode. Options: "fill", "line", "both"
 * @throws {Error} If an invalid mode is used.
 */
baa.graphics._mode = function (mode) {
	baa._checkType("mode",mode,"string");

	if (mode == "fill") {
		this.ctx.fill();
	}
	else if (mode == "line") {
		this.ctx.stroke();
	}
	else if (mode == "both") {
		this.ctx.fill();
		this.ctx.stroke();
	}
	else if (mode != "scissor") {
		throw new Error("Invalid mode " + mode);
	}
}

/**
 * Converts RGB to hex
 * @param  {number} r Red
 * @param  {number} g Green
 * @param  {number} b Blue
 * @return {string}   The color in hex
 */
baa.graphics._rgb = function (r,g,b) {
	var x = ((r << 16) | (g << 8) | b).toString(16);
	return "#000000".substring(0, 7 - x.length) + x;
}

/**
 * Resets the font. This is called whenever a change to a font is made.
 */
baa.graphics._resetFont = function () {
	this.ctx.font = this._currentFont.size + "pt " + this._currentFont.name;
}


//Audio

/**
 * The audio module takes care of everything you hear, and everything with sound. The audio, volume, pitch.
 * @constructor
 */
baa.audio = {};

/**
 * All the audio files.
 * @see  baa.audio.preload
 */
baa.audio._sources = {};

/**
 * The main volume. Whenever you start a source, the source's volume will be multiplied by the main volume.
 */
baa.audio._masterVolume = 1;

/**
 * Use this to preload audio. Assumes all audio are in the folder audio/
 * @param {string} ext The extension of the audio. Examples: "ogg", "mp3", "wav"
 * @param {string} ... Names of the audio. Example: "jump", "shoot", "hit" NOT: "audio/jump.ogg", "audio/shoot", "hit.wav"
 */
baa.audio.preload = function () {
	var ext = "." + arguments[0];
	for (var i = 1; i < arguments.length; i++) {
		var name = arguments[i];
		var snd;
		snd = new Audio();
		snd.oncanplaythrough = function(){
			baa._assetsLoaded++;
		}
		snd.src = "audio/" + name + ext;
		this._sources[name] = snd;
		baa._assetsToBeLoaded++;
	}
}

//Recorder functions

/**
 * Plays the given audio
 * @param  {baa.audio._source} source The audio to play
 */
baa.audio.play = function (source) {
	baa._checkType("source",source,"baa.audio.source");

	source.audio.play();
	source.stopped = false;
	source.playing = true;
}

/**
 * Stops the given audio, and rewinds it.
 * @param  {baa.audio._source} source The audio to stop
 */
baa.audio.stop = function (source) {
	baa._checkType("source",source,"baa.audio.source");

	source.audio.pause();
	source.stopped = true;
	source.playing = false;
	source.audio.currentTime = 0;
}

/**
 * Rewinds the given audio.
 * @param  {baa.audio._source} source The audio to rewind
 */
baa.audio.rewind = function (source) {
	baa._checkType("source",source,"baa.audio.source");

	source.audio.currentTime = 0;
}

/**
 * Pauses the given audio
 * @param  {baa.audio._source} source The audio to pause
 */
baa.audio.pause = function (source) {
	baa._checkType("source",source,"baa.audio.source");

	source.audio.pause();
	source.playing = false;
}

/**
 * Resumes the given audio
 * @param  {baa.audio._source} source The audio to resume
 */
baa.audio.resume = function (source) {
	baa._checkType("source",source,"baa.audio.source");

	if (source.audio.currentTime > 0) {
		source.audio.play();
		source.playing = true;
	}
}

/**
 * Sets the master volume. Whenever you start a source, the source's volume will be multiplied by the master volume.
 * @param {number} volume What you want the master volume to set to
 */
baa.audio.setVolume = function (volume) {
	baa._checkType("volume",volume,"number");

	this.masterVolume = volume;
}


//New functions

/**
 * An audio object. Makes it able to read data of the audio, and set the volume for specific audio.
 * @constructor
 * @throws {Error} If url is a non-existing source.
 * @param {string} url The url of the source
 * @param {boolean} stopped If the audio is stopped.
 * @param {boolean} playing If the audio is playing.
 */
baa.audio._source = Class.extend("baa.audio.source");

baa.audio._source.init = function (url) {
	baa._checkType("url",url,"string");

	if (baa.audio._sources[url]==null) { throw ("Audio '" + url + "' doesn't exist. Did you forgot to preload it?")}
	this.audio = baa.audio._sources[url];
	this.stopped = false;
	this.playing = false;
}

/**
 * Plays the audio.
 */
baa.audio._source.play = function () {
	var oVol = this.audio.volume;
	this.audio.volume *= baa.audio.masterVolume;
	this.audio.play();
	this.stopped = false;
	this.playing = true;
	this.audio.volume = oVol;
}

/**
 * Stops the audio.
 */
baa.audio._source.stop = function () {
	this.audio.pause();
	this.stopped = true;
	this.audio.currentTime = 0;
}

/**
 * Pauses the audio.
 */
baa.audio._source.pause = function () {
	this.audio.pause();
	this.playing = false;
}

/**
 * Resumes the audio.
 */
baa.audio._source.resume = function () {
	if (this.audio.currentTime>0) {
		this.audio.play();
		this.playing = true;
	}
}

/**
 * Rewinds the audio
 */
baa.audio._source.rewind = function () {
	this.audio.currentTime = 0;
}

/**
 * Returns the volume of the audio.
 * @return {number} The volume of the audio
 */
baa.audio._source.getVolume = function () {
	return this.audio.volume;
}

/**
 * Sets the volume of the audio. 0 is no sound, 1 is full sound.
 * @param {number} volume What the volume to set to
 */
baa.audio._source.setVolume = function (volume) {
	baa._checkType("volume",volume,"number");

	this.audio.volume = volume;
}

/**
 * Returns if the audio is looping.
 * @return {boolean} If the audio is looping.
 */
baa.audio._source.isLooping = function () {
	return this.audio.loop;
}

/**
 * Sets if the audio should loop
 * @param {boolean} loop If the audio should loop
 */
baa.audio._source.setLooping = function (loop) {
	baa._checkType("loop",loop,"boolean");

	this.audio.loop = loop;
}

/**
 * Returns if the audio is currently playing 
 * @return {boolean} If the audio is currently playing
 */
baa.audio._source.isPlaying = function () {
	return this.playing;
}

/**
 * Returns if the audio is currently paused. 
 * @return {boolean} If the audio is currently paused.
 */
baa.audio._source.isPaused = function () {
	return this.audio.paused;
}

/**
 * Returns if the audio is currently stopped. 
 * @return {boolean} If the audio is currently stopped.
 */
baa.audio._source.isStopped = function () {
	return this.stopped;
}

/**
 * Sets the pitch of the audio. The higher the pitch, the faster the audio goes.
 * @param {number} pitch What the pitch to set to.
 */
baa.audio._source.setPitch = function (pitch) {
	baa._checkType("pitch",pitch,"number");

	this.audio.playbackRate = pitch;
}

/**
 * Returns the current pitch of the audio.
 * @return {number} The current pitch of the audio.
 */
baa.audio._source.getPtich = function () {
	return this.audio.playbackRate;
}

/**
 * Sets the current audio at a specific time, skipping part of the song, or rewinding a part back.
 * @param  {number} position The position to set to.
 */
baa.audio._source.seek = function (position) {
	baa._checkType("position",position,"number");

	this.audio.currentTime = position;
}

/**
 * Returns the time the audio currently is at.
 * @return {number} The time the audio currently is at.
 */
baa.audio._source.tell = function () {
	return this.audio.currentTime;
}

/**
 * Creates a new source. This is used to keep source a private object.
 * @see  baa.audio._source
 * @return {baa.audio._source} The new source
 */
baa.audio.newSource = function (url) {
	return this._source.new(url);
}


//Keyboard

/**
 * Keyboard takes care for all they key events. All keys are converted to strings.
 * @constructor
 */
baa.keyboard = {};

/**
 * All the keys as objects. Every object has a key corresponding to it's... key.
 */
baa.keyboard._keys = {};

/**
 * An array of keys that are currently pressed.
 */
baa.keyboard._pressed = [];

/**
 * An array of all the keys that are currently released.
 */
baa.keyboard._released = [];

/**
 * The keys converted to strings. Most keycodes can be converted to strings with String.fromCharCode().lowerCase. These are exceptions.
 */
baa.keyboard._constant = {
	8: "backspace",
	9: "tab",
	13: "return",
	16: "shift",
	17: "ctrl",
	18: "alt",
	19: "pause",
	20: "capslock",
	27: "escape",
	33: "pageup",
	34: "pagedown",
	35: "end",
	36: "home",
	45: "insert",
	46: "delete",
	37: "left",
	38: "up",
	39: "right",
	40: "down",
	91: "lmeta",
	92: "rmeta",
	93: "mode",
	96: "kp0",
	97: "kp1",
	98: "kp2",
	99: "kp3",
	100: "kp4",
	101: "kp5",
	102: "kp6",
	103: "kp7",
	104: "kp8",
	105: "kp9",
	106: "kp*",
	107: "kp+",
	109: "kp-",
	110: "kp.",
	111: "kp/",
	112: "f1",
	113: "f2",
	114: "f3",
	115: "f4",
	116: "f5",
	117: "f6",
	118: "f7",
	119: "f8",
	120: "f9",
	121: "f10",
	122: "f11",
	123: "f12",
	144: "numlock",
	145: "scrolllock",
	186: ";",
	187: "=",
	188: ",",
	189: "-",
	190: ".",
	191: "/",
	192: "`",
	219: "[",
	220: "\\",
	221: "]",
	222: "'"
};

/**
 * This is called every time a key is pressed
 * @param  {object} event The Event object. 
 */
baa.keyboard._downHandler = function(event) {
	var keyPressed = baa.keyboard._constant[event.keyCode] || String.fromCharCode(event.keyCode).toLowerCase();
	if (keyPressed == "backspace" || keyPressed == "tab" || keyPressed == " ") {event.preventDefault(); };  
	if (!baa.keyboard._keys[keyPressed]) {
		baa.keyboard._pressed.push(keyPressed);
		if (baa.keyPressed) {
			baa.keyPressed(keyPressed);
		}
		if (baa.debug) {
			baa.debug.keypressed(keyPressed,event.keyCode);
		}
	}
	baa.keyboard._keys[keyPressed] = true;
}

/**
 * This is called every time a key is released.
 * @param  {object} event The Event object. 
 */
baa.keyboard._upHandler = function(event) {
	var keyReleased = baa.keyboard._constant[event.keyCode] || String.fromCharCode(event.keyCode).toLowerCase();
	baa.keyboard._released.push(keyReleased);
	if (baa.keyReleased) {
		baa.keyReleased(keyReleased);
	}
	baa.keyboard._keys[keyReleased] = false;
}

/**
 * Returns if any of the given keys is currently down. You can give infinite arguments, or give an array as the first argument.
 * @return {string|array} ... The keys you want to check. If the first arugment is an array, 
 * it will check the strings in the array, and disregard all other arguments.
 */
baa.keyboard.isDown = function() {
	if (typeof(arguments[0]) == "object") {
		arguments = arguments[0];
	}
	for (var i = 0; i < arguments.length; i++) {
		baa._checkType("key",arguments[i],"string");
		if (baa.keyboard._keys[arguments[i]]) {
			return true;
		}
	}
	return false;
}

/**
 * Returns if any of the given keys has just been pressed. You can give infinite arguments, or give an array as the first argument.
 * @return {string|array} ... The keys you want to check. If the first arugment is an array, 
 * it will check the strings in the array, and disregard all other arguments.
 */
baa.keyboard.isPressed = function () {
	for (var i = 0; i < arguments.length; i++) {
		baa._checkType("key",arguments[i],"string");
		for (var j = 0; j < this._pressed.length; j++) {
			if (arguments[i] == this._pressed[j]) {
				return true;
			}
		}
	}
	return false;
}

/**
 * Returns if any of the given keys has just been released. You can give infinite arguments, or give an array as the first argument.
 * @return {string|array} ... The keys you want to check. If the first arugment is an array, 
 * it will check the strings in the array, and disregard all other arguments.
 */
baa.keyboard.isReleased = function () {
	for (var i = 0; i < arguments.length; i++) {
		baa._checkType("key",arguments[i],"string");
		for (var j = 0; j < this._released.length; j++) {
			if (arguments[i] == this._released[j]) {
				return true;
			}
		}
	}
	return false;
}

//Mouse

/**
 * Mouse takes care for the buttons, and for the cursor position. baa.mouse is of the type baa.point, allowing you to check overlap with rectangles.
 */
baa.mouse = baa.point.new();

/**
 * The buttons of the mouse. Each button is it's own object so that it can be set true or false, when it's down or not.
 */
baa.mouse._buttons = [];

/**
 * An array of all the buttons that are pressed.
 */
baa.mouse._pressed = [];

/**
 * An array of all the buttons that are released.
 */
baa.mouse._released = [];

/**
 * The names of all the keys with their corresponding keycode.
 */
baa.mouse._constant = {
	0:"l",
	1:"m",
	2:"r",
	4:"wu",
	5:"wd"
};

baa.mouse._scaling =

baa.mouse._relative = true;

baa.mouse.ox = 0;
baa.mouse.oy = 0;

/**
 * This is called everything the mouse is moved.
 * @param  {object} event The Event object.
 */
baa.mouse._move = function (event) {
	baa.mouse.ox = baa.mouse.x = event.clientX-4
	baa.mouse.oy = baa.mouse.y = event.clientY-9
}

/**
 * This is called everything a mouse button is clicked.
 * @param  {object} event The Event object.
 */
baa.mouse._downHandler = function (event) {
	var mousepressed = baa.mouse._constant[event.button];
	if (!baa.mouse._buttons[mousepressed]) {
		baa.mouse._pressed.push(mousepressed);
		if (baa.mousepressed) {
			baa.mousepressed(mousepressed,event.clientX,event.clientY);
		}
		if (baa.debug) {
			baa.debug.mousepressed(mousepressed,event.clientX,event.clientY)
		}
	}
	baa.mouse._buttons[mousepressed] = true;
}

/**
 * This is called everything a mouse button is released.
 * @param  {object} event The Event object.
 */
baa.mouse._upHandler = function (event) {
	var mousereleased = baa.mouse._constant[event.button];
	if (baa.mouse._buttons[mousereleased]) {
		baa.mouse._released.push(mousereleased);
		if (baa.mousereleased) {
			baa.mousereleased(mousereleased,event.clientX,event.clientY);
		}
	}
	baa.mouse._buttons[mousereleased] = false;
}

/**
 * This is called everything the mousewheel is scrolled.
 * @param  {object} event The Event object.
 */
baa.mouse._wheelHandler = function (event) {
	var mousepressed = baa.mouse._constant[event.wheelDelta > 0 ? 4 : 5];
	if (!baa.mouse._buttons[mousepressed]) {
		baa.mouse._pressed.push(mousepressed);
		if (baa.mousepressed) {
			baa.mousepressed(mousepressed,event.clientX,event.clientY);
		}
		if (baa.debug) {
			baa.debug.mousepressed(mousepressed,event.clientX,event.clientY)
		}
	}
}

/**
 * Returns the horizontal position of the mouse.
 * @return {number} The horizontal position of the mouse.
 */
baa.mouse.getX = function () {
	return this.x;
}

/**
 * Returns the vertical position of the mouse.
 * @return {number} The vertical position of the mouse.
 */
baa.mouse.getY = function () {
	return this.y;
}

/**
 * Returns if any of the given buttons is currently down. You can give infinite arguments, or give an array as the first argument.
 * @return {string|array} ... The buttons you want to check. If the first arugment is an array, 
 * it will check the strings in the array, and disregard all other arguments.
 */
baa.mouse.isDown = function () {
	for (var i = 0; i < arguments.length; i++) {
		baa._checkType("button",arguments[i],"string");
		if (baa.mouse._buttons[arguments[i]]) {
			return true;
		}
	}
	return false;
}

/**
 * Returns if any of the given buttons has just been pressed. You can give infinite arguments, or give an array as the first argument.
 * @return {string|array} ... The buttons you want to check. If the first arugment is an array, 
 * it will check the strings in the array, and disregard all other arguments.
 */
baa.mouse.isPressed = function () {
	for (var i = 0; i < arguments.length; i++) {
		baa._checkType("button",arguments[i],"string");
		for (var j = 0; j < this._pressed.length; j++) {
			if (arguments[i] == this._pressed[j]) {
				return true;
			}
		}
	}
	return false;
}

/**
 * Returns if any of the given buttons has just been pressed. You can give infinite arguments, or give an array as the first argument.
 * @return {string|array} ... The buttons you want to check. If this is an array, it will check the strings in the array, and disregard all other arguments.
 */
baa.mouse.isReleased = function () {
	for (var i = 0; i < arguments.length; i++) {
		baa._checkType("button",arguments[i],"string");
		for (var j = 0; j < this._released.length; j++) {
			if (arguments[i] == this._released[j]) {
				return true;
			}
		}
	}
	return false;
}

/**
 * Removes the given button from the list of pressed buttons. Useful for when you want to click on something, and not have something behind that affected by it.
 * @param  {string} button The button you want to remove
 */
baa.mouse.catchPressed = function (button) {
	baa._checkType("button",button,"string");
	for (var i = 0; i < this._pressed.length; i++) {
		if (button == this._pressed[i]) {
			this._pressed.splice(i,1);
			break;
		}
	}
}

/**
 * Removes the given button from the list of released buttons. Useful for when you want to click on something, and not have something behind that affected by it.
 * @param  {string} button The button you want to remove
 */
baa.mouse.catchReleased = function (button) {
	baa._checkType("button",button,"string");
	for (var i = 0; i < this._released.length; i++) {
		if (button == this._released[i]) {
			this._released.splice(i,1);
			break;
		}
	}
}

/**
 * Sets the look of the cursor. Options: TODO: ADD OPTIONS!
 * @param {string} cursor What you want the cursor to set to.
 */
baa.mouse.setCursor = function (cursor) {
	baa._checkType("button",cursor,"string");
	document.getElementById("canvas").style.cursor=cursor;
}


//Filesystem

/**
 * The filesystem takes care foar loading and saving data to the local storage.
 */
baa.filesystem = {};

//Filesystem uses store.js
/* Copyright (c) 2010-2013 Marcus Westin */
(function(e){function o(){try{return r in e&&e[r]}catch(t){return!1}}var t={},n=e.document,r="localStorage",i="script",s;t.disabled=!1,
t.set=function(e,t){},t.get=function(e){},t.remove=function(e){},t.clear=function(){},t.transact=function(e,n,r){var i=t.get(e);r==null&&(r=n,n=null),
typeof i=="undefined"&&(i=n||{}),r(i),t.set(e,i)},t.getAll=function(){},t.forEach=function(){},t.serialize=function(e){return JSON.stringify(e)},
t.deserialize=function(e){if(typeof e!="string")return undefined;try{return JSON.parse(e)}catch(t){return e||undefined}};if(o())s=e[r],t.set=function(e,n)
{return n===undefined?t.remove(e):(s.setItem(e,t.serialize(n)),n)},t.get=function(e){return t.deserialize(s.getItem(e))},t.remove=function(e){s.removeItem(e)},
t.clear=function(){s.clear()},t.getAll=function(){var e={};return t.forEach(function(t,n){e[t]=n}),e},t.forEach=function(e){for(var n=0;n<s.length;n++)
{var r=s.key(n);e(r,t.get(r))}};else if(n.documentElement.addBehavior){var u,a;try{a=new ActiveXObject("htmlfile"),a.open(),
a.write("<"+i+">document.w=window</"+i+'><iframe src="/favicon.ico"></iframe>'),a.close(),u=a.w.frames[0].document,s=u.createElement("div")}catch(f)
{s=n.createElement("div"),u=n.body}function l(e){return function(){var n=Array.prototype.slice.call(arguments,0);n.unshift(s),u.appendChild(s),
s.addBehavior("#default#userData"),s.load(r);var i=e.apply(t,n);return u.removeChild(s),i}}var c=new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]","g");
function h(e){return e.replace(/^d/,"___$&").replace(c,"___")}t.set=l(function(e,n,i){return n=h(n),i===undefined?t.remove(n):(e.setAttribute(n,t.serialize(i)),
e.save(r),i)}),t.get=l(function(e,n){return n=h(n),t.deserialize(e.getAttribute(n))}),t.remove=l(function(e,t){t=h(t),e.removeAttribute(t),e.save(r)}),
t.clear=l(function(e){var t=e.XMLDocument.documentElement.attributes;e.load(r);for(var n=0,i;i=t[n];n++)e.removeAttribute(i.name);e.save(r)}),
t.getAll=function(e){var n={};return t.forEach(function(e,t){n[e]=t}),n},t.forEach=l(function(e,n){var r=e.XMLDocument.documentElement.attributes;
for(var i=0,s;s=r[i];++i)n(s.name,t.deserialize(e.getAttribute(s.name)))})}try{var p="__storejs__";t.set(p,p),t.get(p)!=p&&(t.disabled=!0),
t.remove(p)}catch(f){t.disabled=!0}t.enabled=!t.disabled,typeof module!="undefined"&&module.exports&&
this.module!==module?module.exports=t:typeof define=="function"&&define.amd?define(t):e.store=t})(Function("return this")());

/**
 * Reads the data of what is stored in the given file.
 * @param  {string} name The name of the file you want to read.
 * @return {dynamic TODO: OR STRING!?}      The data of the file
 */
baa.filesystem.read = function (name) {
	baa._checkType("file",name,"string");
	this._check();

	return store.get(this.identity+name);
}

/**
 * Writes data to the given file.
 * @param  {string} name   	The name of the file you want to write to.
 * @param  {dynamic TODO: OR STRING?!} content The data you want to write to the file.
 */
baa.filesystem.write = function (name,content) {
	baa._checkType("file",name,"string");
	this._check();

	store.set(this.identity+name,content);
}

/**
 * Removes the given file of the local storage.
 * @param  {string} name The name of the file you want to remove
 */
baa.filesystem.remove = function (name) {
	baa._checkType("file",name,"string");
	this._check();

	store.remove(this.identity+name);
}

/**
 * Returns if given file exists.
 * @param  {string} name The name of the file you want to check.
 * @return {boolean}      If the file exists.
 */
baa.filesystem.exists = function (name) {
	baa._checkType("file",name,"string");
	this._check();

	return store.get(this.identity+name) != null;
}

/**
 * Sets an identity to the filesystem. This is required before using any of the filesystem features. The identity can also be set with t.identity = "" in baa.config.
 * @param {string} name The name of what the identity to set to
 */
baa.filesystem.setIdentity = function (name) {
	baa._checkType("file",name,"string");

	this.identity = name+"/";
}

/**
 * Checks if local storage is enabled, and if an identity is set.
 * @throws {Error} If no enditity is set.
 */
baa.filesystem._check = function () {
	if (!store.enabled) { alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.')};
	if (this.identity == null) { throw("Please set an identity before using filesystem!");}
}


//Run

/**
 * Call this to start baa. This should be called as last.
 */
baa.run = function () {
		window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame   ||  //Chromium 
			window.webkitRequestAnimationFrame ||  //Webkit
			window.mozRequestAnimationFrame    || //Mozilla Geko
			window.oRequestAnimationFrame      || //Opera Presto
			window.msRequestAnimationFrame     || //IE Trident?
			function(callback, element){ //Fallback function
				window.setTimeout(callback, 1000/60);                
			}
		})();
		
		window.cancelAnimFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
	
	if (baa._assetsLoaded == baa._assetsToBeLoaded) {
		if (baa.graphics.ctx) {
			if (baa.config) {
				var conf = {};
				/*
				t.width = The width of the canvas
				t.height = The height of the canvas
				t.identity = The identity of the filesystem
				t.scale = The global scale
				 */
				baa.config(conf);
				baa.graphics._globalScale = conf.scale!=null ? conf.scale : 1;
				baa.graphics.canvas.width = (conf.width != null ? conf.width : 800) * baa.graphics._globalScale;
				baa.graphics.canvas.height = (conf.height != null ? conf.height : 600) * baa.graphics._globalScale;
				baa.graphics.width = baa.graphics.canvas.width;
				baa.graphics.height = baa.graphics.canvas.height;
				Camera.setWindow(0,0,baa.graphics.width,baa.graphics.height);
				baa.filesystem.identity = typeof(conf.identity) == "string" ? conf.identity + "/" : null;
				if (conf.release) {
					baa.debug = null;
					baa.typesafe = false;
				}
			}
			baa.graphics.imageSmoothingEnabled = true;
			baa.graphics.ctx.strokeStyle = baa.graphics._rgb(255,255,255);
			baa.graphics.setFont(baa.graphics.newFont("arial",10));
			baa.load();
			baa.loop(0);
			window.cancelAnimFrame(baa.run);
		}
		else {
			window.requestAnimFrame(baa.run);
		}
	}
	else {
		window.requestAnimFrame(baa.run);
	}
}

/**
 * The main loop. Calls baa.update, and baa.graphics.drawLoop. It also calls baa.debug.update if baa.debug is activated.
 */
baa.loop = function (time) {
	baa._time.dt = (baa._time.stamp() - baa._time.last) / 1000;
	ot = (baa._time.dt > 0) ? baa._time.dt : 1/60;
	dt = Math.min(ot,1/60);

	if (baa.debug) {
		baa.debug.fps = 1000 / (baa._time.stamp() - baa._time.last);
		baa.debug.update();
	}

	baa.mouse.x = baa.mouse.ox/baa.graphics._globalScale;
	baa.mouse.y = baa.mouse.oy/baa.graphics._globalScale;

	if (baa.update) {
		baa.mouse.setCursor("default");
		baa.update();
		Timer.update();
		Tween.update();
		Camera.update()
	}

	if (baa.debug) {
		baa.mouse.x = baa.mouse.ox;
		baa.mouse.y = baa.mouse.oy;
		baa.debug.updateWindows();
	}

	baa.graphics._drawloop();

	baa.keyboard._pressed = [];
	baa.keyboard._released = [];
	baa.mouse._pressed = [];
	baa.mouse._released = [];

	baa._time.last = baa._time.stamp();
	window.requestAnimFrame(baa.loop);
}

/**
 * The draw loop. Calls baa.draw, and baa.debug.draw if baa.debug is activated.
 */
baa.graphics._drawloop = function (a) {
	if (baa.draw) {
		this.ctx.fillStyle = this._rgb(this._backgroundColor.r,this._backgroundColor.g,this._backgroundColor.b);
		this.ctx.globalAlpha = 1;
		this.clear();
		this.ctx.globalAlpha = this._color.a;
		this.ctx.fillStyle = this._rgb(this._color.r,this._color.g,this._color.b);
		this.ctx.strokeStyle = this._rgb(this._color.r,this._color.g,this._color.b);
		this.setFont(this._defaultFont);
		
		for (var i = 0; i < this._stacks; i++) {
			this.ctx.restore();
			this._stacks--;
		}

		baa.graphics.origin();

		Camera.start();
		baa.draw();
		Camera.stop();

		if (baa.debug) {
			baa.graphics.origin();
			baa.graphics.scale(1/this._globalScale);
			baa.debug.draw();
		}
	}
}

window.addEventListener('load', _baa_init);

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////

//////////
///ONCE///
//////////

/**
 * A small tool to lock functions to 1 call. They won't be called again until they are unlocked.
 * @constructor
 * @property {object} object The object of this instance.
 * @property {object} list A list of all the functions, and their current state.
 * @param {object} obj The object of this instance.
 * @example
 * this.once = baa.once.new(this);
 *
 * Foo.update = function () {
 * 		//This is only called once
 * 		this.once.do("foo");
 *
 * 		//If a is pressed
 * 		if (baa.keyboard.isPressed("a")) {
 *
 * 			//this.foo can be called again, this.bar is called.
 * 			this.once.back("foo","bar");
 * 		}
 * }
 */
baa.once = Class.extend("baa.once");

baa.once.init = function (obj) {
	baa._checkType("object",obj,"object");

	this.object = obj;
	this.list = {};
}

/**
 * Call a function. If it has already been called with this function, it won't be called again.
 * @param  {string} f    The function to call.
 * @param  {array} args An array of arguments to use with the function.
 * @return {dynamic} If the function is called, returns whatever the given function returns. Else, returns null.
 */
baa.once.do = function (f,args) {
	baa._checkType("function",f,"string");
	baa._checkType("arguments",args,"object",null);

	if (!this.list[f]) {
		this.list[f] = true;
		return this.object[f].apply(this.object,args);
	}
	return false;
}

/**
 * Allow a function to be called again. You can give a new function that will be called.
 *  The new function will not be locked, but won't be called by this function if f is already reverted.
 * @param  {string} f    The function you want to unlock.
 * @param  {string} [nf]   The function you want call when f is unlocked.
 * @param  {array} [args] An array of arguments to use with the function.
 * @return {dynamic} If nf is called, returns whatever nf returns. Else, returns null.
 */
baa.once.back = function (f,nf,args) {
	baa._checkType("function",f,"string");
	baa._checkType("newFunction",nf,"string",null);
	baa._checkType("arguments",args,"object",null);

	if (this.list[f]) {
		delete(this.list[f]);
		if (nf) {
			return this.object[nf].apply(this.object,args);
		}
		else {
			return true;
		}
	}
	return;
}

///////////
// Utils //
///////////

/**
 * Useful small functions.
 * @constructor
 */
baa.util = {};

/**
 * Math.PI multiplied.
 */
baa.util.TAU = Math.PI*2;

/**
 * Returns 1 if a is higher or equal to 0, else it returns -1.
 * @param  {number} a The value you want to sign.
 * @return {number}   1 if a is higher or equal to 0, else it returns -1.
 */
baa.util.sign = function (a) {
	baa._checkType("a",a,"number");

	return a >= 0 ? 1 : -1;
}

baa.util.any = function (arr,f) {
	baa._checkType("array",arr,"object");
	baa._checkType("function",f,"string","function");

	if (typeof(f)=="function") {
		for (var i=0; i < arr.length; i++) {
			if (f(arr[i])) {
				return true;
			}
		}
	}
	else {
		for (var i=0; i < arr.length; i++) {
			for (var key in f) {
				if (arr[i][key]!=undefined) {
					if (arr[i][key] == f[key]) {
						return true;
					}
				}
			}
		}
	}
	return false;
}

baa.util.all = function (arr,f) {
	baa._checkType("array",arr,"object");
	baa._checkType("function",f,"string","function");

	if (typeof(f)=="function") {
		for (var i=0; i < arr.length; i++) {
			if (!f(arr[i])) {
				return false;
			}
		}
	}
	else {
		for (var i=0; i < arr.length; i++) {
			for (var key in f) {
				if (arr[i][key]!=undefined) {
					if (arr[i][key] != f[key]) {
						return false;
					}
				}
				else {
					return false;
				}
			}
		}
	}
	return true;
}

baa.util.find = function (arr,f) {
	baa._checkType("array",arr,"object");
	baa._checkType("function",f,"string","function");
	
	if (typeof(f)=="function") {
		for (var i=0; i < arr.length; i++) {
			if (f(arr[i])) {
				return i;
			}
		}
	}
	else {
		for (var i=0; i < arr.length; i++) {
			for (var key in f) {
				if (arr[i][key]!=undefined) {
					if (arr[i][key] == f[key]) {
						return i;
					}
				}
			}
		}
	}
	return null;
}

baa.util.findAll = function (arr,f) {
	baa._checkType("array",arr,"object");
	baa._checkType("function",f,"string","function");
	
	var newarr = [];
	if (typeof(f)=="function") {
		for (var i=0; i < arr.length; i++) {
			if (f(arr[i])) {
				newarr.push(i);
			}
		}
	}
	else {
		for (var i=0; i < arr.length; i++) {
			for (var key in f) {
				if (arr[i][key]!=undefined) {
					if (arr[i][key] == f[key]) {
						newarr.push(i);
					}
				}
			}
		}
	}
	return newarr;
}

baa.util.has = function (arr) {
	baa._checkType("array",arr,"array");
	for (var i = 1; i < arguments.length; i++) {
		baa._checkType("key",arguments[i],"string");
		succes = false;
		for (var j = 0; j < arr.length; j++) {
			if (arr[j] == arguments[i]) {
				succes = true;
			}
		}
		if (!succes) {
			return false;
		}
	}
	return true
}

baa.util.count = function (arr,f) {
	baa._checkType("array",arr,"array");
	baa._checkType("function",f,"string","function");
	
	var c = 0;
	if (typeof(f)=="function") {
		for (var i=0; i < arr.length; i++) {
			if (f(arr[i])) {
				c++;
			}
		}
	}
	else {
		for (var i=0; i < arr.length; i++) {
			for (var key in f) {
				if (arr[i][key]!=undefined) {
					if (arr[i][key] == f[key]) {
						return c++;
					}
				}
			}
		}
	}
	return c;
}

baa.util.clamp = function (a,min,max) {
	baa._checkType("a",a,"number");
	baa._checkType("min",min,"number");
	baa._checkType("max",max,"number");
	
	return Math.min(max,Math.max(min,a));
}

baa.util.angle = function (a,b,c,d) {
	baa._checkType("x1",a,"number","object");
	baa._checkType("y1",b,"number","object");
	baa._checkType("x2",c,"number",null);
	baa._checkType("y2",d,"number",null);

	if (!c) {
		return Math.atan2(b.y - a.y,b.x - a.x);
	}
	else {
		return Math.atan2(d - b, c - a);
	}
}

baa.util.distance = function (a,b,c,d) {
	if (typeof(a) === "object") {
		baa._checkType("x1",a,"object");
		baa._checkType("y1",b,"object");
		c = b.x;
		d = b.y;
		b = a.y;
		a = a.x;
	}
	else {
		baa._checkType("x2",c,"number");
		baa._checkType("y2",d,"number");
	}

	return Math.sqrt(Math.pow(a-c,2) + Math.pow(b-d,2));
}

baa.util.random = function (s,e) {
	if (e==null) {
		baa._checkType("value",s,"number");
		return Math.floor(Math.random()*s);
	}
	else {
		baa._checkType("min",s,"number");
		baa._checkType("max",e,"number");
		return s+Math.floor(Math.random()*(e-s+1));
	}
}

baa.util.choose = function (arr) {
	baa._checkType("array",arr,"object");

	return arr[Math.floor(Math.random()*arr.length)];
}

baa.util.same = function (arr1,arr2) {
	baa._checkType("array1",arr2,"object");
	baa._checkType("array2",arr1,"object");

	var arr = [];
	for (var i = 0; i < arr1.length; i++) {
		for (var j = 0; j < arr2.length; j++) {
			if (arr1[i] == arr2[j]) {
				arr.push(arr1[i]);
			}
		}
	}
	return arr;
}

baa.util.remove = function (arr,f) {
	//find does the checktypes
	arr.splice(this.find(arr,f));
	return arr;
}

baa.util.call = function (obj,func,arg) {
	if (typeof(func) == "string") {
		obj[func].call(obj,arg);
	}
	else {
		func.call(obj,arg);
	}
}



///////////
// Group //
///////////

/**
 * A tool to make groups, saves you from writing arrays.
 * @constructor
 * @example
 * this.enemies = baa.group.new();
 * this.enemies.add( Enemy.new(), Enemy.new(), Enemy.new() );
 *
 * this.enemies.update();
 *
 * this.enemies.draw();
 * @property {number} length How many members are in the group.
 * @param {object|array} [...] The objects you want to add to the group. Can also be added with baa.group.add(). 
 * If the first argument is an array, it will use the objects in the array, and disregard all other arguments.
 */
baa.group = Class.extend("baa.group");

//Use .other if you want obj A to apply to obj B and vise versa
//Use .one if you want obj B to apply to obj A only if obj A applied to obj B returns false

/**
 * Using this as first argument when calling a function, will loop through all objects, and gives every other object as argument.
 * @example
 * this.rects = baa.group.new(baa.entity.new(100,100,200,200),baa.entity.new(50,50,100,100),baa.entity.new(300,200,10,40));
 * this.rects.resolveCollision(baa.group.others);
 */
baa.group.others = "__GroupOthers";

/**
 * Same as baa.group.others, except this will first call A with B as argument, and if A returns true, it will not call B with A as argument.
 */
baa.group.one = "__GroupOne";

/**
 * Make baa.group loop forwards through the objects. Normally the objects loop backwards, but you can revert that with this argument. 
 * Useful for when you want to update something you want to draw as last, so that it's on top.
 */
baa.group.forward = "_GroupForward";

baa.group.init = function () {
	this.length = 0;
	baa.group.add.apply(this,arguments);
}

/**
 * Add objects to the group. It will copy and modify it's functions so that it can be called by this. 
 *	@param {object|array} ... The objects you want to add to the group. If the first argument is an array, it will use the objects in the array, 
 *	and disregard all other arguments.
 */
baa.group.add = function (obj) {
	if (obj) {
		if (arguments.length > 1) {
			for (var i = 0; i < arguments.length; i++) {
				this[this.length] = arguments[i];
				this.length++;
				for (var key in arguments[i]) {
					if (!this.hasOwnProperty(key)) {
						if (typeof(arguments[i][key]) == "function") {
							this._makeFunc(key);
						}
					}
				}
			}
		}
		else if (Class.isClass(obj) && obj.is(baa.group)) {
			for (var i=0; i < obj.length; i++) {
				this[this.length] = obj[i];
				this.length++;
				for (var key in obj[i]) {
					if (!this.hasOwnProperty(key)) {
						if (typeof(obj[i][key]) == "function") {
							this._makeFunc(key);
						}
					}
				}
			}
		}
		else {
			this[this.length] = obj;
			this.length++;
			for (var key in obj) {
				if (!this.hasOwnProperty(key)) {
					if (typeof(obj[key]) == "function") {
						this._makeFunc(key);
					}
				}
			}
		}
	}
}

/**
 * Removes an object from the group.
 * @param  {obj|number} obj Can be the object itself, or its current position in the group.
 */
baa.group.remove = function (obj) {
	baa._checkType("object",obj,"number","object");

	if (obj == null) { return false; }
	var dead;
	if (typeof(obj) == "object") {
		for (var i=0; i < this.length; i++) {
			if (this[i] == obj) {
				dead = i;
				break;
			}
		}
		this[dead] = null;
	}
	else {
		this[obj] = null;
		dead = obj;
	}
	for (var i = dead+1; i < this.length; i++) {
		this[i-1] = this[i];
	}
	this.length--;
	this[this.length] = null;
}

/**
 * Modifies the function so that it calls the function for all the members.
 * @param  {string} k The function name
 */
baa.group._makeFunc = function (k) {
	this[k] = function () {
		var other = arguments[0]
		if (other == baa.group.others || other == baa.group.one) {
			for (var i=0; i < this.length-1; i++) {
				for (var j=i; j < this.length; j++) {
					if (i!=j && this[i]!=null && this[j]!=null) {
						if (this[i].hasOwnProperty(k) && this[j].hasOwnProperty(k)) {
							arguments[0] = this[j];
							var a = this[i][k].apply(this[i],arguments);
							if (other == baa.group.one) {
								continue;
							}
							var b = this[j][k].apply(this[j],arguments);
						}
					}
				}
			}
		}
		else {
			if (arguments[0] == baa.group.forward) {
				for (var i=0; i < this.length; i++) {
					if (this[i].hasOwnProperty(k)) {
						this[i][k].apply(this[i],arguments);
					}
				}
			}
			else {
				for (var i = this.length-1; i >= 0; i--) {
					if (this[i].hasOwnProperty(k)) {
						this[i][k].apply(this[i],arguments);
					}
				}	
			}
			
			
		}
	}
}

/**
 * Make all the objects in the group call a function.
 * @param  {function} f The function you want to call.
 */
baa.group.do = function (f) {
	baa._checkType("function",f,"function");

	for (var i=0; i < this.length; i++) {
		func.call(this[i]);
	}
}

/**
 * Sets a value to the given variable for all members. The object is required to already have this property.
 * @param {string} key   The property you want to change.
 * @param {dynamic} value The value you want to give the property.
 */
baa.group.set = function (key,value) {
	baa._checkType("key",key,"string");

	for (var i = 0; i < this.length; i++) {
		if (this[i].hasOwnProperty(key)) {
			this[i][key] = value;
		}
	}
}

/**
 * Prepares the group for objects to come. Allowing you to already call its functions, without any members.
 * @example
 * this.group = baa.group.new();
 *
 * //This will give an error. this.group doesn't have .update().
 * this.group.update()
 *
 * this.group = baa.group.new();
 * this.group.prepare(baa.entity);
 *
 * //The group is prepared and can now already call functions without errors.
 * this.group.update();
 * @param  {object} obj An object with the functions the group is going to use.
 */
baa.group.prepare = function (obj) {
	for (var key in obj) {
		if (!this.hasOwnProperty(key)) {
			if (typeof(obj[key]) == "function") {
				this._makeFunc(key);
			}
		}
	}
}

/**
 * Removes all the members of the group, but keeps the functions.
 */
baa.group.flush = function () {
	for (var i=0; i < this.length; i++) {
		delete(this[i]); 
	}
	this.length = 0;
}

/**
 * Sorts all the members on the value of a property. If an object in the group does not own the property, it will be taken as 0.
 * @param  {string} key         The property you want to sort on.
 * @param  {boolean} [highToLow] Set to true if you want the object to sort from high to low, instead of low to high.
 */
baa.group.sort = function (a,highToLow) {
	baa._checkType("key",a,"string");
	baa._checkType("highToLow",highToLow,"boolean");

	sorted = false;

	var danger = 10000;
	var propA, propB;

	while (!sorted && danger > 0) {
		danger--;
		sorted = true;
		for (var i = 0; i < this.length-1; i++) {
			for (var j = i; j < this.length; j++) {
				propA = this[i].hasOwnProperty(a) ? this[i][a] : 0;
				propB = this[j].hasOwnProperty(a) ? this[j][a] : 0;
				if (highToLow) {
					if (propA < propB) {
						var old = this[j];
						this[j] = this[i];
						this[i] = old;
						sorted = false;
					}
				}
				else {
					if (propA > propB) {
						var old = this[j];
						this[j] = this[i];
						this[i] = old;
						sorted = false;
					}
				}
			}
		}
	}
}


//Timer
//////////////////////////////////

/**
 * A manager for baa.timer objects. Automatically updates and removes timers made with it.
 * @constructor
 * @see  baa.timer
 * @property {object} obj The object that owns this timermanager. Functions will be called with the object as this. 
 * @property {array} timers A list of all the timers owned by this timermanager.
 * @property {boolean} playing All the timers will only update when this is true.
 * @param {object} [object] The owner of this timermanager.
 */
baa.timerManager = Class.extend("baa.timerManager");

baa.timerManager.init = function (object) {
	baa._checkType("object",object,"object",null);
	this.obj = object;
	this.timers = [];
	this.playing = true;
	this.new = this.newTimer;
	delete(this.newTimer);
}

/**
 * Sets an object to this timermanager.
 * @param {object} object The object you want to set to this timermanager.
 */
baa.timerManager.setObject = function (object) {
	baa._checkType("object",object,"object");
	this.obj = object;
}

/**
 * Returns the object set to this timermanager.
 * @return {object} The object set to this timermanager.
 */
baa.timerManager.getObject = function () {
	return this.obj;
}

/**
 * Create a new timer belonging to this timer manager.
 * @alias new
 * @param  {object} [obj] The object you want to connect to the condition and function of this timer.
 * If the first argument is a number, this will be taken as the argument time, and shift all other arguments, and the manager's object will be used instead.
 * @param  {number} time The length of the timer in seconds.
 * @param  {string} [mode="normal"] If the timer should loop, die after one loop, or neither. Options: "loop", "once", "normal".
 * @param  {function|string} [func] The function you want to call each time the timer is finished. 
 * This can either be the name of the function as a string, or a function on its own.
 * @param  {object|function} [cond] A condition that must be true for the timer to play. 
 * This can either be a function returning a boolean, or an object with properties that have to be a certain value.
 * @return {baa.timer} The new timer.
 */
baa.timerManager.newTimer = function (obj,time,mode) {
	var t;
	if (typeof(obj) == "number") {
		t = baa.timer.new(this.obj,obj,time,this);
	}
	else {
		t = baa.timer.new(obj,time,mode,this);
	}
	this.timers.push(t);
	return t;
}

/**
 * Updates all the timers.
 */
baa.timerManager.update = function () {
	if (this.playing) 	{
		for (var i = this.timers.length - 1; i >= 0; i--) {
			if (this.timers[i].dead) { this.timers.splice(i,1); continue; }
			this.timers[i].update();
		}
	}
}

/**
 *	Resumes the manager updating the timers.
 */
baa.timerManager.play = function () {
	this.playing = true;
}

/**
 * Pauses the manager from updating timers.
 */
baa.timerManager.pause = function () {
	this.playing = false;
}

/**
 * A global timermanager. Useful for if you want to make quick, automatically updating, disposable timers. You can not set a main object to this manager.
 */
Timer = baa.timerManager.new();
delete(Timer.setObject);
delete(Timer.getObject);


/**
 * A tool to make easy timers. You can make them loop, give them condiitons for playing, and make the call a function when they're done.
 * @see  baa.timerManager
 * @constructor
 * @param  {number} time The length of the timer in seconds.
 * @param  {string} [mode="normal"] If the timer should loop, die after one loop, or neither. Options: "loop", "once", "normal".
 * @param  {object} [obj] The object you want to connect to the condition and function of this timer.
 * @param  {object|function} [cond] A condition that must be true for the timer to play. 
 * This can either be a function returning a boolean, or an object with properties that have to be a certain value.
 * @param  {function|string} [func] The function you want to call each time the timer is finished.
 * @param  {object} [manager] The manager that owns this timer. Should only be given by the manager itself. 
 * This can either be the name of the function as a string, or a function on its own.
 */
baa.timer = Class.extend("baa.timer");

baa.timer.init = function (obj,time,mode,manager) {
	baa._checkType("object",obj,"object");
	baa._checkType("time",time,"number");
	baa._checkType("time",mode,"string",null);

	this._manager = manager;
	this.obj = obj;

	this.time = time;
	this.timeStart = time;

	this.mode = mode || "normal";

	this.condition;
	this.condType;

	this.updateFunc;
	this.updateObj;

	this.completeFunc;
	this.completeObj;

	this.playing = true;
	this.ended = false;
	this.dead = false;
}

/**
 * Sets an object to this timer that will be connected with the condition and function. 
 * @param {object} obj The object you want to set.
 */
baa.timer.setObject = function (obj) {
	this.obj = obj;
}

/**
 * Returns the object set to this timer. If no object is set yet, it will return null.
 * @return {object} The object set to this timer.
 */
baa.timer.getObject = function () {
	return this.obj;
}

/**
 * Sets the condition of the timer that needs to be true for it to play. This can either be a function returning a boolean, 
 * or an object with properties that have to be a certain value.
 * @param {object|function} condition The condition of the timer that needs to be true for it to play.
 */
baa.timer.setCondition = function (condition) {
	baa._checkType("condition",condition,"function","object");

	this.condition = condition || function () { return true; }
	this.condType = typeof(this.condition);
	return this;
}

/**
 * Updates the timer.
 */
baa.timer.update = function () {
	if (this.playing && !this.dead) {
		if (this.loop) {
			this.ended = false;
		}
		if (!this.ended) {
			var succes = true
			var obj = this.getObject();
			if (this.condition) {
				if (this.condType == "object") {
					for (var key in this.condition) {
						if (this.condition[key] != obj[key]) {
							succes = false;
						}
					}
				}
				else {
					succes = this.condition(obj);
				}
			}
				
			if (succes) {
				this.time -= dt;
				if (this.updateFunc) {
					if (this.updateObj) {
						baa.util.call(this.updateObj,this.updateFunc,this.time);
					}
					else {
						baa.util.call(this.updateFunc,null,this.time);
					}
				}

				if (this.time < 0) {
					if (this.completeFunc) {
						if (this.completeObj) {
							baa.util.call(this.completeObj,this.completeFunc,this.time);
						}
						else {
							baa.util.call(this.completeFunc,null,this.time);
						}
					}
					this.ended = true;

					if (this.once) {
						this.kill();
						return;
					}
					
					if (this.loop) {
						this.time += this.timeStart;
					}
				}
			}
		}
	}
}

/**
 * Resets the timer, making it start from the beginning. It does not revert killing.
 */
baa.timer.reset = function (time) {
	this.timeStart = time || this.timeStart;
	this.ended = false;
	this.time = this.timeStart;
	this.playing = true;
}

/**
 * Pauses the timer from playing.
 */
baa.timer.pause = function () {
	this.playing = false; 
}

/**
 * Starts the timer, or resumes the timer from pausing.
 */
baa.timer.play = function () {
	this.playing = true;
}

/**
 * Stops the timer from playing, and starts at the beginning.
 * @return {[type]} [description]
 */
baa.timer.stop = function () {
	this.playing = false;
	this.time = this.timeStart;
}

/**
 * Kills the timer, preventing it from updating, and removing itself from its managers timer list.
 */
baa.timer.kill = function () {
	this.dead = true;
	this.playing = false;
}

/**
 * Returns if the timer is finished. If a finished timer loops, it stops being finished at the next update.
 * @return {boolean} If the timer is finished.
 */
baa.timer.isDone = function () {
	return this.ended;
}

/**
 * Sets the function that will be called every time the timer updates.
 * @param  {string|function} func The function to be called.
 * @param  {object} obj  The object that this function is called with.
 * @return {baa.timer}      The timer, to allow further extending.
 */
baa.timer.onUpdate = function (func,obj) {
	this.updateFunc = func;
	this.updateObj = obj || this.obj;
	return this;
}

/**
 * Sets the function that will be called every time the timer updates.
 * @param  {string|function} func The function to be called.
 * @param  {object} [obj]  The object that this function is called with. If no object is set, the timer's object will be used instead. 
 * @return {baa.timer}      The timer, to allow further extending.
 */
baa.timer.onComplete = function (func,obj) {
	this.completeFunc = func;
	this.completeObj = obj || this.obj;
	return this;
}

//Tween
//////////////////////////////////

/**
 * A manager for baa.tween objects. Automatically updates and removes tweens made with it.
 * @constructor
 * @see baa.tween
 * @property {object} obj The object that owns this tweenmanager. Whenever you make a new tween with this tweenmanager, it will use this object.
 * @property {array} tweens A list of all the tweens owned by this tweenmanager.
 * @property {boolean} playing All the tweens will only update when this is true.
 * @param {object} [object] The owner of this tweenmanager.
 */
baa.tweenManager = Class.extend("baa.tweenManager");

baa.tweenManager.init = function (obj) {
	this.obj = obj;
	this.tweens = [];
	this.playing = true;
}

/**
 * Make a new tween.
 * @param  {object} [obj]  The object you want to tween. If you use a number instead, 
 * the function will take this argument as the rate and shift all other arguments. In this case it will use the manager's object.
 * @param  {number} rate  How long the tween should take in seconds.
 * @param  {object} vars  An object with properties of the object, and the values you want them to tween to.
 * @param  {boolean} force Whether to overwrite properties that are already being tweened. 
 * If true, the tween already using these properties will have these properties removed.
 * @return {baa.tween}	The tween created, allowing you to extend the tween by using .to, adding a delay with .delay, or easing with .ease.
 */
baa.tweenManager.to = function (obj,rate,vars,force) {
	if (typeof(obj) == "number") {
		force = vars;
		vars = rate;
		rate = obj;
		obj = this.obj;
	}

	baa._checkType("force",force,"boolean",null);

	var tween = baa.tween.new(obj,rate,vars,this);
	tween._force = force || false;
	this.tweens.push(tween);
	return tween;
}

/**
 * Updates all the tweens
 */
baa.tweenManager.update = function () {
	if (this.playing) {
		for (var i = this.tweens.length - 1; i >= 0; i--) {
			if (this.tweens[i].dead) { this.tweens.splice(i,1); continue; }
			this.tweens[i].update();
		}
	}
}

/**
 * Set an object that the manager will use for its tweens.
 */
baa.tweenManager.setObject = function (obj) {
	this.obj = obj;
}

/**
 * Returns the object the manager is using for its tweens.
 * @return {object} The object the manager is using for its tweens.
 */
baa.tweenManager.getObject = function () {
	return this.obj;
}

/**
 *	Resumes the manager updating its tweens.
 */
baa.tweenManager.play = function () {
	this.playing = true;
}

/**
 *	Pauses the manager updating its tweens.
 */
baa.tweenManager.pause = function () {
	this.playing = false;
}

/**
 * A global tweenmanager. Useful for if you want to make quick, automatically updating, disposable tweens. You can not set a main object to this manager.
 */
Tween = baa.tweenManager.new();
delete(Tween.getObject);
delete(Tween.setObject);

/**
 * Making transitions of the value of properties easier. 
 * Make objects move from one point to another, use delay, easing, 
 * and call multiple tweens in a row. It is highly recommended that you use a tweenmanager.
 * @constructor
 * @param  {object} obj  The object you want to tween.
 * @param  {number} rate  How long the tween should take in seconds.
 * @param  {object} vars  An object with properties of the object, and the values you want them to tween to.
 * @param  {object} [manager] The manager that owns this tween. Should only be given by the manager itself.
 * @see baa.tweenManager
 */
baa.tween = Class.extend("baa.tween");

baa.tween.init = function (obj,rate,vars,manager) {
	baa._checkType("object",obj,"object");
	baa._checkType("rate",rate,"number");
	baa._checkType("vars",vars,"object");

	this._obj = obj;
	this._rate = rate > 0 ? 1/rate : 1;
	this._vars = vars;
	this._manager = manager

	this._delay = 0;
	this._started = false;
	this._progress = 0;
	this._easeMode = "in";
	this._easing = "linear";
	this.dead = false;
}

/**
 * Updates the tween
 */
baa.tween.update = function () {
	if (this.dead) { return; };
	if (this._delay > 0) { this._delay -= dt; return;};
	if (!this._started) { 
		this._start();
		if (this.startFunc) {
			baa.util.call(this.startObj,this.startFunc);
		}
	}
	this._progress += this._rate * dt;
	var p = this._progress;
	p = p >= 1 ? 1 : p;
	p = baa.tween.__ease(p,this._easeMode,this._easing);
	for (var prop in this._vars) {
		this._obj[prop] =  this._vars[prop].start + p * this._vars[prop].diff;
	}
	if (this.updateFunc) {
		baa.util.call(this.updateObj,this.updateFunc);
	}
	if (this._progress >= 1) {
		if (this.completeFunc) { 
			baa.util.call(this.completeObj,this.completeFunc);
		}
		this.dead = true;
		if (this._after) {
			this._manager.tweens.push(this._after);
		}
	}
}

/**
 * Starts the tween.
 */
baa.tween._start = function() {
	//Check if there are duplicates
	if (this._manager) {
		for (var i = 0; i < this._manager.tweens.length; i++) {
			var twn = this._manager.tweens[i];

			//We only check for inited, alive tweens.
			//Since this tween itself is not inited yet, we automatically check if it is itself.
			if (twn._started && !twn.dead) {
				//If they are the same object
				if (this._obj == twn.obj) {
					//Make an array of all they keys both tweens have
					var same = [];
					for (var key in this._vars) {
						for (var key2 in twn.vars) {
							if (key == key2) {
								same.push(key);
							}
						}
					}
					for (var j = 0; j < same.length; j++) {
						//Wh1ether we use force to overwrite it or not
						if (this._force) {
							delete(twn.vars[same[j]]);
						}
						else {
							delete(this._vars[same[j]]);
						}
					}
				}
			}
		}
	}

	for (var prop in this._vars) {
		this._vars[prop] = {
		start : this._obj[prop],
		diff : this._vars[prop] - this._obj[prop]
		};
	}

	this._started = true;
}

/**
 * Sets a delay to the tween
 * @param  {number} delay The delay you want to set in seconds
 * @return {baa.tween}  The tween to allow further extending.
 */
baa.tween.delay = function (delay) {
	baa._checkType("delay",delay,"number");

	this._delay = delay;
	return this;
}

/**
 * Sets the easing to the tween. Easing adapts the way the property transitions to its goal. 
 * @param  {string} easeMode If the easing should be used at the start, at the end, or both.
 * Options: "in", "out", "inout".
 * @param {string} easing The easing you want to use.
 * Options: "linear", "quad", "cubic", "quart", "quint", "expo", "sine", "circ", "back", "elastic"
 * @return {baa.tween}  The tween to allow further extending.
 */
baa.tween.ease = function (easeMode, easing) {
	baa._checkType("easeMode",easeMode,"string");
	baa._checkType("easing",easing,"string");

	this._easeMode = easeMode;
	this._easing = easing;
	return this;
}

/**
 * Sets a function that will be called when the tween starts (after the delay).
 * @param  {string|function} f   The function you want to have called. 
 * This can either be the name of the function as a string, or a function on its own.
 * @param  {object} [obj] The object you want to have the function called. If null, the tween's object is used instead.
 * @return {baa.tween} The tween to allow further extending.     
 */
baa.tween.onStart = function (f, obj) {
	baa._checkType("function",f,"function","string");
	baa._checkType("object",obj,"object",null);

	this.startFunc = f;
	this.startObj = obj || this._obj;
	return this;
}

/**
 * Sets a function that will be called every time the tween updates.
 * @param  {string|function} f   The function you want to have called. 
 * This can either be the name of the function as a string, or a function on its own.
 * @param  {object} [obj] The object you want to have the function called. If null, the tween's object is used instead.
 * @return {baa.tween} The tween to allow further extending.     
 */
baa.tween.onUpdate = function (f, obj) {
	baa._checkType("function",f,"function","string");
	baa._checkType("object",obj,"object",null);

	this.updateFunc = f;
	this.updateObj = obj || this._obj;
	return this;
}

/**
 * Sets a function that will be called when the tween ends.
 * @param  {string|function} f   The function you want to have called. 
 * This can either be the name of the function as a string, or a function on its own.
 * @param  {object} [obj] The object you want to have the function called. If null, the tween's object is used instead.
 * @return {baa.tween} The tween to allow further extending.     
 */
baa.tween.onComplete = function(f, obj) {
	baa._checkType("function",f,"function","string");
	baa._checkType("object",obj,"object",null);

	this.completeFunc = f;
	this.completeObj = obj || this._obj;
	return this;
}

/**
 * Stops the tween, killing it.
 */
baa.tween.stop = function () {
	this.dead = true;
}

/**
 * Sets the tween's progress to 1, setting properties to its final value in the next update.
 * @return {[type]} [description]
 */
baa.tween.rush = function () {
	this._progress = 1;
}

/**
 * Creates a new tween. This can only be done with tweens owned by a tweenmanager.  
 * @param  {object} obj  The object you want to tween. If this is a number instead 
 * the function will take this argument as the rate and shift all other arguments. In this case it will use the manager's object.
 * @param  {number} rate  How long the tween should take in seconds.
 * @param  {object} vars  An object with properties of the object, and the values you want them to tween to.
 * @param  {boolean} force Whether to overwrite properties that already being tweened.
 * @return {baa.tween}       The new tween.
 */
baa.tween.to = function (obj, rate, vars, force) {
	if (!this._manager) { throw("This function can only be called by tweens that are owned by a tweenmanager."); }
	if (typeof(obj) == "number") {
		force = vars;
		vars = rate;
		rate = obj;
		obj = this._obj;
	}

	baa._checkType("rate",rate,"number");
	baa._checkType("vars",vars,"object");
	baa._checkType("force",force,"boolean",null);
	
	this._after = baa.tween.new(obj,rate,vars,this._manager);
	this._after._force = force || false;
	return this._after;
}

/**
 * Adapts progress with easing.
 * @param  {number} p      The progress of the tween. A number between 0 and 1.
 * @param  {string} easeMode  The easemode to use.
 * @param  {string} easing The easing type.
 * @return {number}        The adapted progress.
 */
baa.tween.__ease = function (p, easeMode, easing) {
	if (easing == "linear") { return p; }
	if (easeMode == "out") {
		p = 1 - p;
		p = 1 - baa.tween["__" + easing](p);
	}
	else if (easeMode == "in") {
		p = baa.tween["__" + easing](p);
	}
	else if (easeMode == "easeMode") {
		p = p * 2;
		if (p < 1) {
			return .5 * (baa.tween["__" + easing](p));
		}
		else {
			p = 2 - p;
			return .5 * (1 - (baa.tween["__" + easing](p))) + .5;
		}
	}
	return p;
}

baa.tween.__quad = function (p) {
	return p * p;
}

baa.tween.__cubic = function (p) {
	return p * p * p;
}

baa.tween.__quart = function (p) {
	return p * p * p * p;
}

baa.tween.__quint = function (p) {
	return p * p * p * p *p;
}

baa.tween.__expo = function (p) {
	return Math.pow(2, (10 * (p - 1)));
}

baa.tween.__sine = function (p) {
	return -Math.cos(p * (Math.PI * .5)) + 1;
}

baa.tween.__circ = function (p) {
	return -(Math.sqrt(1 - (p * p)) - 1);
}

baa.tween.__back = function (p) {
	return p * p * (2.7 * p - 1.7);
}

baa.tween.__elastic = function (p) {
	return -(Math.pow(2,(10*(p-1)))*Math.sin((p-1.075)*(Math.PI*2)/.3));
}

//Camera
///////////////////////////

/**
 * A tool that helps you with cameras in your game. Make the camera follow an object, decide the size of the camera, and give it boundaries. You can also zoom in and rotate.
 * @constructor
 * @property {baa.rect} _window The rectangle everything is drawn in.
 * @property {baa.rect} _world The world's boundaries. The camera won't go out of this.
 * @property {baa.rect} _follow The object the camera should follow.
 * @property {baa.point} _velocity The velocity of the camera. This is based on the distance of the object.
 * @property {baa.point} _real The actual position of the camera, meaning the x position + the shake offset.
 * @property {baa.point} _shakeOffset The offset of the camera shake.
 * @property {number} _shakePower The power of the camera shake. The higher the number, the more the camera shakes.
 * @property {baa.timer} _shakeTimer How long the screenshake takes.
 * @property {boolean} active If the camera is active. Set it to false to stop moving and drawing with the camera.
 * @property {number} zoom How far the camera is zoomed in. 1 means not zoomed in at all.
 * @property {number} speed How fast the camera moves.
 * @param 	 {number} x The horizontal position of the camera on the screen.	 
 * @param 	 {number} y The vertical position of the camera on the screen.
 * @param 	 {number} width The width of the camera.
 * @param 	 {number} height The height of the camera.
 */
baa.camera = baa.rect.extend("baa.camera");

baa.camera.init = function (x,y,width,height) {
		baa.camera.super.init(this,x,y,width,height);
		this._window = baa.rect.new(x,y,width,height);
		this._world;
		this._follow;
		this._velocity = baa.point.new();
		this._real = baa.point.new();
		this._shakeOffset = baa.point.new();
		this._shakePower = 1;
		this._shakeTimer = Timer.new(this,0).onUpdate("_screenshake");
		this.active = true;
		this.zoom = 1;
		this.speed = 1;
}

/**
 * Updates the camera's position
 */
baa.camera.update = function () {
	if (this.active) {
		if (this._follow) {
			this._setVelocity();
			this._move();
		}

		this._real.x = Math.floor(this.x + this._shakeOffset.x);
		this._real.y = Math.floor(this.y + this._shakeOffset.y);
	}
}

/**
 * Sets the velocity of the camera
 */
baa.camera._setVelocity = function () {
	if (baa.util.distance(this.centerX(),this.centerY(),this._follow.centerX(),this.centerY()) > 1) {
		// print(this._x,this._follow.x);
		this._velocity.x = Math.abs(this.centerX()-this._follow.centerX()) * baa.util.sign(this.centerX() - this._follow.centerX());
		this._velocity.y = Math.abs(this.centerY()-this._follow.centerY()) * baa.util.sign(this.centerY() - this._follow.centerY());
	}
	else {
		this._velocity.x = 0;
		this._velocity.y = 0;
	}
}

/**
 * Moves the camera
 */
baa.camera._move = function () {
	this.x -= this._velocity.x * this.speed * dt;
	this.y -= this._velocity.y * this.speed * dt;
	if (this._world) {
		this.x = Math.max(this._world.left(),Math.min(this.x, this._world.right()-this.width));
		this.y = Math.max(this._world.top(),Math.min(this.y, this._world.bottom()-this.height));
	}

	if (this._world) {
		this.x = Math.max(this._world.left(),Math.min(this.x, this._world.right()-this.width));
		this.y = Math.max(this._world.top(),Math.min(this.y, this._world.bottom()-this.height));
	}
}

/**
 * Sets the position of the shake offset
 */
baa.camera._screenshake = function () {
	this._shakeOffset.x = Math.cos(Math.random()*Math.PI)*this._shakePower;
	this._shakeOffset.y = Math.sin(Math.random()*Math.PI)*this._shakePower;
}

/**
 * Starts the camera. After this, everything that is drawn, is inside the camera.
 */
baa.camera.start = function () {
	baa.graphics.push();
	baa.graphics.setScissor(
		function () { 
			baa.graphics.rectangle("scissor",this)
		},
		this._window
	);
	// baa.graphics.scale(this._zoom);
	baa.graphics.translate(-this._real.x + this._window.x,-this._real.y + this._window.y);
}

/**
 * Stops the camera. Now everything drawn after this will be drawn normally again.
 */
baa.camera.stop = function () {
	baa.graphics.setScissor();
	baa.graphics.pop();
}

/**
 * Sets the window, the rectangle of the camera on screen. The x and y position decide where the camera will be drawn.
 * @param {number} x      The horizontal position of the camera on screen.
 * @param {number} y      The vertical position of the camera on screen.
 * @param {number} width  The width of the camera.
 * @param {number} height The height of the camera.
 */
baa.camera.setWindow = function (x,y,width,height) {
	this._window.set(x,y,width,height);
	this.width = width;
	this.height = height;
}

/**
 * Sets the boundaries of the world. The camera does not go outside of these boundaries.
 * @param {number} x      The horizontal position of the boundary of the world.
 * @param {number} y      The vertical position of the boundary of the world.
 * @param {number} width  The width of boundary of the world.
 * @param {number} height The height of the boundary of the world.
 */
baa.camera.setWorld = function (x,y,width,height) {
	if (x!=null) {
		this._world = baa.rect.new(x,y,width,height);
	} 
	else {
		this._world = null;
	}
}

/**
 * Sets the object the camera should follow.
 * @param {baa.rect|null} obj The object the camera should follow. If no argument is given, the camera won't follow any object instead. 
 */
baa.camera.setFollow = function (obj) {
	if (obj) {
		this._follow = obj;
	}
	else {
		this._follow = null;
	}
}

/**
 * Returns the object the camera currently follows
 * @return {baa.rect|null} The object the camera follows. If the camera doesn't follow any object, null is returned.
 */
baa.camera.getFollow = function () {
	return this._follow;
}

/**
 * Sets the activation of the camera. 
 * @param {boolean} active 
 */
baa.camera.setActive = function (active) {
	this.active = active
}

/**
 * Returns the current activation state of the camera.
 * @return {boolean} The activation of the camera.
 */
baa.camera.getActive = function () {
	return this.active;
}

/**
 * Shakes the camera.
 * @param  {number} [power=3] How much the screen should shake. Use a number higher than 0. 
 * If 0, shaking currently going on will stop. If null, The default will be used.
 * @param  {number} [time=0.3]  How long the camera should shake.
 */
baa.camera.shake = function (power,time) {
	if (power != 0) {
		this._shakePower = power || 3;
		this._shakeTimer.reset(time || 0.3);
	}
	else {
		this._shakeTimer.reset(0);
	}
}

/**
 * A global camera. It's update and drawn automatically.
 */
Camera = baa.camera.new();

/////////////////////////////
/////////////////////////////

//Debug

baa._debug = Class.extend("baa._debug");

baa._debug.init = function () {
	this.active = false;

	this.playing = true;
	this.hide = false;
	this.speed = 1;

	this.activeHold = ["shift","d"];
	this.activePress = "b";

	this.drawCalls = 0;
	this.oldDrawCalls //We don't want to count the debug drawcalls, so we store the original value in this
	this.barFont = baa.graphics.newFont("arial",16);

	//Buttons
	this.buttonHide = baa.rect.new(260,0,40,40);
	this.buttonRewind = baa.rect.new(300,0,40,40);
	this.buttonPlay = baa.rect.new(340,0,40,40);
	this.buttonForward = baa.rect.new(380,0,40,40);

	this.windows = baa.group.new();
	this.windows.prepare(baa._debug.window);
}

baa._debug.update = function () {
	this.drawCalls = 0;
	if (this.active) {
		if (baa.keyboard.isDown(this.activeHold) && baa.keyboard.isPressed(this.activePress)) {
			this.active = false;
			return;
		}


		if (baa.mouse.isPressed("l")) {
			if (this.buttonPlay.overlaps(baa.mouse)) {
				this.playing = !this.playing;
			}
			else if (this.buttonRewind.overlaps(baa.mouse)) {
				this.speed -= 0.25;
			}
			else if (this.buttonForward.overlaps(baa.mouse)) {
				this.speed += 0.25;
			}
			else if (this.buttonHide.overlaps(baa.mouse)) {
				this.hide = !this.hide;
			}
		}

		dt = dt * this.speed;
		if (!this.playing) {
			dt = 0;
			if (baa.mouse.isPressed("m")) {
				if (this.buttonRewind.overlaps(baa.mouse)) {
					dt = -ot;
				}
				else if (this.buttonForward.overlaps(baa.mouse)) {
					dt = ot;
				} 

			}
		}
	}
	else {
		if (baa.keyboard.isDown(this.activeHold) && baa.keyboard.isPressed(this.activePress)) {
			this.active = true;
		}
	}
}

baa._debug.updateWindows = function () {
	if (this.active && !this.hide) {
		this.windows.update();
	}
}

baa._debug.draw = function () {
	if (this.active) {
		baa.graphics.setLineWidth(3);
		this.oDrawCalls = this.drawCalls;
		if (this.active && !this.hide) {
			this.windows.draw(baa.group.forward);
		}
		this.drawToolBar();

		baa.graphics.setColor(255,255,255,1);
		baa.graphics.setLineWidth(1);
	}
}

baa._debug.drawToolBar = function () {
	baa.graphics.setColor(255,255,255);
	baa.graphics.setAlpha(0.8);
	baa.graphics.rectangle("fill",0,0,baa.graphics.width,40);
	baa.graphics.setColor(0,0,0);
	baa.graphics.setFont(this.barFont);
	baa.graphics.print("FPS: " + Math.floor(this.fps),5,9);
	baa.graphics.line(92,0,92,40);
	baa.graphics.print("Drawcalls: " + this.oDrawCalls,100,9);
	baa.graphics.line(260,0,260,40);
	this.drawToolButtons();
	baa.graphics.setColor(0,0,0);
	baa.graphics.print("Speed: " + this.speed,this.buttonForward.x + 50,10);
}

baa._debug.drawToolButtons = function () {

	//Hide
	baa.graphics.setColor(0,0,0);
	this.buttonHide.draw();
	baa.graphics.setColor(255,255,255);
	this.buttonHide.draw("line");

	//Play
	baa.graphics.setColor(0,0,0);
	this.buttonPlay.draw();
	baa.graphics.setColor(255,255,255);
	this.buttonPlay.draw("line");


	//Rewind
	baa.graphics.setColor(0,0,0);
	this.buttonRewind.draw();
	baa.graphics.setColor(255,255,255);
	this.buttonRewind.draw("line");

	//Forward
	baa.graphics.setColor(0,0,0);
	this.buttonForward.draw();
	baa.graphics.setColor(255,255,255);
	this.buttonForward.draw("line");

	baa.graphics.setColor(255,255,255,1);

	//Hide
	baa.graphics.rectangle("line",this.buttonHide.x + 10,this.buttonHide.y + 10, 20, 20)

	//Rewind
	baa.graphics.star("fill",this.buttonRewind.x + 15, this.buttonRewind.y + 18,10,5,1,Math.PI);
	baa.graphics.star("fill",this.buttonRewind.x + 27, this.buttonRewind.y + 18,10,5,1,Math.PI);

	//Forward
	baa.graphics.star("fill",this.buttonForward.x + 13, this.buttonForward.y + 18,10,5,1);
	baa.graphics.star("fill",this.buttonForward.x + 25, this.buttonRewind.y + 18,10,5,1);
	
	if (this.playing) {
		//Pause
		baa.graphics.rectangle("fill",this.buttonPlay.x + 7,this.buttonPlay.y + 5,10,30);
		baa.graphics.rectangle("fill",this.buttonPlay.x + 23,this.buttonPlay.y + 5,10,30);
	}
	else {
		//Play
		baa.graphics.star("fill",this.buttonPlay.x + 17, this.buttonPlay.y + 19,16,8,3);
	}
}

baa._debug.watch = function (obj,name) {
	this.windows.set("z",0);
	var wndow = baa._debug.window.new( obj, name, 10 + 220 * this.windows.length, 100 );
	wndow.z = 10;
	this.windows.add(wndow);
	this.windows.sort("z",true);

}

baa._debug.mousepressed = function (button,x,y) {
	this.windows.mousepressed(button,x,y);
}

baa._debug.keypressed = function (key) {
	this.windows.keypressed(key);
}

baa._debug.focus = function (wndow) {
	this.windows.set("z",0);
	wndow.z = 10;
	this.windows.sort("z",true);
}

baa._debug.kill = function (wndow) {
	this.windows.remove(wndow);
}

baa._debug.setActivate = function () {
	this.activePress = arguments[arguments.length-1];
	this.activeHold = Array.prototype.slice.call(arguments);
	this.activeHold.splice(arguments.length-1,1)
}


baa._debug.window = Class.extend("baa._debug.window");

baa._debug.types = {
	"object" : [200,100,100],
	"string" : [100,200,100],
	"number" : [100,100,255],
	"boolean" : [200,200,100],
	"array" : [150,50,50]
}

baa._debug.window.init = function (obj,name,x,y) {
	this.x = x;
	this.y = y;
	this.z = Math.random();
	this.dataY = 50;
	this.selectorY = -200;
	this.width = 210;
	this.height = 100;
	this.rounding = 0.5

	this.obj = obj;
	this.originalObject = obj;
	this.objects = [];

	this.showPrivates = false;
	this.longestKeyWord = 0;
	this.textHeightMargin = 20;
	this.textWidth = 8.3;
	this.keysWidth = 0;
	this.longestValueLimit = 13;

	this.selectedKey = "";

	this.editing = false;
	this.editValue = 0;
	this.editType = "number";
	this.editKey = "";
	this.editTimer = 0;

	this.name = name;
	this.names = [];

	this.numberOfValues = 0;

	this.titleBar = baa.rect.new(this.x,this.y,this.width,this.dataY / 2.5);
	this.moving = false;

	this.resizer = baa.rect.new(this.x + this.width - 15,this.y + this.height - 15,20,20);
	this.resizing = false;

	//Menu
	this.buttonBack = baa.rect.new(this.x,this.y + this.dataY / 2.5, 25, 27);
	this.buttonPrivate = baa.rect.new(this.x + 25,this.y + this.dataY / 2.5, 25, 27);
	this.buttonClose = baa.rect.new(this.x + 50,this.y + this.dataY / 2.5, 25, 27);
	
	//Scrolling
	this.scrollHeight = 0;
	this.scrollLimit = 100;


}

baa._debug.window.update = function () {
	// this.width = this.keysWidth;
	// this.keysWidth = this.longestKeyWord * this.textWidth + 10;
	this.longestValueLimit = Math.floor( (this.width - this.keysWidth) / this.textWidth);
	this.scrollLimit = this.numberOfValues * (this.textHeightMargin+1) - (this.height - this.dataY/1.8);

	if (baa.mouse.isPressed("l")) {
		if (this.resizer.overlaps(baa.mouse)) {
			baa.mouse.catchPressed("l");
			this.resizing = true;
		}
		else if (this.titleBar.overlaps(baa.mouse)) {
			baa.debug.focus(this);
			this.moving = true;
			baa.mouse.catchPressed("l");
		}
		else if (this.buttonBack.overlaps(baa.mouse)) {
			if (this.objects.length > 0) {
				this.goBackObject();
			}
			baa.mouse.catchPressed("l");
		}
		else if (this.buttonPrivate.overlaps(baa.mouse)) {
			this.showPrivates = !this.showPrivates;
			baa.mouse.catchPressed("l");
		}
		else if (this.buttonClose.overlaps(baa.mouse)) {
			baa.debug.kill(this);
		}
	}

	if (baa.mouse.isReleased("l")) {
		this.resizing = false;
		this.moving = false;
	}

	if (this.resizing) {
		this.width = baa.mouse.getX() - this.x + 10;
		this.height = baa.mouse.getY() - this.y + 10;
		this.titleBar.width = this.width;
		this.scrollHeight = 0;
	}

	if (this.moving) {
		this.setPosition(baa.mouse.getX(),baa.mouse.getY());
	}

	this.resizer.x = this.x + this.width - 15;
	this.resizer.y = this.y + this.height - 15;

	this.editTimer += dt;
	if (this.editTimer > 1.5) {
		this.editTimer = 0;
	}
}

baa._debug.window.draw = function () {
	this.drawData();
	this.drawButtons();
	this.drawRectangle();
	this.drawName();
	if (!this.resizing && !this.moving) {
		this.drawSelector();
	}
	baa.graphics.setColor(255,255,255);
	this.resizer.draw("both",2);
}

baa._debug.window.drawRectangle = function () {
	baa.graphics.setColor(255,255,255,1);
	baa.graphics.setLineWidth(3);
	baa.graphics.rectangle("line",this.x,this.y,this.width,this.height,this.rounding);
}

baa._debug.window.drawName = function () {
	baa.graphics.setColor(255,255,255,1);
	this.titleBar.draw("both",1.8);
	baa.graphics.setColor(0,0,0);
	var str = this.name;
	for (var i = 0; i < this.names.length; i++) {
		str = str + " -> ";
		str = str + this.names[i];
	}
	baa.graphics.print(str,this.x+5,this.y+4);
}

baa._debug.window.drawButtons = function () {
	baa.graphics.setColor(0,0,0);
	baa.graphics.rectangle("fill",this.buttonBack.x,this.buttonBack.y,this.width,27);

	if (this.objects.length > 0) {
		baa.graphics.setColor(255,255,255,1);
		this.buttonBack.draw();
		baa.graphics.setAlpha(0.3)
		baa.graphics.setColor(0,0,0);
		this.buttonBack.draw("line");
		baa.graphics.setAlpha(1)
		baa.graphics.print("B",this.buttonBack.x+8,this.buttonBack.y+8);
	}

	baa.graphics.setColor(255,255,255);
	this.buttonPrivate.draw();
	baa.graphics.setColor(0,0,0);
	baa.graphics.setAlpha(0.3)
	this.buttonPrivate.draw("line");
	baa.graphics.setAlpha(1)
	baa.graphics.print("P",this.buttonPrivate.x+8,this.buttonPrivate.y+8);

	baa.graphics.setColor(255,255,255);
	this.buttonClose.draw();
	baa.graphics.setColor(0,0,0);
	baa.graphics.setAlpha(0.3);
	this.buttonClose.draw("line");
	baa.graphics.setAlpha(1);
	baa.graphics.print("X",this.buttonClose.x+8,this.buttonClose.y+8);

	baa.graphics.setColor(255,255,255);
	baa.graphics.rectangle("line",this.buttonBack.x,this.buttonBack.y,this.width,27);
}

baa._debug.window.drawData = function () {
	//TODO: Zorg ervoor dat dit niet meer in draw staat. Veel shit wordt hier gemaakt
	//en geupdate, wat in de update loop moet. Bovendien zorgt het voor die bug
	//die er voor zorgt dat je op dingen achteraan eerst klikt. Dank u!

	function shape () {
		baa.graphics.rectangle("scissor",this.x,this.y,this.width,this.height);
	}
	baa.graphics.setScissor(shape,this);
	var i = 0;


	this.longestKeyWord = 0;

	for (var key in this.obj) {
		if (this.obj[key] == undefined) {
			if (key == "") {
				delete(this.obj[key]);
			}
		}
		var type = typeof(this.obj[key]);
		var sbstr = key.substring(0,1);
		var value = this.obj[key];
		var rect = baa.rect.new();
		
		if (type == "number") {
			//We don't want long decimals.
			value = Math.floor(value*100)/100;
		}
		else if (type == "string") {
			value = '"' + value + '"';
		}
		else if (type == "object") {
			if (Class.isClass(this.obj[key])) {
				value = this.obj[key].type();
			}
			else if (Array.isArray(this.obj[key])) {
				type = "array"
				value = "Array (" + this.obj[key].length + ")";
			}
		}

		if (type != "function" /* && this.obj[key]!=undefined */) {
			if (sbstr == "_" && this.showPrivates || sbstr != "_" ) {
				baa.graphics.setColor(baa.debug.types[type])
				baa.graphics.setAlpha(0.8);
				var y = this.getDataY(i) - 3;
				rect.set(this.x,y,this.width,this.textHeightMargin);
				if (y > this.y + 40 && y < this.y + this.height) {
					rect.draw("fill");
					if (!this.resizing) {
						if (rect.overlaps(baa.mouse)) {
							this.selectorY = rect.y;
							if (baa.mouse.isPressed("l") || baa.mouse.isPressed("m")) {
								var shouldBreak = this.clickedOnKey(key,type);
								// baa.mouse.catchPressed("l");
								// baa.mouse.catchPressed("m");
								if (shouldBreak) {
									break;
								}
							}
						}
					}
					baa.graphics.setColor(255,255,255,1)
					baa.graphics.print(key, this.x+10, this.getDataY(i));
					if (this.editing && this.editKey == key) {
						baa.graphics.print(this.editValue + (this.editTimer > 0.75 ? "_" : ""), this.x + this.keysWidth + 10, this.getDataY(i));
					}
					else {
						baa.graphics.print("" + value, this.x + this.keysWidth + 10, this.getDataY(i));
					}
					this.keysWidth = Math.max(this.keysWidth,baa.graphics.getTextWidth(key) + 10);
				}
				i++;
			}
		}
	}

	this.numberOfValues = i;

	baa.graphics.setScissor();
}

baa._debug.window.drawSelector = function () {
	if (this.selectorY > this.y + 40) {
		baa.graphics.setAlpha(0.4);
		baa.graphics.setColor(255,255,255);
		baa.graphics.rectangle("fill",this.x,this.selectorY,this.width,this.textHeightMargin);
		baa.graphics.setAlpha(1);
	}
}

baa._debug.window.getDataY = function (i) {
	return this.y - this.scrollHeight + this.textHeightMargin * i + this.dataY;
}

baa._debug.window.setPosition = function (x,y) {
	this.x = x-this.width/2;
	this.y = y-this.titleBar.height/2;
	this.titleBar.x = this.x;
	this.titleBar.y = this.y;

	this.buttonBack.x = this.x
	this.buttonBack.y = this.y + this.dataY / 2.5;

	this.buttonPrivate.x = this.x + 25;
	this.buttonPrivate.y = this.y + this.dataY / 2.5;

	this.buttonClose.x = this.x + 50;
	this.buttonClose.y = this.y + this.dataY / 2.5;
}

baa._debug.window.mousepressed = function (button,x,y) {
	if (button == "wd") {
		if (this.scrollLimit > 0) {
			this.scrollHeight = Math.min(this.scrollHeight + 20, this.scrollLimit);
		}
	}
	else if (button == "wu") {
		this.scrollHeight = Math.max(this.scrollHeight - 20, 0);
	}
}

baa._debug.window.keypressed = function (key) {
	if (this.editing) {
		if (key == "return") {
			this.confirmEdit();
		}
		else if (key == "escape") {
			this.cancelEdit();
		}
		else if (this.editType == "number") {
			this.pressNumber(key);
		}
		else if (this.editType == "string") {
			this.pressString(key);
		}
	}
	else if (key == "return") {
		if (this.editKey != "") {
			this.editing = true
		}
	}
}

baa._debug.window.pressNumber = function (key) {
	if (!isNaN(key)) {
		this.editValue = this.editValue + key;
	}
	else {
		if (key == "backspace") {
			this.editValue = this.editValue.substring(0,this.editValue.length-1);
		}
		else if (key == "." && this.editValue.length > 0 && this.editValue.indexOf(".") == -1 && this.editValue.indexOf("-") < this.editValue.length-1) {
			this.editValue = this.editValue + ".";
		}
		else if (key == "-" && this.editValue.length == 0) {
			this.editValue = this.editValue + "-";
		} 
	}
}

baa._debug.window.pressString = function (key) {
	if (key.length == 1) {
		if (baa.keyboard.isDown("shift")) {
			this.editValue = this.editValue + key.toUpperCase();
		}
		else {
			this.editValue = this.editValue + key;
		}
	}
	else {
		if (key == "backspace") {
			this.editValue = this.editValue.substring(0,this.editValue.length-1);
		}
	}
}


baa._debug.window.clickedOnKey = function (key,type,pressed) {
	baa.mouse.catchPressed("l");
	if (type == "boolean") {
		this.obj[key] = !this.obj[key];
		this.cancelEdit();
		return false;
	}
	else if (type == "number" || type == "string") {
		if (key == this.editKey && this.editing) {
			this.editValue = "";
			return false;
		}
		else {
			if (this.editing) { this.cancelEdit(); }

			if (type == "number") {
				this.editValue = "" + Math.floor(this.obj[key]*100)/100;
			}
			else {
				this.editValue = "" + this.obj[key];
			}
			this.editType = type;
			this.editKey = key;
			this.editing = true;
			this.editOriginal = this.obj[key];
			return false;
		}
	}
	else if (type == "object" || type == "array") {
		if (baa.mouse.isPressed("m")) {
			baa.debug.watch(this.obj[key],key);
			baa.mouse.catchPressed("m");
			return false;
		}
		else {
			this.setObject(this.obj[key],key);
			return true;
		}
	}
}

baa._debug.window.setObject = function (obj,name) {
	this.cancelEdit();
	this.editKey = "";
	this.scrollHeight = 0;
	this.obj = obj;
	this.objects.push(obj);
	this.names.push(name);
}

baa._debug.window.goBackObject = function () {
	this.cancelEdit();
	this.editKey = "";
	this.scrollHeight = 0;
	if (this.objects.length > 1) {
		this.obj = this.objects[this.objects.length-2];
		this.objects.pop();
		this.names.pop();
	}
	else {
		this.obj = this.originalObject;
		this.names = [];
		this.objects = [];
	}
}

baa._debug.window.cancelEdit = function () {
	if (this.editing) {
		this.editing = false;
		this.obj[this.editKey] = this.editOriginal;
		this.editKey = "";
	}
}

baa._debug.window.confirmEdit = function () {
	if (this.editing) {
		if (this.editKey != "") {
			this.editing = false;
			if (this.editType == "number") {
				this.obj[this.editKey] = Number(this.editValue);
			}
			else {
				this.obj[this.editKey] = this.editValue;
			}
		}
	}
}

// baa._debug.window.draw

baa.debug = baa._debug.new();


//Oh en misschien ook object debug drawing (body rectangle shizzle, van die rode vierkanten)

//Zorg dat windows niet out of bounds kunnen. ( eh..)

//Button to see fps graph (????)


//TODO
////DEBUUGGG
//Make windows contain objects.
//Er is een main window, en door in het main window op variables te klikken
//met middle mouse knop open je een nieuw window.
//Het main window moet 'game' bevatten.


//List of stuff to add:
/*
baa.graphics.push and pop for colors, linewidth, all that stuff.

baa.button class

*/

 