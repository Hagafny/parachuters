/**
* This is the Base Component. This is used as a parent constructor and contains the draw function our components run inside the gameLoop.
*
* @class BaseComponent
* @constructor
*/
export default class BaseComponent {
    constructor(settings) {
        // Validate
        if (settings.width == undefined ||
            settings.height == undefined ||
            settings.x == undefined ||
            settings.y == undefined ||
            settings.image == undefined)
            throw Error("Invalid settings for component");

        this.width = settings.width;
        this.height = settings.height;
        this.x = settings.x;
        this.y = settings.y;
        this.image = settings.image;
    }
    
    get image() {
        return this._image;
    }
    set image(src) {
        this._image = new Image();
        this._image.src = src;
    }
    
    draw(canvasContext) {
        canvasContext.drawImage(this.image,
            this.x,
            this.y,
            this.width, this.height);
    }
}

