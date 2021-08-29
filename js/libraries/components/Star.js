import { Point } from "../spatial/Point.js"
import { Theme } from "./Theme.js"
import { Tile } from "./Tile.js"

export class Star {
	constructor(x = 0, y = 0, color = Theme.Colors.darkgreen, size = 1) {
		this.position = new Point(x, y)
		this.velocity = new Point(0, 0)
		this.acceleration = new Point(0, 0)
		this.color = color
		this.size = size
		this.state = "still"
	}

	draw(ctx, scaledCanvas) {
		ctx.fillStyle = this.color
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
		this.velocity.x = 1
	}

	tick() {

	}
}