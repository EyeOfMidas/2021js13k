import { Point } from "../spatial/Point.js";
import { Easing, Tween } from "../Tween.js";

export class TextPop {
	constructor(tweenManager, text, pos, startDelay) {
		this.tweenManager = tweenManager
		this.position = pos
		this.alpha = 0
		this.text = text
		this.isCompleted = false
		setTimeout(() => {
			this.alpha = 1
			this.tweenManager.add(new Tween(this, { position: { y: this.position.y - 60 }, alpha: 0 }, 1000, Easing.Linear.EaseNone, () => {
				this.isCompleted = true
			}))
		}, startDelay)
	}

	draw(ctx, scaledCanvas) {
		ctx.fillStyle = `rgba(40,200,40,${this.alpha})`
		ctx.font = `24px Arial`
		ctx.textAlign = "center"
		ctx.save()
		ctx.translate(this.position.x, this.position.y)
		ctx.fillText(this.text, 0, 0)
		ctx.restore()
	}

	update(delta) {

	}

	tick() {

	}


}