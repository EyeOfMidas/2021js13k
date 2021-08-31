import { Camera } from "../../libraries/Camera.js";
import { Point } from "../../libraries/spatial/Point.js";
import { TweenManager, Tween, Easing } from "../../libraries/Tween.js";
import { DomButton } from "../../libraries/components/DomButton.js";
import { KeyCode } from "../../libraries/KeyboardInput.js";
import { Theme } from "../../libraries/components/Theme.js"
import { Save } from "../../libraries/Save.js";

export class MainMenuState {
    constructor(view) {
        this.stateMachine = view.stateMachine
        this.canvasBounds = null
        this.camera = new Camera()
        this.camera.scale = new Point(1, 1)
        this.tweenManager = new TweenManager()

        this.registeredEvents = {}

        this.playerPosition = new Point(0, 0);

        this.playButton = new DomButton(50, 50, view.element, "Play")
        this.wasChanged = false
        this.save = new Save()

        this.deleteSaveButton = new DomButton(50, 50, view.element, "delete save", "skipbutton")
    }

    init(scaledCanvas) {
        this.canvasBounds = scaledCanvas.bounds
    }

    draw(ctx, scaledCanvas) {
        let fontScale = this.canvasBounds.width / 500
        this.camera.draw(ctx, scaledCanvas, () => {
            ctx.fillStyle = Theme.Colors.purple
            ctx.font = `${Math.min(Math.floor(48 * fontScale), 48)}px ${Theme.Fonts.Header}`
            ctx.textAlign="center"
            ctx.save()
            ctx.translate(0, -this.canvasBounds.height * (1 / 4))
            ctx.fillText("Star Shop", 0, 0)
            ctx.restore()
        })

        this.playButton.setPosition(this.canvasBounds.width / 2, this.canvasBounds.height * (3 / 4))
        this.playButton.draw(ctx, scaledCanvas)

        this.deleteSaveButton.setPosition(this.canvasBounds.width * (7 / 8), this.canvasBounds.height * (7 / 8))
        this.deleteSaveButton.draw(ctx, scaledCanvas)
    }

    update(delta) {
        this.playButton.update(delta)
        this.deleteSaveButton.update(delta)
        this.camera.update(delta);
        this.tweenManager.update()
    }

    tick() {
    }

    enter() {
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

        this.deleteSaveButton.attach()
        this.deleteSaveButton.onClick(this.deleteSave.bind(this))
    }
    leave() {
        for (let index in this.registeredEvents) {
            window.removeEventListener(index, this.registeredEvents[index])
        }
        this.registeredEvents = {}
        this.tweenManager.clear()
        this.playButton.remove()
        this.deleteSaveButton.remove()
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
        switch (event.code) {
            case KeyCode.Enter:
                this.stateMachine.transitionTo("storyupdate")
                break
            case KeyCode.Digit1:
                this.stateMachine.transitionTo("storyupdate")
                break
            case KeyCode.Digit2:
                this.stateMachine.transitionTo("morningsetup")
                break
            case KeyCode.Digit3:
                this.stateMachine.transitionTo("storeopen")
                break
            case KeyCode.Digit4:
                this.stateMachine.transitionTo("dayreview")
                break
            case KeyCode.Digit5:
                this.stateMachine.transitionTo("replenish")
                break
            case KeyCode.Digit6:
                this.stateMachine.transitionTo("overnight")
                break
        }
    }

    goToGame() {
        this.stateMachine.transitionTo("storyupdate")
    }

    deleteSave() {
        if(confirm("Are you sure you want to delete your save data?")) {
            this.save.delete()
            alert("Save data deleted")
        }
    }
}
