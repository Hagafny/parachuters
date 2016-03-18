var Parachuters = Parachuters || {};
Parachuters.Services = Parachuters.Services || {};

(function () {
    var ScoreService = function () {

        var _score = 0; // Private variable that holds our score. Initially set to 0.
        initialize();

        function initialize() {
            listenToEventsEvents();
        }

        // the only thing the service returns is a get method for the _score variable.
        var service = {
            getScore: getScore
        };

        return service;

        function getScore() {
            return _score;
        }

        function listenToEventsEvents() {
            document.body.addEventListener("hitsBoat", addScore, false); //Listen to the hitsBoat event and fire an addScore function.
        }

        //We add a score based on the 'reward' property the caught parachuter has.
        function addScore(e) {
            _score += e.detail.reward;
        }

    }

    Parachuters.Services.ScoreService = ScoreService;
})()