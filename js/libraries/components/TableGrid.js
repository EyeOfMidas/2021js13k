import { Rectangle } from "../spatial/Rectangle.js"
import { MathUtil } from "../MathUtil.js"
import { Theme } from "./Theme.js"
import { Tile } from "./Tile.js"

export class TableGrid {
	constructor() {
		this.tableBounds = new Rectangle(0, 0, 100, 100)
		this.canvasBounds = new Rectangle(0, 0, 0, 0)
		this.tableTileWidth = 6
		this.tableTileHeight = 4
		Tile.width = Tile.min
		Tile.height = Tile.min
	}

	init(scaledCanvas) {
		this.canvasBounds = scaledCanvas.getBounds()
	}

	draw(ctx, scaledCanvas) {
		let canvasBounds = scaledCanvas.getBounds()
		ctx.fillStyle = Theme.Colors.white
		ctx.save()
		ctx.translate(this.tableBounds.x, this.tableBounds.y)
		ctx.beginPath()
		ctx.rect(0, 0, this.tableBounds.width, this.tableBounds.height)
		ctx.fill()
		ctx.strokeStyle = Theme.Colors.gray
		for (let y = 0; y < this.tableTileHeight; y++) {
			for (let x = 0; x < this.tableTileWidth; x++) {
				ctx.beginPath()
				ctx.rect(x * Tile.width, y * Tile.height, Tile.width, Tile.height)
				ctx.stroke()
			}
		}

		ctx.restore()
	}

	update(delta) {
		Tile.update(this.canvasBounds)

		this.tableBounds.width = this.tableTileWidth * Tile.width
		this.tableBounds.height = this.tableTileHeight * Tile.height
		this.tableBounds.x = -this.tableBounds.width / 2
		this.tableBounds.y = -this.canvasBounds.height / 2 + (this.canvasBounds.height / 12)
	}

	tick() {

	}
}