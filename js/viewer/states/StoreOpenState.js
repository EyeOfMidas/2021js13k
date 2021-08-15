import { Camera } from "../../libraries/Camera.js";
import { TextPop } from "../../libraries/components/TextPop.js";
import { KeyCode } from "../../libraries/KeyboardInput.js"
import { Point } from "../../libraries/spatial/Point.js";
import { Tween, TweenManager } from "../../libraries/Tween.js";

export class StoreOpenState {
    constructor(view) {
        this.scaledCanvas = view.scaledCanvas
        this.stateMachine = view.stateMachine
        this.camera = new Camera()
        this.camera.scale = new Point(1, 1)
        this.tweenManager = new TweenManager()
        this.textPops = []
    }

    init(scaledCanvas) {
        this.canvasBounds = scaledCanvas.bounds
    }

    draw(ctx, scaledCanvas) {
        let fontScale = this.canvasBounds.width / 500
        this.camera.draw(ctx, scaledCanvas, () => {
            ctx.fillStyle = "white"
            ctx.font = `${Math.min(Math.floor(48 * fontScale), 48)}px Arial`
            ctx.textAlign = "center"
            ctx.save()
            ctx.translate(0, -this.canvasBounds.height * (1 / 4))
            ctx.fillText("Store Open", 0, 0)
            ctx.restore()


            this.textPops.forEach(textpop => {
                textpop.draw(ctx, scaledCanvas)
            })
        })
    }

    update(delta) {
        this.camera.update(delta)
        this.tweenManager.update()
    }

    tick() {
        if (this.textPops.filter(pop => !pop.isCompleted).length == 0) {
            this.stateMachine.transitionTo("dayreview")
        }
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

        let pops = [
            { position: new Point(50, 200), amount: "$50", startTime: 2000 },
            { position: new Point(50, 200), amount: "$20", startTime: 5000 },
            { position: new Point(50, 200), amount: "$30", startTime: 6000 },
            { position: new Point(50, 200), amount: "$70", startTime: 9000 },
        ]

        pops.forEach(popData => {
            let pop = new TextPop(this.tweenManager, popData.amount, new Point(popData.position.x, popData.position.y), popData.startTime)
            this.textPops.push(pop)
        })

    }
    leave() {
        for (let index in this.registeredEvents) {
            window.removeEventListener(index, this.registeredEvents[index])
        }

        this.textPops = []
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
                this.stateMachine.transitionTo("morningsetup")
                break
            case KeyCode.Enter:
                this.stateMachine.transitionTo("dayreview")
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
