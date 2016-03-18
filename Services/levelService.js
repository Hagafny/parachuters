var Parachuters = Parachuters || {};
Parachuters.Services = Parachuters.Services || {};

(function () {
    var LevelService = function () {
        var initialLevel = 1;
        var _currentLevel;

        initialize();

        function initialize() {
            _currentLevel = initialLevel;
        }

        // the only thing the service returns is a get method for the _currentLives variable.
        var service = {
            getCurrentLevel: getCurrentLevel,
            levelUp: levelUp
        };

        return service;

        function getCurrentLevel() {
            return _currentLevel;
        }

        function levelUp() {
            _currentLevel++;
        }
    }

    Parachuters.Services.LevelService = LevelService;

})()