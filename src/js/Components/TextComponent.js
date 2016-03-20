/**
* This text component is used by Levels, Score and Lives to display the stats.
*
* @class Text
* @constructor
*/
export default class TextComponent {
    constructor(settings) {         
        //Validate
        if (settings.x === undefined || settings.y === undefined)
            throw Error("Invalid settings for Text component");

        this.x = settings.x;
        this.y = settings.y;
        this.color = settings.color || "#000";
        this.text = settings.text || "";
        this.font = settings.font || "20px Georgia";
    }

    draw(canvasContext) {
        canvasContext.fillStyle = this.color;
        canvasContext.font = this.font;
        canvasContext.fillText(this.text, this.x, this.y);
    }
   
}

