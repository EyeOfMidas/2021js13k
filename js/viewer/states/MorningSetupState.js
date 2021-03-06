import { Camera } from "../../libraries/Camera.js";
import { TableGrid } from "../../libraries/components/TableGrid.js";
import { DomButton } from "../../libraries/components/DomButton.js";
import { KeyCode } from "../../libraries/KeyboardInput.js"
import { Point } from "../../libraries/spatial/Point.js";
import { Theme } from "../../libraries/components/Theme.js"

export class MorningSetupState {
    constructor(view) {
        this.stateMachine = view.stateMachine
        this.camera = new Camera()
        this.camera.scale = new Point(1, 1)
        this.tableGrid = new TableGrid()
        this.startDayButton = new DomButton(80, 30, view.element, "Start Day")
    }

    init(scaledCanvas) {
        this.canvasBounds = scaledCanvas.bounds
        this.tableGrid.init(scaledCanvas)
    }

    draw(ctx, scaledCanvas) {
        let fontScale = this.canvasBounds.width / 500
        this.camera.draw(ctx, scaledCanvas, () => {
            ctx.fillStyle = Theme.Colors.darkblue
            ctx.beginPath()
            ctx.rect(-this.canvasBounds.width / 2,
                -this.canvasBounds.height / 2,
                this.canvasBounds.width,
                this.canvasBounds.height / 2
            )
            ctx.fill()
            ctx.fillStyle = Theme.Colors.white
            ctx.font = `bold ${Math.min(Math.floor(24 * fontScale), 24)}px ${Theme.Fonts.Header}`
            ctx.textAlign = "left"

            let tableHeaderText = "Shop Table"
            ctx.save()
            ctx.translate(-this.tableGrid.tableBounds.width / 2, -this.canvasBounds.height * (7 / 16))
            ctx.fillText(tableHeaderText, 0, 0)
            ctx.restore()

            ctx.font = `${Math.min(Math.floor(16 * fontScale), 16)}px ${Theme.Fonts.Text}`
            ctx.fillStyle = Theme.Colors.white
            ctx.textAlign = "center"
            ctx.fillText("Drag the items you wish to sell for the day on to the table", 0, -this.canvasBounds.height * (1 / 16))

            this.tableGrid.draw(ctx, scaledCanvas)
        })

        this.startDayButton.setPosition(this.canvasBounds.width * (3 / 4), this.canvasBounds.height * (7 / 8))
        this.startDayButton.draw(ctx, scaledCanvas)
    }

    update(delta) {
        this.startDayButton.update(delta)
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

        this.startDayButton.attach()
        this.startDayButton.onClick(this.startDay.bind(this))
    }
    leave() {
        for (let index in this.registeredEvents) {
            window.removeEventListener(index, this.registeredEvents[index])
        }
        this.startDayButton.remove()
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
                this.startDay()
                break
        }
    }

    onTouchStart(event) {
    }

    onTouchMove(event) {
    }

    onTouchEnd(event) {
        //this.stateMachine.transitionTo("storeopen")
    }

    onMouseDown(event) {
    }

    onMouseMove(event) {
    }

    onMouseUp(event) {
    }

    startDay() {
        this.stateMachine.transitionTo("storeopen")
    }
}
