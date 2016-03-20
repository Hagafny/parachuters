
/**
* GameArea hold the canvas and the context
*
* @class GameArea
* @constructor
*/

let s_canvas = Symbol();

export default class GameArea {
    constructor(width, height) {
        this.setupCanvas(width, height);
    }
    
    //create a canvas dom element and append to the body.
    setupCanvas(width, height) {
        this[s_canvas] = document.createElement("canvas");
        this[s_canvas].width = width;
        this[s_canvas].height = height;
        this._context = this[s_canvas].getContext("2d");
        document.body.insertBefore(this[s_canvas], document.body.childNodes[0]); //Append the canvas dom object as the first child of the body elemnt
    }

    get context() {
        return this._context;
    }
    
    // Clears everything in the canvas. This is the first thing that is called inside our GameLoop.
    clear() {
        this.context.clearRect(0, 0, this[s_canvas].width, this[s_canvas].height);
    }
};

