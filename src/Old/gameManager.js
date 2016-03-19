var Parachuters = Parachuters || {};
Parachuters.Services = Parachuters.Services || {};
Parachuters.Components = Parachuters.Components || {};

(function () {
    // Properties
    var gameArea, background, water, boat, plane, parachuters = [], lifeText, scoreText, levelText, gameLoop;
    var components = Parachuters.Components;
    var FPS = 60; //Frames per second. 
    var canvasDimensions = {
        width: 800,
        height: 600
    }
    var cyclesPerLevel = 3; // Amount of plane cycles needed to level up.
    var planeCycles = 0; // Plane cycle counter
        
    // Services
    var lifeService, scoreService, levelService;

    initialize();

    function initialize() {
        subscribeToEvents();
        setServices();
        createComponents();
        startGameLoop();
    }
    /* register to the events the game will shout at us */
    function subscribeToEvents() {
        document.body.addEventListener("gameOver", stopGame, false);
        document.body.addEventListener("parachuterDropped", dropParachuter, false);
        document.body.addEventListener("hitsBoat", removeParachuter, false);
        document.body.addEventListener("hitsWater", removeParachuter, false);
        document.body.addEventListener("planeFinishedCycle", planeFinishedCycle, false);


    }

    function planeFinishedCycle() {
        planeCycles++;
        if (planeCycles % cyclesPerLevel == 0) {
            levelService.levelUp();
            plane.parachutersPerCycle = levelService.getCurrentLevel();
        }
    }

    function createComponents() {
        gameArea = new components.GameArea(canvasDimensions); //Create the canvas itself.

        background = new components.BaseComponent({ width: canvasDimensions.width, height: canvasDimensions.height, x: 0, y: 0, img: "img/background.jpg" }); // Add a background

        // create water component
        var waterSettings = { width: canvasDimensions.width, height: canvasDimensions.height / 3, x: 0, img: "img/water.jpg" };
        waterSettings.y = canvasDimensions.height - waterSettings.height;
        water = new components.BaseComponent(waterSettings); 

        // create boat component
        var boatSettings = { width: 110, height: 55, img: "img/boat.png", canvasDimensions: canvasDimensions };
        boatSettings.x = canvasDimensions.width - boatSettings.width;
        boatSettings.y = canvasDimensions.height - water.height - boatSettings.height;
        boat = new components.Boat(boatSettings);

        // create plane component
        var planeSettings = { width: 80, height: 80, y: 0, type: 'image', img: "img/plane.png", canvasDimensions: canvasDimensions };
        plane = new components.Plane(planeSettings);

        // create level text component
        var levelTextSettings = { x: 0, text: getLevelText() };
        levelTextSettings.y = canvasDimensions.height / 3;
        levelText = new components.Text(levelTextSettings);
            
        // create life text component
        var lifeTextSettings = { x: 0, text: getLivesText() };
        lifeTextSettings.y = levelTextSettings.y + 40;
        lifeText = new components.Text(lifeTextSettings);
            
        // create score text component
        var scoreTextSettings = { x: 0, text: getScoreText() };
        scoreTextSettings.y = lifeTextSettings.y + 40;
        scoreText = new components.Text(scoreTextSettings);

    }

    // Instantiate the services we use and assaign private variables to them
    function setServices() {
        lifeService = Parachuters.Services.LifeService();
        scoreService = Parachuters.Services.ScoreService();
        levelService = Parachuters.Services.LevelService();

    }

    // Stop the game when it's game over. This will make the screen freeze.
    function stopGame() {
        clearInterval(gameLoop);
    }

    // The game itself runs inside a game loop. This fires the UpdateGame once every 1000/ FPS.
    function startGameLoop() {
        gameLoop = setInterval(updateGame, 1000 / FPS);
    }

    // This is called when we successfully catch a 'parachuterDropped' event that is fired from the Plane object. This creates an instance of a parachuter and adds it to the parachuters array
    function dropParachuter(e) {
        parachuters.push(new components.Parachuter(
            {
                id: parachuters.length - 1,
                width: 50,
                height: 50,
                y: 0,
                img: "img/parachuter.png",
                x: e.detail,
                water: water, //We need a reference to the water object to detect collision
                boat: boat, //We need a reference to the boat object to detect collision
            }
            ));
    }

    // This is called when we successfully catch a 'hitsBoat' or 'hitsWater' event that is fired from the parachuter object. We remove the parachuter from the parachuters array.
    // Once it is removed from the array, it will disappear with the next gameArea.clear() call.
    function removeParachuter(e) {
        parachuters.splice(e.detail.id, 1);
    }

    // This is the main loop of the game and is called x times a second. Here we clean the canvas and redrew again.
    function updateGame() {
        gameArea.clear(); //Clears the canvas
        background.draw(gameArea.context);

        water.draw(gameArea.context);

        levelText.text = getLevelText();
        levelText.draw(gameArea.context);

        scoreText.text = getScoreText();
        scoreText.draw(gameArea.context);

        lifeText.text = getLivesText();
        lifeText.draw(gameArea.context);

        boat.update(); // update the behavior of the boat
        boat.draw(gameArea.context); // redraw the boat

        plane.update(); // update the behavior of the plane
        plane.draw(gameArea.context); // redraw the plane


        // We might have more than 1 parachuter in the game. Iterate over every parachuter.
        for (var i = 0; i < parachuters.length; i++) {
            parachuters[i].update(); // update the behavior of the parachuter. Notice that inside the update function, we might call 'hitsX' and essentially remove the parachuter from the game.

            if (parachuters[i]) // at this point, the parachuters might not be at the parachuters array because they hit the boat/water. If he's not, he will be null and we will stop drawing it.
                parachuters[i].draw(gameArea.context);
        }


    }
        
    //Returns the level text
    function getLevelText() {
        return "LEVEL: " + levelService.getCurrentLevel();
    }

    //Returns the score text
    function getScoreText() {
        return "SCORE: " + scoreService.getScore();
    }

    //Returns the lives text
    function getLivesText() {
        return "LIVES: " + lifeService.getCurrentLives();
    }
})()