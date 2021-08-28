import { Camera } from "../../libraries/Camera.js";
import { DomButton } from "../../libraries/components/DomButton.js";
import { TextPop } from "../../libraries/components/TextPop.js";
import { KeyCode } from "../../libraries/KeyboardInput.js"
import { Point } from "../../libraries/spatial/Point.js";
import { Tween, TweenManager } from "../../libraries/Tween.js";
import { Theme } from "../../libraries/components/Theme.js"

export class StoreOpenState {
    constructor(view) {
        this.scaledCanvas = view.scaledCanvas
        this.stateMachine = view.stateMachine
        this.camera = new Camera()
        this.camera.scale = new Point(1, 1)
        this.tweenManager = new TweenManager()
        this.textPops = []

        this.skipButton = new DomButton(50, 50, view.element, "skip", "skipbutton")
    }

    init(scaledCanvas) {
        this.canvasBounds = scaledCanvas.bounds
    }

    draw(ctx, scaledCanvas) {
        let fontScale = this.canvasBounds.width / 500
        this.camera.draw(ctx, scaledCanvas, () => {
            ctx.fillStyle = Theme.Colors.purple
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

        this.skipButton.setPosition(this.canvasBounds.width * (7 / 8), this.canvasBounds.height * (7 / 8))
        this.skipButton.draw(ctx, scaledCanvas)
    }

    update(delta) {
        this.camera.update(delta)
        this.skipButton.update(delta)
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

        this.skipButton.attach()
        this.skipButton.onClick(this.skipToEndOfDay.bind(this))


        let pops = [
            { position: this.getRandomScreenPosition(), amount: "$50", startTime: 1000 },
            { position: this.getRandomScreenPosition(), amount: "$20", startTime: 3000 },
            { position: this.getRandomScreenPosition(), amount: "$30", startTime: 3500 },
            { position: this.getRandomScreenPosition(), amount: "$70", startTime: 4500 },
        ]

        pops.forEach(popData => {
            let pop = new TextPop(this.tweenManager, popData.amount, new Point(popData.position.x, popData.position.y), popData.startTime)
            this.textPops.push(pop)
        })

    }

    getRandomScreenPosition() {
        return new Point(0, 0)
        // return new Point(
        //     Math.floor(this.canvasBounds.width * Math.random() - this.canvasBounds.width / 2),
        //     Math.floor(this.canvasBounds.height * Math.random() - this.canvasBounds.height / 2),
        // )
    }
    leave() {
        for (let index in this.registeredEvents) {
            window.removeEventListener(index, this.registeredEvents[index])
        }

        this.skipButton.remove()
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
                break;
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

    skipToEndOfDay() {
        this.stateMachine.transitionTo("dayreview")
    }
}
