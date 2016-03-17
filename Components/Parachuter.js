var Parachuters = Parachuters || {};
Parachuters.Components = Parachuters.Components || {};

/**
* The parachuter component.
*
* @class Parachuter
* @constructor
*/
(function () {
    function Parachuter(settings) {

        // Get boat stats
        settings.stats = settings.stats || {};
        this.speed = settings.stats.speed || 2
        this.reward = settings.stats.reward || 10;

        // Call the base component's constructor to valiate our inputs.
        Parachuters.Components.BaseComponent.call(this, settings);

        //declare the events.
        var hitsBoat, hitsWater;

        initialize.call(this);

        function initialize() {
            bindEvents.call(this);
        }

        function bindEvents() {
            hitsBoat = new CustomEvent("hitsBoat", { 'detail': this });
            hitsWater = new CustomEvent("hitsWater", { 'detail': this });
        }

        // drop the parachuter and check for collisions with the boat/water
        this.update = function () {
            this.y += this.speed;

            if (landsOn.call(this, settings.boat))
                document.body.dispatchEvent(hitsBoat); //raise the hitsBoat event

            if (landsOn.call(this, settings.water))
                document.body.dispatchEvent(hitsWater); //raise the hitsWater event.
        }

        // check if the parachuter collided with an object. return true or flase.
        function landsOn(otherobj) {
            return (this.x < otherobj.x + otherobj.width &&
                    this.x + this.width > otherobj.x &&
                    this.y < otherobj.y + otherobj.height &&
                    this.height + this.y > otherobj.y)

        }

    };
    Parachuter.prototype = Object.create(Parachuters.Components.BaseComponent.prototype); //Inherit from BaseComponent so we can use the draw function.

    Parachuters.Components.Parachuter = Parachuter;
})();