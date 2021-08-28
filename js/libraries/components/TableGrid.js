import { Rectangle } from "../spatial/Rectangle.js"
import { MathUtil } from "../MathUtil.js"
import { Theme } from "./Theme.js"

export class TableGrid {
	constructor() {
		this.tableBounds = new Rectangle(0, 0, 100, 100)
		this.canvasBounds = new Rectangle(0, 0, 0, 0)
		this.tableTileWidth = 6
		this.tableTileHeight = 4
		this.tileWidth = 45
		this.tileHeight = 45
		this.tiles = []

	}

	init(scaledCanvas) {
		this.canvasBounds = scaledCanvas.getBounds()
	}

	draw(ctx, scaledCanvas) {
		let canvasBounds = scaledCanvas.getBounds()
		ctx.fillStyle = Theme.Colors.lightbrown
		ctx.save()
		ctx.translate(this.tableBounds.x, this.tableBounds.y)
		ctx.beginPath()
		ctx.rect(0, 0, this.tableBounds.width, this.tableBounds.height)
		ctx.fill()
		ctx.strokeStyle = Theme.Colors.brown
		for (let y = 0; y < this.tableTileHeight; y++) {
			for (let x = 0; x < this.tableTileWidth; x++) {
				ctx.beginPath()
				ctx.rect(x * this.tileWidth, y * this.tileHeight, this.tileWidth, this.tileHeight)
				ctx.stroke()
			}
		}

		ctx.restore()
	}

	update(delta) {
		this.tileHeight = this.tileWidth = Math.min(MathUtil.clamp(this.canvasBounds.width / 8, 45, 100), MathUtil.clamp(this.canvasBounds.height / 12, 45, 100))
		this.tableBounds.width = this.tableTileWidth * this.tileWidth
		this.tableBounds.height = this.tableTileHeight * this.tileHeight
		this.tableBounds.x = -this.tableBounds.width / 2
		this.tableBounds.y = -this.canvasBounds.height / 2 + (this.canvasBounds.height / 12)
	}

	tick() {

	}
}