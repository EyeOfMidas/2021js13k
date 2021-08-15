import { AsyncDataReader } from './AsyncDataReader.js';

export class SpriteAtlas {
	constructor() {}

	async load(assetsPath, xmlFilename) {
        this.atlas = {};
		this.spritesheetImage = new Image();
        this.assetsPath = assetsPath;
        this.xmlPath = assetsPath + "/" + xmlFilename
		let result = await new AsyncDataReader().readXML(this.xmlPath);
        return await this.xmlLoadComplete(result);
	}

	xmlLoadComplete(result) {
        return new Promise((resolve, reject) => {
            var source = result;
            var textureAtlas = source.getElementsByTagName("TextureAtlas")[0];
            this.populateAtlas(source);
            var sheetsrc = `./${this.assetsPath}/${textureAtlas.getAttribute("imagePath")}`;
            this.spritesheetImage.src = sheetsrc;
            this.spritesheetImage.addEventListener('load', resolve);
        });
	};

	populateAtlas(source) {
		var subtextures = source.getElementsByTagName("SubTexture");
		for (var i = 0, subtexture = subtextures[0]; subtexture = subtextures[i]; i++) {
			this.atlas[subtexture.getAttribute("name")] = {
				name: subtexture.getAttribute("name"),
				x: parseInt(subtexture.getAttribute("x")),
				y: parseInt(subtexture.getAttribute("y")),
				width: parseInt(subtexture.getAttribute("width")),
				height: parseInt(subtexture.getAttribute("height"))
			};
		}
	};

	getSpriteData(name) {
		let imageLookup = this.atlas[name];
		if (!!imageLookup) {
			return imageLookup;
		}
		throw new Error(`Sprite ${name} not found in atlas ${this.xmlPath}`);
	}

	draw(context, name, position) {
		let imageLookup = this.getSpriteData(name);

		context.drawImage(this.spritesheetImage,
			imageLookup.x,
			imageLookup.y,
			imageLookup.width,
			imageLookup.height,
			position.x,
			position.y,
			imageLookup.width,
			imageLookup.height);
	};

	drawCentered(context, name, position) {
		let imageLookup = this.getSpriteData(name);

		context.drawImage(this.spritesheetImage,
			imageLookup.x,
			imageLookup.y,
			imageLookup.width,
			imageLookup.height,
			position.x - imageLookup.width / 2,
			position.y - imageLookup.height / 2,
			imageLookup.width,
			imageLookup.height);
	};


	drawBottomCentered(context, name, position) {
		let imageLookup = this.getSpriteData(name);

		context.drawImage(this.spritesheetImage,
			imageLookup.x,
			imageLookup.y,
			imageLookup.width,
			imageLookup.height,
			position.x - imageLookup.width / 2,
			position.y + imageLookup.height / 2,
			imageLookup.width,
			imageLookup.height);
	};

	getWidth(name) {
		return this.getSpriteData(name).width;
	};

	getHeight(name) {
		return this.getSpriteData(name).height;
	};
}
