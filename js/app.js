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
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var y_position = [60,145,225];
    var speed = Math.random() * 260;
    if( this.x < 500){
        this.x += speed * dt;
    }
    else{
        this.x = 0;
        //choose from y_position array 3 locations for randomizer to choose from for y-axis
        this.y = y_position[Math.floor(Math.random() * y_position.length)];
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
    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;
    this.width = 73;
    this.height = 43;
};

// Update the player's position, required method for game
// only update position if player gas reached the water
Player.prototype.update = function() {
    // currently used as won for player
    if(this.y === -35){
        this.x = 200;
        this.y = 380;
    }
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Handle keyboard input from up, down, right, left arrow.
Player.prototype.handleInput = function(direction) {
   // need to create players next position on the board
   // x-axis is used by left, right keys
   // y-axis is used by up, down keys
   if(direction === 'left' && this.x > 0){
        this.x -= 100;
   }
   else if(direction === 'right' && this.x < 400){
        this.x += 100;
   }
   else if(direction === 'up' && this.y > 47){
        this.y -= 83;
   }
   else if(direction === 'down' && this.y < 300){
        this.y += 83;
   }

};

// Checks if player collides with enemy
Player.prototype.collision = function(enemy) {
   // Axis-Aligned Bounding Box used to detect collision between rectangles
   if (enemy.x < this.x + this.width &&
       enemy.x + enemy.width > this.x &&
       enemy.y < this.y + this.height &&
       enemy.height + enemy.y > this.y) {
        // collision detected!
        return true;
    }else{
        return false;
    }
};

//Reset player to begining position
Player.prototype.reset = function(){
    this.x = 200;
    this.y = 380;
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies. allowed: y-axis 100-300
// Place the player object in a variable called player
var enemy1 = new Enemy(50, 225);
var enemy2 = new Enemy(450, 60);
var enemy3 = new Enemy(250, 145);
var allEnemies = [enemy1, enemy2, enemy3];
//var allEnemies = [enemy1];
var player = new Player(200, 380);



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
