
/**
* In charge of levels
*
* @class LevelService
* @constructor
*/
let s_level = Symbol();

export default class LevelService {
    constructor() {
        let initialLevel = 1;
        this[s_level] = initialLevel;
    }

    get level() {
        return this[s_level];
    }

    levelUp() {
        this[s_level]++;
    }
}