import { Camera } from "../../libraries/Camera.js";
import { Point } from "../../libraries/spatial/Point.js";
import { TweenManager, Tween, Easing } from "../../libraries/Tween.js";
import { DomButton } from "../../libraries/components/DomButton.js";

export class MainMenuState {
    constructor(view) {
        this.stateMachine = view.stateMachine
        this.canvasBounds = null
        this.camera = new Camera()
        this.camera.scale = new Point(1, 1)
        this.tweenManager = new TweenManager()

        this.registeredEvents = {}

        this.playerPosition = new Point(0, 0);

        this.playButton = new DomButton(50, 50, view.element)
        this.wasChanged = false
    }

    init(self) {
    }

    draw(ctx, scaledCanvas) {
        this.canvasBounds = scaledCanvas.bounds;
        let fontScale = this.canvasBounds.width / 500
        this.camera.draw(ctx, scaledCanvas, () => {
            ctx.fillStyle="white"
            ctx.font=`${Math.min(Math.floor(48 * fontScale), 48)}px Arial`
            ctx.textAlign="center"
            ctx.save()
            ctx.translate(0, -this.canvasBounds.height * (1 / 4))
            ctx.fillText("2021 js13k Game", 0, 0)
            ctx.restore()
        })

        this.playButton.setPosition(this.canvasBounds.width / 2, this.canvasBounds.height * (7 / 8))
        this.playButton.draw(ctx, scaledCanvas)
    }

    update(delta) {
        this.playButton.update(delta)
        this.camera.update(delta);
        this.tweenManager.update()
    }

    tick() {
    }

    enter() {
        this.init(this.stateMachine.getState("view"))
        this.registeredEvents["click"] = this.onClick.bind(this)
        this.registeredEvents["resize"] = this.onResize.bind(this)
        this.registeredEvents["keyup"] = this.onKeyUp.bind(this)
        this.registeredEvents["mousemove"] = this.onMouseMove.bind(this)
        this.registeredEvents["mousedown"] = this.onMouseDown.bind(this)
        this.registeredEvents["touchend"] = this.onTouchEnd.bind(this)

        for (let index in this.registeredEvents) {
            window.addEventListener(index, this.registeredEvents[index])
        }

        this.playButton.attach()
        this.playButton.onClick(this.goToGame.bind(this))
    }
    leave() {
        for (let index in this.registeredEvents) {
            window.removeEventListener(index, this.registeredEvents[index])
        }
        this.registeredEvents = {}
        this.tweenManager.clear()
        this.playButton.remove()
    }

    onClick() {
    }

    onMouseMove(event) {
    }

    onMouseDown(event) {
    }

    onTouchEnd(event) {
    }

    onFinish() {
    }

    onResize() {
    }

    onKeyUp(event) {
    }

    goToGame() {
        this.stateMachine.transitionTo("play")
    }
}
