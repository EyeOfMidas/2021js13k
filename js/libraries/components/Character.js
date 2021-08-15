import { Point } from "../spatial/Point.js";

export class Character {
    constructor(x = 0, y = 0) {
        this.position = new Point(x ,y)
    }

    load() {
    }

    save() {
    }

    update(delta) {

    }

    draw(ctx, scaledCanvas) {
        ctx.fillStyle="crimson"
        ctx.save()
        ctx.translate(this.position.x, this.position.y)
        ctx.beginPath()
        ctx.rect(0,0,10,10)
        ctx.fill()
        ctx.restore()
    }
}
