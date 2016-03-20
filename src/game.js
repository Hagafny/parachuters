import "./css/style.css";


import GameArea from "./js/Components/GameArea";
import TextComponent from "./js/Components/TextComponent";
import BaseComponent from "./js/Components/BaseComponent";
import Boat from "./js/Components/Boat";
import Plane from "./js/Components/Plane"
import Parachuter from "./js/Components/Parachuter";


import LevelService from "./js/Services/LevelService";
import LifeService from "./js/Services/LifeService";
import ScoreService from "./js/Services/ScoreService";

const levelService = new LevelService(),
    lifeService = new LifeService(),
    scoreService = new ScoreService(),

    gameWidth = 800,
    gameHeight = 600,
    FPS = 60,
    gameArea = new GameArea(gameWidth, gameHeight),
    background = new BaseComponent(getBackgorundSettings()),
    water = new BaseComponent(getWaterSettings()),
    boat = new Boat(getBoatSettings()),
    plane = new Plane(getPlaneSettings()),

    levelText = new TextComponent(getLevelTextSettings()),
    lifeText = new TextComponent(getLifeTextSettings()),
    scoreText = new TextComponent(getScoreTextSetting());

let gameLoopInterval,
    parachuters = [],
    cyclesPerLevel = 1, // Amount of plane cycles needed to level up.
    planeCycles = 3; // Plane cycle counter;


initializeGame();

function initializeGame() {
    subscribeToEvents();
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

function startGameLoop() {
    gameLoopInterval = setInterval(gameLoop, 1000 / FPS);
}

// This is the main loop of the game and is called x times a second. Here we clean the canvas and redrew again.
function gameLoop() {
    gameArea.clear();

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
    for (let i = 0; i < parachuters.length; i++) {
        parachuters[i].update(); // update the behavior of the parachuter. Notice that inside the update function, we might call 'hitsX' and essentially remove the parachuter from the game.

        if (parachuters[i]) // at this point, the parachuters might not be at the parachuters array because they hit the boat/water. If he's not, he will be null and we will stop drawing it.
            parachuters[i].draw(gameArea.context);
    }

}

// Stop the game when it's game over. This will make the screen freeze.
function stopGame() {
    clearInterval(gameLoopInterval);
}

// This is called when we successfully catch a 'parachuterDropped' event that is fired from the Plane object. This creates an instance of a parachuter and adds it to the parachuters array
function dropParachuter(e) {
    parachuters.push(new Parachuter(
        {
            id: parachuters.length - 1,
            width: 50,
            height: 50,
            y: 0,
            image: "img/parachuter.png",
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


function planeFinishedCycle() {
    planeCycles++;
    if (planeCycles % cyclesPerLevel == 0) {
        levelService.levelUp();
        plane.parachutersPerCycle = levelService.level;
    }
}

function getBackgorundSettings() {
    let backgroundSettings = { width: gameWidth, height: gameHeight, x: 0, y: 0, image: "img/background.jpg" };
    return backgroundSettings;
}

function getWaterSettings() {
    let waterSettings = { width: gameWidth, height: gameHeight / 3, x: 0, image: "img/water.jpg" };
    waterSettings.y = gameHeight - waterSettings.height;
    return waterSettings;

}

function getBoatSettings() {
    let boatSettings = { width: 110, height: 55, image: "img/boat.png", gameWidth: gameWidth };
    boatSettings.x = gameWidth - boatSettings.width;
    boatSettings.y = gameHeight - water.height - boatSettings.height;
    return boatSettings;
}

function getPlaneSettings() {
    let planeSettings = { width: 80, height: 80, y: 0, x: 0, image: "img/plane.png", gameWidth: gameWidth };
    return planeSettings;
}

function getLevelTextSettings() {
    let levelTextSettings = { x: 0, y: gameHeight / 3 };
    return levelTextSettings;
}

function getLifeTextSettings() {
    let lifeTextSettings = { x: 0, y: levelText.y + 40 };
    return lifeTextSettings;
}


function getScoreTextSetting() {
    let scoreTextSettings = { x: 0, y: lifeText.y + 40 };
    return scoreTextSettings;
}

//Returns the level text
function getLevelText() {
    return `LEVEL: ${levelService.level}`;
}

//Returns the lives text
function getLivesText() {
    return `LIVES: ${lifeService.lives}`;
}

//Returns the score text
function getScoreText() {
    return `SCORE: ${scoreService.score}`;
}