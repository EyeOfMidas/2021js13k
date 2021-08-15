import { Point } from "../spatial/Point.js";

export class DomButton {
    constructor(x, y, view) {
        this.center = new Point(x, y);
        this.element = document.createElement("button")
        this.element.style.position = "absolute"
        this.element.innerText = "Start"
        this.element.style.zIndex = 1
        this.viewer = view
        this.canvasBounds = null
        this.clickHandler = () => {}
    }

    attach() {
        this.viewer.appendChild(this.element)
    }

    draw(ctx, scaledCanvas) {
        this.canvasBounds = scaledCanvas.bounds;

    }

    update(delta) {
        let bounds = this.element.getBoundingClientRect()
        this.element.style.left = `${this.center.x - bounds.width / 2}px`
        this.element.style.top = `${this.center.y - bounds.height / 2}px`
    }

    setPosition(x, y) {
        this.center.x = x
        this.center.y = y
    }

    tick() {

    }

    onClick(handler) {
        this.element.removeEventListener("click", this.clickHandler)
        this.clickHandler = handler
        this.element.addEventListener("click", this.clickHandler)
    }

    remove() {
        this.element.removeEventListener("click", this.clickHandler)
        this.viewer.removeChild(this.element)
    }
}