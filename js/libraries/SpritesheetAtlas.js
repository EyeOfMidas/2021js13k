import { Rectangle } from './spatial/Rectangle.js'

export class DrawableSprite {
    constructor(atlas, bounds) {
        this.atlas = atlas
        this.bounds = bounds
    }

    draw(ctx, scaledCanvas) {
        if(!this.atlas.isLoaded()) {
            ctx.strokeStyle = "#EE4444"
            ctx.beginPath()
            ctx.rect(-this.bounds.width / 2, -this.bounds.height / 2, this.bounds.width, this.bounds.height)
            ctx.stroke()
            return
        }
        ctx.drawImage(this.atlas.spritesheetImage,
            this.bounds.x,
            this.bounds.y,
            this.bounds.width,
            this.bounds.height,
            -this.bounds.width / 2,
            -this.bounds.height / 2,
            this.bounds.width,
            this.bounds.height);
    }

    getGridPosition() {
        return [
            this.bounds.x / (this.atlas.tileDimensions.width + this.atlas.tileDimensions.margin),
            this.bounds.y / (this.atlas.tileDimensions.height + this.atlas.tileDimensions.margin),
        ]
    }
}

export class SpritesheetAtlas {
	constructor() {
        this.loaded = false;
        this.spritesheetImage = new Image()
        this.assetsPath = "";
        this.tileDimensions = {width: 16, height: 16, margin: 0}
        this.spriteCache = {}
        this.bounds = {width: 0, height: 0}
    }

	async load(assetsPath, tileDimensions) {
        this.assetsPath = assetsPath;
        this.tileDimensions = tileDimensions
        let loadPromise = this.imageLoadComplete();
        this.bounds = {
            width: this.spritesheetImage.width / (tileDimensions.width + tileDimensions.margin),
            height: this.spritesheetImage.height / (tileDimensions.height + tileDimensions.margin)
        }
        this.loaded = true
        return await loadPromise
	}

	imageLoadComplete() {
        return new Promise((resolve, reject) => {
            this.spritesheetImage.src = this.assetsPath;
            this.spritesheetImage.addEventListener('load', resolve);
            this.spritesheetImage.addEventListener('error', reject);
        });
	};

    isLoaded() {
        return this.loaded
    }

    getDrawableSprite(x, y) {
        if(!this.spriteCache[`${x},${y}`]) {
            this.spriteCache[`${x},${y}`] = new DrawableSprite(this, new Rectangle(x * this.tileDimensions.width + x * this.tileDimensions.margin, y * this.tileDimensions.height + y * this.tileDimensions.margin, this.tileDimensions.width, this.tileDimensions.height))
        }
        return this.spriteCache[`${x},${y}`]
    }
}
