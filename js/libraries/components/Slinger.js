import { Point } from "../spatial/Point.js"
import { Theme } from "./Theme.js"

export class Slinger {
	constructor() {
		this.ballPosition = new Point(0, 0)
		this.launchPosition = new Point(0, 0)
		this.ballAcceleration = new Point(0, 0)
		this.ballVelocity = new Point(0, 0)
		this.state = "launch"
	}

	init(scaledCanvas) {
		this.canvasBounds = scaledCanvas.bounds
		this.launchPosition.x = 0
		this.launchPosition.y = this.canvasBounds.height / 4
		this.ballPosition.x = this.launchPosition.x
		this.ballPosition.y = this.launchPosition.y
		this.state = "launch"
	}

	draw(ctx, scaledCanvas) {
		ctx.fillStyle = Theme.Colors.black
		switch (this.state) {
			case "launch":
				ctx.beginPath()
				ctx.arc(this.launchPosition.x, this.launchPosition.y, 5, 0, 2 * Math.PI)
				ctx.fill()

				let distance = this.launchPosition.distanceTo(this.ballPosition)
				let angle = this.launchPosition.angleTo(this.ballPosition)

				for (let magnitude = 0; magnitude < distance; magnitude += distance / 7) {
					ctx.beginPath()
					ctx.arc(this.launchPosition.x + magnitude * Math.cos(angle), this.launchPosition.y + magnitude * Math.sin(angle), 5, 0, 2 * Math.PI)
					ctx.fill()
				}
				break
			case "falling":
				break;
		}

		ctx.beginPath()
		ctx.arc(this.ballPosition.x, this.ballPosition.y, 20, 0, 2 * Math.PI)
		ctx.fill()
	}

	update(delta) {
		switch (this.state) {
			case "launch":
				this.launchPosition.x = 0
				this.launchPosition.y = this.canvasBounds.height / 4
				break
			case "falling":
				if (this.ballPosition.y > this.canvasBounds.height / 2 || Math.abs(this.ballPosition.x) > this.canvasBounds.width) {
					this.state = "launch"
					this.ballVelocity.x = 0
					this.ballVelocity.y = 0
					this.ballAcceleration.x = 0
					this.ballAcceleration.y = 0
					this.ballPosition.x = this.launchPosition.x
					this.ballPosition.y = this.launchPosition.y
				}
				this.ballVelocity.offset(this.ballAcceleration)
				this.ballPosition.offset(this.ballVelocity)
				this.ballAcceleration.x = 0
				this.ballAcceleration.y = 0.22
			default:
				break
		}
	}

	tick() {

	}

	move(x, y) {
		if (this.state == "launch") {
			if (y >= this.canvasBounds.height * (3 / 4)) {
				this.ballPosition.x = x - this.canvasBounds.width / 2
				this.ballPosition.y = Math.max(y - this.canvasBounds.height / 2, (this.canvasBounds.height / 4))
			} else {
				this.ballPosition.x = this.launchPosition.x
				this.ballPosition.y = this.launchPosition.y
			}
		}
	}

	fire() {
		this.state = "falling"
		let distance = 20 * this.ballPosition.distanceTo(this.launchPosition) / (this.canvasBounds.height / 4)
		let angle = this.ballPosition.angleTo(this.launchPosition)
		this.ballVelocity.x = distance * Math.cos(angle)
		this.ballVelocity.y = distance * Math.sin(angle)
	}
}