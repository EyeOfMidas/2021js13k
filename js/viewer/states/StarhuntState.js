import { Camera } from "../../libraries/Camera.js"
import { KeyCode } from "../../libraries/KeyboardInput.js"
import { Point } from "../../libraries/spatial/Point.js"
import { Theme } from "../../libraries/components/Theme.js"
import { Tile } from "../../libraries/components/Tile.js"
import { Star } from "../../libraries/components/Star.js"
import { Slinger } from "../../libraries/components/Slinger.js"
import { Save } from "../../libraries/Save.js"

export class StarhuntState {
    constructor(view) {
        this.stateMachine = view.stateMachine
        this.camera = new Camera()
        this.camera.scale = new Point(1, 1)
        this.stars = []
        this.isFinished = false
        this.slinger = new Slinger()
        this.save = new Save()
    }

    init(scaledCanvas) {
        this.canvasBounds = scaledCanvas.bounds
        this.countdown = new Date().getTime() + 15000
        this.countdownDisplay = "15.000"
    }

    draw(ctx, scaledCanvas) {
        let fontScale = this.canvasBounds.width / 500
        this.camera.draw(ctx, scaledCanvas, () => {
            ctx.fillStyle = Theme.Colors.purple
            ctx.beginPath()
            ctx.rect(-this.canvasBounds.width / 2, -this.canvasBounds.height / 2, this.canvasBounds.width, this.canvasBounds.height * (3 / 4))
            ctx.fill()

            ctx.fillStyle = Theme.Colors.blue
            ctx.beginPath()
            ctx.rect(-this.canvasBounds.width / 2, this.canvasBounds.height * (1 / 4), this.canvasBounds.width, this.canvasBounds.height * (1 / 4))
            ctx.fill()

            ctx.fillStyle = Theme.Colors.white
            ctx.font = `${Math.min(Math.floor(24 * fontScale), 24)}px ${Theme.Fonts.Header}`
            ctx.textAlign = "left"
            ctx.save()
            ctx.translate(this.canvasBounds.width / 2 - 100, -this.canvasBounds.height / 2 + 24)
            ctx.fillText(`${this.countdownDisplay}`, 0, 0)
            ctx.restore()


            this.stars.forEach(star => {
                star.draw(ctx, scaledCanvas)
            })

            this.slinger.draw(ctx, scaledCanvas)
        })
    }

    update(delta) {
        Tile.update(this.canvasBounds)

        this.slinger.update(delta)
        this.stars.forEach(star => {
            star.checkCollision(this.slinger)
            star.update(delta)
        })
        this.camera.update(delta)

        if (this.isFinished) {
            return
        }
        let currentTime = new Date().getTime()
        if (this.countdown <= currentTime) {
            this.isFinished = true
            this.countdownDisplay = "0.000"
            setTimeout(() => {
                this.stateMachine.transitionTo("overnight")
            }, 2000)
        } else {
            this.countdownDisplay = `${(this.countdown - currentTime) / 1000}`
        }
    }

    tick() {
    }

    enter() {
        this.registeredEvents = {}
        this.registeredEvents["resize"] = this.onResize.bind(this)
        this.registeredEvents["keydown"] = this.onKeyDown.bind(this)
        this.registeredEvents["keyup"] = this.onKeyUp.bind(this)
        this.registeredEvents["touchstart"] = this.onTouchStart.bind(this)
        this.registeredEvents["touchmove"] = this.onTouchMove.bind(this)
        this.registeredEvents["touchend"] = this.onTouchEnd.bind(this)
        this.registeredEvents["mousedown"] = this.onMouseDown.bind(this)
        this.registeredEvents["mousemove"] = this.onMouseMove.bind(this)
        this.registeredEvents["mouseup"] = this.onMouseUp.bind(this)

        for (let index in this.registeredEvents) {
            window.addEventListener(index, this.registeredEvents[index])
        }

        this.isFinished = false
        this.countdown = new Date().getTime() + 15000
        this.stars = []
        for (let i = 0; i < 5; i++) {
            this.stars.push(this.getRandomStar())
        }
        this.slinger.init(this.canvasBounds)
    }

    getRandomStar() {
        return new Star(
            Math.floor(this.canvasBounds.width * Math.random() - this.canvasBounds.width / 2),
            Math.floor((3 / 4) * this.canvasBounds.height * Math.random() - this.canvasBounds.height / 2),
            Math.floor(4 * Math.random()),
            Math.floor(3 * Math.random() + 1)
        )
    }

    leave() {
        for (let index in this.registeredEvents) {
            window.removeEventListener(index, this.registeredEvents[index])
        }
        this.save.appendKey("collection", this.slinger.getCollectedStars())

        this.stars = []
    }

    onFinish() {
    }

    onResize() {
    }

    onKeyDown(event) {
    }

    onKeyUp(event) {
        switch (event.code) {
            case KeyCode.Escape:
                this.stateMachine.transitionTo("dayreview")
                break
            case KeyCode.Enter:
                this.stateMachine.transitionTo("overnight")
                break
        }
    }

    onTouchStart(event) {
    }

    onTouchMove(event) {
        this.slinger.move(event.touches[0].clientX, event.touches[0].clientY)
    }

    onTouchEnd(event) {
        this.slinger.fire()
    }

    onMouseDown(event) {
    }

    onMouseMove(event) {
        this.slinger.move(event.clientX, event.clientY)
    }

    onMouseUp(event) {
        this.slinger.fire()
    }
}
