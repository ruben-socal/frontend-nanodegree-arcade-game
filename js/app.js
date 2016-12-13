var go = false, // Toggle between start screen and game
    gemCount = 0,
    space = 0,
    charImages = [
            'images/char-boy.png',
            'images/char-cat-girl.png',
            'images/char-horn-girl.png',
            'images/char-pink-girl.png',
            'images/char-princess-girl.png'
    ];

// Enemies our player must avoid
var Enemy = function(x,y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.width = 73;
    this.height = 43;
    var x_speed = [160, 160, 260, 260, 360, 360];
    this.speed = x_speed[Math.floor(Math.random() * x_speed.length)];
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var y_position = [60,145,225];
    var x_speed = [160, 160, 260, 260, 360, 360];
    if( this.x < 500){
        this.x += this.speed * dt;
    }
    else{
        this.x = 0;
        //choose from y_position array 3 locations for randomizer to choose from for y-axis
        this.y = y_position[Math.floor(Math.random() * y_position.length)];
        //choose from x_speed array 5 different speeds for randomizer to choose from for speed
        this.speed = x_speed[Math.floor(Math.random() * x_speed.length)];
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x,y){
    this.sprite = charImages[space];
    this.x = x;
    this.y = y;
    this.width = 73;
    this.height = 43;
    this.score = 0;
    this.set = false;
    this.level = 1;
};

// Update the player's position, required method for game
// only update position if player gas reached the water
Player.prototype.update = function() {
    // currently used as won for player
    if(this.y === -35){
        this.x = 200;
        this.y = 380;
        this.score += 5;
        this.set = true;
    }
    if(this.score > 499){
        this.level = 2;
    }else if(this.score > 999){
        this.level = 3;
    }else if(this.score > 1499){
        this.level = 4;
    }else if(this.score > 1999){
        this.level = 5;
    }
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* Handle keyboard input for arrow keys up, down, right, left.
 * enter and space keys added to handle start screen and change character.
 */
Player.prototype.handleInput = function(direction) {
   // x-axis is used by left, right keys
   // y-axis is used by up, down keys
   if(direction === 'enter'){
        go = !go;
        this.score = 0;
        this.level = 1;
        gemList.forEach(function(gem) {
            gem.reset();
        });
    }else if(direction === 'space'){
        if(space < charImages.length-1){
            space++;
            player.changeChar(charImages[space]);
        }else{
            space = 0;
            player.changeChar(charImages[space]);
        }
    }else if(direction === 'left' && this.x > 0){
        this.x -= 100;
        this.set = false;
   }
   else if(direction === 'right' && this.x < 400){
        this.x += 100;
        this.set = false;
   }
   else if(direction === 'up' && this.y > 47){
        this.y -= 83;
        this.set = false;
   }
   else if(direction === 'down' && this.y < 300){
        this.y += 83;
        this.set = false;
   }

};

// Function collision checks if a player collides with an enemy
Player.prototype.collision = function(enemy) {
   // Axis-Aligned Bounding Box used to detect collision between rectangles
   if (enemy.x < this.x + this.width &&
       enemy.x + enemy.width > this.x &&
       enemy.y < this.y + this.height &&
       enemy.height + enemy.y > this.y) {
        // collision detected!
        this.set = true;
        if(this.score > 4){
            this.score -= 5;
        }
        return true;
    }else{
        return false;
    }
};

// Function gemPickup checks if player pickups a gem
Player.prototype.gemPickup = function(gem) {
   // Axis-Aligned Bounding Box used to detect collision between rectangles
   if (gem.x < this.x + this.width &&
       gem.x + gem.width > this.x &&
       gem.y < this.y + this.height &&
       gem.height + gem.y > this.y) {
       // gem pickup detected!
       this.score += 10;
       gem.status = true;
       gemCount++;
    }
};

//Reset player to begining position
Player.prototype.reset = function(){
    this.x = 200;
    this.y = 380;
};

// Function changeChar will change the player character
Player.prototype.changeChar = function(image){
    this.sprite = image;
};

/* Gem class used to create gems for the game */
var Gem = function(x,y,image){
    this.sprite = image;
    this.x = x;
    this.y = y;
    this.width = 73;
    this.height = 43;
    this.status = false;
};

/* Function render draws the gems on the game board */
Gem.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Reset gems on the game board
Gem.prototype.reset = function(){
    this.status = false;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies. allowed: y-axis 100-300
// Place the player object in a variable called player
var enemy1 = new Enemy(50, 225),
    enemy2 = new Enemy(450, 60),
    enemy3 = new Enemy(250, 145),
    allEnemies = [enemy1, enemy2, enemy3],
    player = new Player(200, 380),
    gem1 = new Gem(1,60,'images/Gem-Blue.png'),
    gem2 = new Gem(201,145,'images/Gem-Green.png'),
    gem3 = new Gem(403,60,'images/Gem-Orange.png'),
    gemList = [gem1,gem2,gem3];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        13: 'enter',
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
     player.handleInput(allowedKeys[e.keyCode]);
});
