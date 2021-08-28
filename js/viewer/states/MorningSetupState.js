import { Camera } from "../../libraries/Camera.js";
import { TableGrid } from "../../libraries/components/TableGrid.js";
import { KeyCode } from "../../libraries/KeyboardInput.js"
import { Point } from "../../libraries/spatial/Point.js";

export class MorningSetupState {
    constructor(view) {
        this.stateMachine = view.stateMachine
        this.camera = new Camera()
        this.camera.scale = new Point(1, 1)
        this.tableGrid = new TableGrid()
    }

    init(scaledCanvas) {
        this.canvasBounds = scaledCanvas.bounds
        this.tableGrid.init(scaledCanvas)
    }

    draw(ctx, scaledCanvas) {
        let fontScale = this.canvasBounds.width / 500
        this.camera.draw(ctx, scaledCanvas, () => {
            ctx.fillStyle = "white"
            ctx.font = `${Math.min(Math.floor(24 * fontScale), 24)}px Arial`
            ctx.textAlign = "center"
            ctx.save()
            let tableHeaderText = "Shop Table"
            ctx.translate(-ctx.measureText(tableHeaderText).width, -this.canvasBounds.height * (7 / 16))
            ctx.fillText(tableHeaderText, 0, 0)
            ctx.restore()

            this.tableGrid.draw(ctx, scaledCanvas)
        })




        // this.playButton.setPosition(this.canvasBounds.width / 2, this.canvasBounds.height * (7 / 8))
        // this.playButton.draw(ctx, scaledCanvas)
    }

    update(delta) {
        this.tableGrid.update(delta)
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
                this.stateMachine.transitionTo("storyupdate")
                break
            case KeyCode.Enter:
                this.stateMachine.transitionTo("storeopen")
                break
        }
    }

    onTouchStart(event) {
    }

    onTouchMove(event) {
    }

    onTouchEnd(event) {
        this.stateMachine.transitionTo("storeopen")
    }

    onMouseDown(event) {
    }

    onMouseMove(event) {
    }

    onMouseUp(event) {
    }
}
