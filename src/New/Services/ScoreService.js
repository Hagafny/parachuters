
/**
* In charge of score
*
* @class ScoreService
* @constructor
*/

let s_score = Symbol();

export default class ScoreService {
    constructor() {
        this[s_score] = 0;

        this.listenToEvents();
    }

    get score() {
        return this[s_score];
    }

    listenToEvents() {
        document.body.addEventListener("hitsBoat", (e) => { this.addScore(e.detail.reward)}, false); //Listen to the hitsBoat event and fire an addScore function.
    }


    //We add a score based on the 'reward' property the caught parachuter has.
    addScore(reward) {
        this[s_score] += reward;
    }
}