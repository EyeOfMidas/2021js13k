import { Camera } from "../../libraries/Camera.js";
import { KeyCode } from "../../libraries/KeyboardInput.js"
import { Point } from "../../libraries/spatial/Point.js";

export class ReplenishState {
    constructor(view) {
        this.stateMachine = view.stateMachine
        this.camera = new Camera()
        this.camera.scale = new Point(1, 1)
    }

    init() {
    }

    draw(ctx, scaledCanvas) {
        this.canvasBounds = scaledCanvas.bounds;
        let fontScale = this.canvasBounds.width / 500
        this.camera.draw(ctx, scaledCanvas, () => {
            ctx.fillStyle = "white"
            ctx.font = `${Math.min(Math.floor(48 * fontScale), 48)}px Arial`
            ctx.textAlign = "center"
            ctx.save()
            ctx.translate(0, -this.canvasBounds.height * (1 / 4))
            ctx.fillText("Replenish", 0, 0)
            ctx.restore()
        })

        // this.playButton.setPosition(this.canvasBounds.width / 2, this.canvasBounds.height * (7 / 8))
        // this.playButton.draw(ctx, scaledCanvas)
    }

    update(delta) {
        this.camera.update(delta)
    }

    tick() {
    }

    enter() {
        this.init()
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
    }

    onTouchEnd(event) {
    }

    onMouseDown(event) {
    }

    onMouseMove(event) {
    }

    onMouseUp(event) {
    }
}
