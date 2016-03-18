var Parachuters = Parachuters || {};
Parachuters.Components = Parachuters.Components || {};

/**
* GameArea hold the canvas and the context
*
* @class GameArea
* @constructor
*/
(function () {
    function GameArea(canvasDimensions) {
        this.canvas;
        this.context;

        initialize.call(this);

        function initialize() {
            setupCanvas.call(this);
        }

        //create a canvas dom element and append to the body.
        function setupCanvas() {
            this.canvas = document.createElement("canvas");
            this.canvas.width = canvasDimensions.width;
            this.canvas.height = canvasDimensions.height;
            this.canvas.style.cursor = "none"; //hide the original cursor
            this.context = this.canvas.getContext("2d");
            document.body.insertBefore(this.canvas, document.body.childNodes[0]); //Append the canvas dom object as the first child of the body elemnt
        }

        // Clears everything in the canvas. This is the first thing that is called inside our GameLoop.
        this.clear = function () {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        };

    };

    Parachuters.Components.GameArea = GameArea;
})();