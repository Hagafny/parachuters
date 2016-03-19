var Parachuters = Parachuters || {};
Parachuters.Components = Parachuters.Components || {};

(function () {

    /**
    * This is the Base Component. This is used as a parent constructor and contains the draw function our components run inside the gameLoop.
    *
    * @class BaseComponent
    * @constructor
    */
    function BaseComponent(settings) {

        // Validatae
        if (settings.width == undefined || settings.y == undefined || settings.x == undefined || settings.y == undefined)
            throw Error("Invalid settings for canvas component");

        this.width = settings.width;
        this.height = settings.height;
        this.x = settings.x;
        this.y = settings.y;

        this.image = new Image();
        this.image.src = settings.img;
    }

    // This function will run inside our gameLoop. We pass in the canvas' context.
    BaseComponent.prototype.draw = function (ctx) {
        ctx.drawImage(this.image,
            this.x,
            this.y,
            this.width, this.height);
    }

    Parachuters.Components.BaseComponent = BaseComponent;
})();