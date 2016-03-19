/**
* The parachuter component.
*
* @class Parachuter
* @constructor
*/
import BaseComponent from "./BaseComponent";

//declare the events.
let hitsBoat, hitsWater;
export default class Plane extends BaseComponent {
    constructor(settings, stats) {
        super(settings);

        //Validate
        if (settings.water == undefined || settings.boat == undefined)
            throw Error("Invalid settings for Parachuter component");

        stats = stats || {}
        this.speed = stats.speed || 2;
        this.reward = stats.reward || 10;
        this.water = settings.water;
        this.boat = settings.boat;

        this.createEvents();
    }

    update() {
        this.y += this.speed;

        if (this.landsOn(this.boat))
            document.body.dispatchEvent(hitsBoat); //raise the hitsBoat event

        if (this.landsOn(this.water))
            document.body.dispatchEvent(hitsWater); //raise the hitsWater event.        
    }

    createEvents() {
        hitsBoat = new CustomEvent("hitsBoat", { 'detail': this });
        hitsWater = new CustomEvent("hitsWater", { 'detail': this });
    }
    
    // check if the parachuter collided with an object. return true or flase.
    landsOn(otherobj) {
        return (this.x < otherobj.x + otherobj.width &&
            this.x + this.width > otherobj.x &&
            this.y < otherobj.y + otherobj.height &&
            this.height + this.y > otherobj.y)
    }
}

