import { Point } from "../spatial/Point.js"
import { Theme } from "./Theme.js"
import { Tile } from "./Tile.js"

export class Star {
	constructor(x = 0, y = 0, size = 1, color = 0) {
		this.position = new Point(x, y)
		this.velocity = new Point(0, 0)
		this.acceleration = new Point(0, 0)
		this.color = color
		this.size = size
		this.state = "still"
	}

	colorLookup() {
		return [Theme.Colors.darkgreen, Theme.Colors.lightblue, Theme.Colors.white, Theme.Colors.green][this.color]
	}

	draw(ctx, scaledCanvas) {
		ctx.fillStyle = this.colorLookup()
		ctx.beginPath()
		ctx.arc(this.position.x, this.position.y, this.size * (Tile.width / 4), 0, 2 * Math.PI)
		ctx.fill()
	}

	update(delta) {
		switch (this.state) {
			case "falling":
				if (this.position.y > 500) {
					this.state = "dead"
				}
				this.velocity.offset(this.acceleration)
				this.position.offset(this.velocity)
				this.acceleration.x = 0
				this.acceleration.y = 0.18
				break
			default:
				break
		}

	}

	hit() {
		this.state = "falling"
		this.velocity.y = -4
		this.velocity.x = 2 * Math.random() - 1
	}

	tick() {

	}
}