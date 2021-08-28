import { Camera } from "../../libraries/Camera.js";
import { KeyCode } from "../../libraries/KeyboardInput.js"
import { Point } from "../../libraries/spatial/Point.js";
import { Theme } from "../../libraries/components/Theme.js"

export class StarhuntState {
    constructor(view) {
        this.stateMachine = view.stateMachine
        this.camera = new Camera()
        this.camera.scale = new Point(1, 1)
        this.launchPosition = new Point(0, 0)
        this.ballPosition = new Point(0, 0)
    }

    init(scaledCanvas) {
        this.canvasBounds = scaledCanvas.bounds
    }

    draw(ctx, scaledCanvas) {
        let fontScale = this.canvasBounds.width / 500
        this.camera.draw(ctx, scaledCanvas, () => {
            ctx.fillStyle = Theme.Colors.purple
            ctx.font = `${Math.min(Math.floor(48 * fontScale), 48)}px ${Theme.Fonts.Header}`
            ctx.textAlign = "center"
            ctx.save()
            ctx.translate(0, -this.canvasBounds.height * (1 / 4))
            ctx.fillText("Starfall", 0, 0)
            ctx.restore()


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

        // this.playButton.setPosition(this.canvasBounds.width / 2, this.canvasBounds.height * (7 / 8))
        // this.playButton.draw(ctx, scaledCanvas)
    }

    update(delta) {
        this.launchPosition.x = 0
        this.launchPosition.y = this.canvasBounds.height / 4
        this.camera.update(delta)
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
    }
    leave() {
        for (let index in this.registeredEvents) {
            window.removeEventListener(index, this.registeredEvents[index])
        }
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
        this.stateMachine.transitionTo("overnight")
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
