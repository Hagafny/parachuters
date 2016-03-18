var Parachuters = Parachuters || {};
Parachuters.Components = Parachuters.Components || {};

/**
* The plane component. In charge of plane movement pattern and calculating parachuters drop points
*
* @class Plane
* @constructor
*/
(function () {
    function Plane(settings) {

        // get plane stats
        settings.stats = settings.stats || {};
        this.speed = settings.stats.speed || 3;
        this.parachutersPerCycle = settings.stats.parachutersPerCycle || 1;

        settings.x = getNewPlaneLocation.call(this); //Override initial X. The plane will start from a random point to the right of the canvas. This is why we need to recalculate the x.

        // Call the base component's constructor to validate our inputs.
        Parachuters.Components.BaseComponent.call(this, settings);

        //deploymentXLocations holds the x coordinates in which the plane drops parachuters. It resets every time the plane completes a cycle.
        var deploymentXLocations = [], planeFinishedCycleEvent, parachuterDroppedEvent;

        initialize.call(this);

        function initialize() {
            //First we set a dropping point.
            setDeploymentLocations.call(this);
            createEvents.call(this);
            subscribeToEvents.call(this);
        }

        this.update = function () {
            //When the plane hits an x location that is inside the deploymentXLocations, he will drop a parachuter.
            if (_.contains(deploymentXLocations, this.x))
                dropParachuter.call(this);

            if (hasFinishedCycle.call(this)) {
                document.body.dispatchEvent(planeFinishedCycleEvent);
            }
            //If the plane didn't finish a cycle, move left. 
            else
                moveLeft.call(this);
        }

        function moveLeft() {
            this.x -= this.speed;
        }

        function createEvents() {
            //called when plane has finished a cycle. we pass the plane 'this' reference so we can use it inside the event listener.
            planeFinishedCycleEvent = new CustomEvent("planeFinishedCycle", { 'detail': this }); 
        }

        function subscribeToEvents() {
            //We are listening to our own event because several services are listerning to planeFinishedCycle event as well.
            document.body.addEventListener("planeFinishedCycle", planeFinishedCycle, false);
        }

        //If the plane has finished a cycle, we will clean the deploymentXLocations array, reset the plane position to the right of the screen and calculate deplyment x locations again.       
        function planeFinishedCycle(e) {

            var planeInstance = e.detail;

            deploymentXLocations = [];
            restartPlaneLocation.call(planeInstance);
            setDeploymentLocations.call(planeInstance);
        }
           
                
        //Checkes if the plane has fully left the canvas area.
        function hasFinishedCycle() {
            return this.x < -this.width;
        }
        
        //This function is in charge of setting random x location for the plane to drop parachuters at.
        function setDeploymentLocations() {
            for (var i = 0; i < this.parachutersPerCycle; i++) {
                //We generate a random number between 0 and the canvas' width. We multiply (and then divide) by the speed of the plane. 
                //This is needed to make sure that the plane will actually hit those x locations. If the speed of the plane is 3, we will need randomXlocations that can be divided by 3.
                var deploymentLocation = Math.floor((Math.random() * settings.canvasDimensions.width) / this.speed) * this.speed;
                deploymentXLocations.push(deploymentLocation);
            }
        }

        // After the plane has crossed the canvas to the left, teleport him to the right.
        function restartPlaneLocation() {
            this.x = getNewPlaneLocation.call(this);
        }


        //When a parachuter dros, we call an event to be catched by other services that will handle it.
        function dropParachuter() {
            var parachuterDropped = new CustomEvent("parachuterDropped", { 'detail': this.x });
            document.body.dispatchEvent(parachuterDropped);
        }
       
        // This functions returns an xLocation for which the plane is teleported to the right of the canvas. Distance is a random number between zero and the canvas' width.
        // We use distance to simulate the "time" it takes the plane to get back to the screen. 
        // Also, we have to make sure the plane will start at a coordinate that is divided by the speed. This is to make sure the plane will hit all his deploymentXLocations. 
        // This is why we run a while loop until we generate a location that can can be divided by the plane's speedn./
        function getNewPlaneLocation() {
            var distance
            do {
                distance = Math.floor(Math.random() * settings.canvasDimensions.width);
            } while ((settings.canvasDimensions.width + distance) % this.speed != 0);

            return settings.canvasDimensions.width + distance;
        }

    };

    Plane.prototype = Object.create(Parachuters.Components.BaseComponent.prototype); //Inherit from BaseComponent so we can use the draw function.

    Parachuters.Components.Plane = Plane;
})();