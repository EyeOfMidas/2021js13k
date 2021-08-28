export class Point {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    scale(x, y) {
        this.x *= x;
        this.y *= y;
    }

    difference(point){
        return new Point(this.x - point.x, this.y - point.y)
    }

    equals(point) {
        return this.x == point.x && this.y == point.y
    }

    signDifference(point) {
        return new Point(Math.sign(this.x - point.x), Math.sign(this.y - point.y))
    }

    offset(point) {
        return new Point(this.x + point.x, this.y + point.y)
    }

    angleTo(point) {
        return Math.atan2(point.y - this.y, point.x - this.x)
    }

    vectorTo(point) {
        let angle = this.angleTo(point)
        return new Point(Math.cos(angle), Math.sin(angle))
    }

    distanceTo(point) {
        return Math.hypot(point.y - this.y, point.x - this.x)
    }

    roundTo(point, threshholdX, threshholdY) {
        let diff = this.difference(point)
        if(Math.abs(diff.x) <= threshholdX) {
            this.x = point.x
        }

        if(Math.abs(diff.y) <= threshholdY) {
            this.y = point.y
        }
    }

    snapToGrid(grid) {
        let pointOnGrid = new Point(
            Math.round(this.x / grid.width),
            Math.round(this.y / grid.height),
        )
        this.x = pointOnGrid.x * grid.width
        this.y = pointOnGrid.y * grid.height
    }

    snapToSpritesheetGrid(grid) {
        let pointOnGrid = new Point(
            Math.floor(this.x / (grid.width + grid.margin)),
            Math.floor(this.y / (grid.height + grid.margin)),
        )

        this.x = pointOnGrid.x * (grid.width + grid.margin)
        this.y = pointOnGrid.y * (grid.height + grid.margin)
    }
}