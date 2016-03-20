/**
* The plane component. In charge of plane movement pattern and calculating parachuters drop points
*
* @class Plane
* @constructor
*/
import BaseComponent from "./BaseComponent";
import "./../misc/extensions"; //For the clamp/contains extensions

//deploymentXLocations holds the x coordinates in which the plane drops parachuters. It resets every time the plane completes a cycle.
let deploymentXLocations = [],
    planeFinishedCycleEvent,
    parachuterDroppedEvent;

export default class Plane extends BaseComponent {

    constructor(settings, stats) {
        super(settings);
        //Validate
        if (settings.gameWidth == undefined)
            throw Error("Invalid settings for Plane component");

        stats = stats || {}
        this.speed = stats.speed || 3;
        this.parachutersPerCycle = stats.parachutersPerCycle || 1;
        this.gameWidth = settings.gameWidth;
        this.x = this.getNewPlaneLocation();

        this.setDeploymentLocations();
        this.createEvents();
    }

    update() {
        //When the plane hits an x location that is inside the deploymentXLocations, he will drop a parachuter.
        if (deploymentXLocations.contains(this.x))
            this.dropParachuter();

        if (this.hasFinishedCycle()) {
            document.body.dispatchEvent(planeFinishedCycleEvent);
            this.planeFinishedCycle();
        }
        //If the plane didn't finish a cycle, move left. 
        else
            this.moveLeft();
    }

    moveLeft() {
        this.x -= this.speed;
    }

    setDeploymentLocations() {
        for (let i = 0; i < this.parachutersPerCycle; i++) {
            //We generate a random number between 0 and the canvas' width. We multiply (and then divide) by the speed of the plane. 
            //This is needed to make sure that the plane will actually hit those x locations. If the speed of the plane is 3, we will need randomXlocations that can be divided by 3.
            var deploymentLocation = Math.floor((Math.random() * this.gameWidth) / this.speed) * this.speed;
            deploymentXLocations.push(deploymentLocation);
        }
    }

    //called when plane has finished a cycle. we pass the plane 'this' reference so we can use it inside the event listener.
    createEvents() {
        planeFinishedCycleEvent = new CustomEvent("planeFinishedCycle", { 'detail': this });
    }
    
    //If the plane has finished a cycle, we will clean the deploymentXLocations array, reset the plane position to the right of the screen and calculate deplyment x locations again.       
    planeFinishedCycle() {
        deploymentXLocations = [];
        this.restartPlaneLocation();
        this.setDeploymentLocations();
    }
    
    //Checkes if the plane has fully left the canvas area.
    hasFinishedCycle() {
        return this.x < -this.width;
    }   
    
    // After the plane has crossed the canvas to the left, teleport him to the right.
    restartPlaneLocation() {
        this.x = this.getNewPlaneLocation();
    }
    
    //When a parachuter dros, we call an event to be catched by other services that will handle it.
    dropParachuter() {
        var parachuterDropped = new CustomEvent("parachuterDropped", { 'detail': this.x });
        document.body.dispatchEvent(parachuterDropped);
    }
    
    // This functions returns an xLocation for which the plane is teleported to the right of the canvas. Distance is a random number between zero and the canvas' width.
    // We use distance to simulate the "time" it takes the plane to get back to the screen. 
    // Also, we have to make sure the plane will start at a coordinate that is divided by the speed. This is to make sure the plane will hit all his deploymentXLocations. 
    // This is why we run a while loop until we generate a location that can can be divided by the plane's speedn./
    getNewPlaneLocation() {
        var distance
        do {
            distance = Math.floor(Math.random() * this.gameWidth);
        } while ((this.gameWidth + distance) % this.speed != 0);

        return this.gameWidth + distance;
    }
}

