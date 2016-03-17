var Parachuters = Parachuters || {};
Parachuters.Services = Parachuters.Services || {};

(function () {
    var LifeService = function () {
        var initialLives = 3;  // Initial lives the player has.
        var _currentLives; // a private that holds the player's current lives.

        initialize();

        function initialize() {
            bindEvents();
            _currentLives = initialLives;
        }

        // the only thing the service returns is a get method for the _currentLives variable.
        var service = {
            getCurrentLives: getCurrentLives
        };

        return service;

        function getCurrentLives() {
            return _currentLives;
        }

        function bindEvents() {
            document.body.addEventListener("hitsWater", loseLife, false); //Listen to the hitsWater event and fire a loseLife function.
        }

        function loseLife() {
            _currentLives--;

            if (_currentLives == 0) // No more lives.
                raiseGameOver();
        }

        // This will raise the gameOver event and essentially finish the game. Notice that I put a setTimeout because I want the frames to the changes the lives to 0 before the game ends.
        // If I didn't put a setTimeout here, the game will be over with the "Lives: 1" text.
        function raiseGameOver() {
            setTimeout(function () {
                var gameOver = new CustomEvent("gameOver");
                document.body.dispatchEvent(gameOver);
            }, 100) 

        }
    }

    Parachuters.Services.LifeService = LifeService;

})()