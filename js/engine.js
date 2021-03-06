/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        'use strict';
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);

        /* When the game is started it will go to the start screen and set go to true
         * Once go is set to true the game screen will render
         */
        if(go){
            render(); // Render the game
        }else{
            renderStartScreen(); // Render start screen
        }

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        'use strict';
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        'use strict';
        updateEntities(dt);
        checkCollisions();
        checkPickup();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods. updateExtras function was added to handle extra features
     * added to the game, like the gem object and updating their data/propeeties.
     */
    function updateEntities(dt) {
        'use strict';
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
        updateExtras();
    }

    /* Reset gem value status if the player is at starting position and all gems
     * have been picked up
     */
    function updateExtras() {
        'use strict';
        if(gemCount === 3  && player.set){
            gemList.forEach(function(gem) {
                gem.reset();
            });
            gemCount = 0;
        }
    }

    /* This function draws the score board and level box for the game and updates
     * the score and game level as the game is being played. This function also
     * draws the gems on the game board
     */
    function renderExtras(){
        'use strict';
        // Render the scoreboard
        ctx.clearRect(0,0,505,49);
        ctx.clearRect(0,588,505,30);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.clearRect(0, 0, 200, 50);
        ctx.strokeRect(0, 0, 200, 50);
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.textAlign = "left";
        ctx.fillText("Score: "+player.score, 50, 30);

        // Render game level box
        ctx.strokeRect(305, 0, 200, 50);
        ctx.font = "20px Arial";
        ctx.textAlign = "left";
        ctx.fillText("Level: "+player.level, 380, 30);

        // Render the game footer "Press Enter to Exit or Press Space to Change Character"
        ctx.fillStyle = "blue";
        ctx.font = "18px Arial";
        ctx.fillText("Press Enter to Exit or Press Space to Change Character", 20, 605);

        /* Loop through all of the objects within the gemList array and call
         * the render function.
         */
        gemList.forEach(function(gem) {
            if(!gem.status){
                gem.render();
            }
        });


    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        'use strict';
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderExtras();

        renderEntities();
    }

    /* This function draws the start screen for the game
     * The  player can press ENTER to start the game or
     * The player can press SPACE to change the player
     */
    function renderStartScreen(){
        'use strict';
        var topLine = "Press Enter to Start!",
        bottomLine = "Press Space to Change Player";
        ctx.clearRect(0,0,505,606);
        ctx.fillStyle = "rgb(102, 163, 255)"; // light blue
        ctx.fillRect(0,0,505,606);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.strokeRect(0,0,505,606);
        ctx.font = "25pt Impact";
        ctx.textAlign = "center";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.fillStyle = "rgb(255, 255, 0)"; //yellow
        ctx.fillText(topLine, canvas.width/2, 100);
        ctx.strokeText(topLine, canvas.width/2, 100);
        ctx.fillText(bottomLine, canvas.width/2, canvas.height-200);
        ctx.strokeText(bottomLine, canvas.width/2, canvas.height-200);
        ctx.fillStyle = "rgb(102, 163, 255)"; // light blue
        ctx.fillRect(200, canvas.height-190, 101, 171);
        ctx.drawImage(Resources.get(charImages[space]), 200, canvas.height-190, 101, 171);
    }



    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        'use strict';
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        'use strict';
        player.reset();
        if(gemCount === 3){
            gemList.forEach(function(gem) {
                gem.reset();
            });
        }
    }

    /* This function detects the collision between the player and an enemy  */
    function checkCollisions(){
        'use strict';
        var status = false;
        allEnemies.forEach(function(enemy) {
            status = player.collision(enemy);
            if( status === true){
                reset();
            }
        });
    }

    /* Function checkPickup checks if a gem has been picked up by the player */
    function checkPickup(){
        'use strict';
        gemList.forEach(function(gem) {
            if(!gem.status){
                player.gemPickup(gem);
            }
        });
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Gem-Blue.png',
        'images/Gem-Green.png',
        'images/Gem-Orange.png',
        'images/Heart.png',
        'images/Key.png',
        'images/Rock.png',
        'images/Star.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
