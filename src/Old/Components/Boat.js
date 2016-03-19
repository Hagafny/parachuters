var Parachuters = Parachuters || {};
Parachuters.Components = Parachuters.Components || {};

/**
* The boat component. Here we also set the keys to move the boat.
*
* @class Boat
* @constructor
*/
(function () {
    function Boat(settings) {

        // Get boat stats
        settings.stats = settings.stats || {};
        this.speed = settings.stats.speed || 3;

        // Call the base component's constructor to valiate our inputs.
        Parachuters.Components.BaseComponent.call(this, settings);

        // Array of the keys that are pressed on the keyboard. The boat will move to the direction of the key that is last.
        var keysPressed = [];

        initialize()

        function initialize() {
            bindKeys();
        }

        //We always move the both with the last key that is held down. We also make sure to clamp the x position of the boat so we won't get off screen.
        this.update = function () {
            var lastKeyPressed = _.last(keysPressed);
            if (lastKeyPressed == 37)
                moveleft.call(this);

            if (lastKeyPressed == 39)
                moveright.call(this);

            this.x = this.x.clamp(0, settings.canvasDimensions.width - this.width);
        }

        //Listen to keyboard events and if they ar <- or ->, push them into the keyPressed array. 
        function bindKeys() {
            window.addEventListener('keydown', function (e) {
                if (!_.contains(keysPressed, e.keyCode))
                    keysPressed.push(e.keyCode);
            })
            window.addEventListener('keyup', function (e) {
                var index = _.indexOf(keysPressed, e.keyCode);
                if (index != -1)
                    keysPressed.splice(index, 1);

            })
        }

        function moveleft() {
            this.x -= this.speed;
        }

        function moveright() {
            this.x += this.speed;
        }

    };
    Boat.prototype = Object.create(Parachuters.Components.BaseComponent.prototype); //Inherit from BaseComponent so we can use the draw function.

    Parachuters.Components.Boat = Boat;
})();