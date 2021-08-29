import { Camera } from "../../libraries/Camera.js";
import { KeyCode } from "../../libraries/KeyboardInput.js"
import { Point } from "../../libraries/spatial/Point.js";
import { Theme } from "../../libraries/components/Theme.js"
import { Tile } from "../../libraries/components/Tile.js"
import { Star } from "../../libraries/components/Star.js";

export class StarhuntState {
    constructor(view) {
        this.stateMachine = view.stateMachine
        this.camera = new Camera()
        this.camera.scale = new Point(1, 1)
        this.launchPosition = new Point(0, 0)
        this.ballPosition = new Point(0, 0)
        this.stars = []
        this.isFinished = false
    }

    init(scaledCanvas) {
        this.canvasBounds = scaledCanvas.bounds
        this.launchPosition.x = 0
        this.launchPosition.y = this.canvasBounds.height / 4
        this.ballPosition.x = this.launchPosition.x
        this.ballPosition.y = this.launchPosition.y
        this.countdown = new Date().getTime() + 30000
        this.countdownDisplay = "30"
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


            ctx.fillStyle = Theme.Colors.black
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

            ctx.beginPath()
            ctx.arc(this.ballPosition.x, this.ballPosition.y, 20, 0, 2 * Math.PI)
            ctx.fill()
        })
    }

    update(delta) {
        Tile.update(this.canvasBounds)
        this.launchPosition.x = 0
        this.launchPosition.y = this.canvasBounds.height / 4

        this.stars.forEach(star => {
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

            setTimeout(() => {
                this.stars[i].hit()
            }, Math.floor(15000 * Math.random()))
        }



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
        if (event.touches[0].clientY >= this.canvasBounds.height * (3 / 4)) {
            this.ballPosition.x = event.touches[0].clientX - this.canvasBounds.width / 2
            this.ballPosition.y = Math.max(event.touches[0].clientY - this.canvasBounds.height / 2, (this.canvasBounds.height / 4))
        } else {
            this.ballPosition.x = this.launchPosition.x
            this.ballPosition.y = this.launchPosition.y
        }
    }

    onTouchEnd(event) {

    }

    onMouseDown(event) {
    }

    onMouseMove(event) {
        if (event.clientY >= this.canvasBounds.height * (3 / 4)) {
            this.ballPosition.x = event.clientX - this.canvasBounds.width / 2
            this.ballPosition.y = Math.max(event.clientY - this.canvasBounds.height / 2, (this.canvasBounds.height / 4))
        } else {
            this.ballPosition.x = this.launchPosition.x
            this.ballPosition.y = this.launchPosition.y
        }
    }

    onMouseUp(event) {
    }
}
