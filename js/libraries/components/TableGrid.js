import { Rectangle } from "../spatial/Rectangle.js"
import { MathUtil } from "../MathUtil.js"

export class TableGrid {
	constructor() {
		this.tableBounds = new Rectangle(0, 0, 100, 100)
		this.canvasBounds = new Rectangle(0, 0, 0, 0)
	}

	init(scaledCanvas) {
		this.canvasBounds = scaledCanvas.getBounds()
	}

	draw(ctx, scaledCanvas) {
		let canvasBounds = scaledCanvas.getBounds()
		ctx.beginPath()
		ctx.save()
		ctx.translate(this.tableBounds.x, this.tableBounds.y)
		ctx.rect(0, 0, this.tableBounds.width, this.tableBounds.height)
		ctx.stroke()
		ctx.restore()
	}

	update(delta) {
		this.tableBounds.width = MathUtil.clamp(3 * this.canvasBounds.width / 4, 6 * 45, 6 * 100)
		this.tableBounds.height = MathUtil.clamp(this.canvasBounds.height / 4, 4 * 45, 4 * 100)
		this.tableBounds.x = -this.tableBounds.width / 2
		this.tableBounds.y = -this.canvasBounds.height / 2 + (this.canvasBounds.height / 12)
	}

	tick() {

	}





}