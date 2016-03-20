
/**
* In charge of lives
*
* @class LifeService
* @constructor
*/

let s_currentLives = Symbol(), gameOverEvent;

export default class LifeService {
    constructor() {
       let initialLives = 3;
       this[s_currentLives] = initialLives;

       this.subscribeToEvents();
       this.createEvents();
    }

    get lives() {
        return this[s_currentLives];
    }

    createEvents() {
        gameOverEvent = new CustomEvent("gameOver");
    }
    subscribeToEvents() {
        document.body.addEventListener("hitsWater", () => { this.loseLife(); }, false); //Listen to the hitsWater event and fire a loseLife function.
    }

    loseLife() {
        if (this.lives > 0) // Prevent Lives from reaching minus values.
            this[s_currentLives]--;

        if (this.lives === 0) // No more lives.
            this.raiseGameOver();
    }
        
    // This will raise the gameOver event and essentially finish the game. Notice that I put a setTimeout because I want the frames to the changes the lives to 0 before the game ends.
    // If I didn't put a setTimeout here, the game will be over with the "Lives: 1" text.
    raiseGameOver() {
        setTimeout(function () {
            document.body.dispatchEvent(gameOverEvent);
        }, 100);
    }
}