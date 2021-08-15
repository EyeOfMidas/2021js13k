import { Camera } from "../../libraries/Camera.js";
import { Character } from "../../libraries/components/Character.js";
import { Point } from "../../libraries/spatial/Point.js";
import { TweenManager, Tween, Easing } from "../../libraries/Tween.js";
import { KeyCode, keys } from "../../libraries/KeyboardInput.js";

export class OverworldState {
    constructor(view) {
        this.stateMachine = view.stateMachine
        this.canvasBounds = null
        this.camera = new Camera()
        this.camera.scale = new Point(1, 1)
        this.tweenManager = new TweenManager()
        this.player = new Character(0, 0)
        this.targetPosition = new Point(0,0)
        this.isMoving = false
    }

    init(self) {
    }

    draw(ctx, scaledCanvas) {
        this.canvasBounds = scaledCanvas.bounds;
        this.camera.draw(ctx, scaledCanvas, () => {
            this.player.draw(ctx,scaledCanvas)
        })
    }

    update(delta) {
        
        if(!this.targetPosition.equals(this.player.position)) {
            let moveDelta = this.targetPosition.signDifference(this.player.position)
            this.player.position = this.player.position.offset(moveDelta)
        }

        this.camera.update(delta)
        this.tweenManager.update()
    }

    tick() {
        if(keys[KeyCode.KeyW]) {
            this.targetPosition.y = this.player.position.y - 1
        }
        if(keys[KeyCode.KeyS]) {
            this.targetPosition.y = this.player.position.y + 1
        }
        if(keys[KeyCode.KeyA]) {
            this.targetPosition.x = this.player.position.x - 1
        }
        if(keys[KeyCode.KeyD]) {
            this.targetPosition.x = this.player.position.x + 1
        }
    }

    enter() {
        this.init(this.stateMachine.getState("view"))
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

        for(let index in this.registeredEvents) {
            window.addEventListener(index, this.registeredEvents[index])
        }
    }
    leave() {
        for(let index in this.registeredEvents) {
            window.removeEventListener(index, this.registeredEvents[index])
        }
        this.tweenManager.clear()
    }

    onFinish() {
    }

    onResize() {
    }

    onKeyDown(event) {
    }

    onKeyUp(event) {
        switch(event.key) {
            case KeyCode.Escape:
                this.stateMachine.transitionTo("mainmenu")
                break
        }
    }

    onTouchStart(event) {
        let touchPosition = new Point(event.changedTouches[0].clientX, event.changedTouches[0].clientY)
        let worldTouchPosition = this.camera.screenToWorld(touchPosition)
        this.targetPosition = worldTouchPosition
    }

    onTouchMove(event) {
        let touchPosition = new Point(event.changedTouches[0].clientX, event.changedTouches[0].clientY)
        let worldTouchPosition = this.camera.screenToWorld(touchPosition)
        this.targetPosition = worldTouchPosition
    }

    onTouchEnd(event) {
        this.targetPosition = this.player.position

    }

    onMouseDown(event) {
        if(event.button == 0) {
        let touchPosition = new Point(event.clientX, event.clientY)
        let worldTouchPosition = this.camera.screenToWorld(touchPosition)
        this.targetPosition = worldTouchPosition
        this.isMoving = true
        }
    }

    onMouseMove(event) {
        if(this.isMoving) {
        let touchPosition = new Point(event.clientX, event.clientY)
        let worldTouchPosition = this.camera.screenToWorld(touchPosition)
        this.targetPosition = worldTouchPosition
        }
    }

    onMouseUp(event) {
        this.isMoving = false
        this.targetPosition = this.player.position

    }
}
