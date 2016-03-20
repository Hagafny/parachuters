/**
* The boat component. Here we also set the keys to move the boat.
*
* @class Boat
* @constructor
*/
import BaseComponent from "./BaseComponent";
import _ from "underscore";
import "./../misc/extensions"; //For the clamp function

let keysPressed = [];
export default class Boat extends BaseComponent {
    constructor(settings, stats) {
        super(settings);
         
        //Validate
        if (settings.gameWidth == undefined)
            throw Error("Invalid settings for Boat component");

        this.gameWidth = settings.gameWidth;

        stats = stats || {}
        this.speed = stats.speed || 3;

        this.bindKeys();
    }

    get x() {
        return this._x;
    }
    
    //Clamp the boat's location to the width of the canvas.
    set x(newX) {
        this._x = this.gameWidth ? newX.clamp(0, this.gameWidth - this.width) : newX;  
    }

    //We always move the both with the last key that is held down. We also make sure to clamp the x position of the boat so we won't get off screen.
    update() {
        let lastKeyPressed = _.last(keysPressed);
        if (lastKeyPressed == 37)
            this.moveLeft();

        if (lastKeyPressed == 39)
            this.moveRight();
    }

    bindKeys() {
        window.addEventListener('keydown', e => {
            if (!_.contains(keysPressed, e.keyCode))
                keysPressed.push(e.keyCode);
        })

        window.addEventListener('keyup', e=> {
            var index = _.indexOf(keysPressed, e.keyCode);
            if (index != -1)
                keysPressed.splice(index, 1);
        })
    }

    moveLeft() {
          this.x -= this.speed;
    }

    moveRight() {
          this.x += this.speed;
    }

}

