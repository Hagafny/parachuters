import GameArea from "./New/Components/GameArea";
import BaseComponent from "./New/Components/BaseComponent";
import Boat from "./New/Components/Boat";
import Plane from "./New/Components/Plane"

const gameWidth = 800, gameHeight = 600, FPS = 60;
const gameArea = new GameArea(gameWidth, gameHeight);

const background = new BaseComponent(getBackgorundSettings());
const water = new BaseComponent(getWaterSettings());
const boat = new Boat(getBoatSettings());
const plane = new Plane(getPlaneSettings());

let gameLoopInterval;
initializeGame();

function initializeGame() {
    subscribeToEvents();
    setServices();
    createComponents();
    startGameLoop();
}

function subscribeToEvents() {

}

function setServices() {

}

function createComponents() {

}

function startGameLoop() {
    gameLoopInterval = setInterval(gameLoop, 1000 / FPS);
}

// This is the main loop of the game and is called x times a second. Here we clean the canvas and redrew again.
function gameLoop() {
    gameArea.clear();

    background.draw(gameArea.context);
    water.draw(gameArea.context);

    //     levelText.text = getLevelText();
    //     levelText.draw(gameArea.context);
    // 
    //     scoreText.text = getScoreText();
    //     scoreText.draw(gameArea.context);
    // 
    //     lifeText.text = getLivesText();
    //     lifeText.draw(gameArea.context);

    boat.update(); // update the behavior of the boat
    boat.draw(gameArea.context); // redraw the boat

    plane.update(); // update the behavior of the plane
    plane.draw(gameArea.context); // redraw the plane

}

function getBackgorundSettings() {

    return { width: gameWidth, height: gameHeight, x: 0, y: 0, image: "img/background.jpg" };
}

function getWaterSettings() {
    var waterSettings = { width: gameWidth, height: gameHeight / 3, x: 0, image: "img/water.jpg" };
    waterSettings.y = gameHeight - waterSettings.height;
    return waterSettings;

}

function getBoatSettings() {
    var boatSettings = { width: 110, height: 55, image: "img/boat.png", gameWidth: gameWidth };
    boatSettings.x = gameWidth - boatSettings.width;
    boatSettings.y = gameHeight - water.height - boatSettings.height;
    return boatSettings;
}

function getPlaneSettings() {
    var planeSettings = { width: 80, height: 80, y: 0, x: 0, image: "img/plane.png", gameWidth: gameWidth };
    return planeSettings;
}