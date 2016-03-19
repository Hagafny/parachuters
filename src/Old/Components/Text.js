var Parachuters = Parachuters || {};
Parachuters.Components = Parachuters.Components || {};

(function () {
    /**
    * This text component is used by Score and Lives to display the stats.
    *
    * @class Text
    * @constructor
    */
    function Text(settings) {

        if (settings.x == undefined || settings.y == undefined)
            throw Error("Invalid settings for canvas component");

        this.x = settings.x;
        this.y = settings.y;
        this.color = settings.color || "#000";
        this.text = settings.text || "";
        this.font = settings.font || "20px Georgia";;
    }

    // This function will run inside our gameLoop. We pass in the canvas' context.
    Text.prototype.draw = function (ctx) {
        ctx.fillStyle = this.color;
        ctx.font = this.font;
        ctx.fillText(this.text, this.x, this.y);
    }

    Parachuters.Components.Text = Text;
})();