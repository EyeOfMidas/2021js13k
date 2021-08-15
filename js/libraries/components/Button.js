import { Point } from "../spatial/Point.js";
import { Rectangle } from "../spatial/Rectangle.js";

export class Button {
    constructor(x, y, width, height, text, options = {}) {
        this.customDraw = null
        this.customClick = null;
        this.center = new Point(x, y);
        this.bounds = new Rectangle(this.center.x - width / 2, this.center.y - height / 2, width, height);
        this.whenHovered = () => {};
        this.isHovered = false;
        this.text = text;
        this.customFontDraw = null;
        this.customBackgroundDraw = null;
        this.options = Object.assign({}, this.defaultOptions(), options);
    }

    setPosition(x, y) {
        this.center.x = x;
        this.center.y = y;
        this.bounds.x = this.center.x - this.bounds.width / 2;
        this.bounds.y = this.center.y - this.bounds.height / 2;
    }

    drawFunction(fnc) {
        this.customDraw = fnc;
    }

    hoverFunction(fnc) {
        this.whenHovered = fnc;
    }

    clickFunction(fnc) {
        this.customClick = fnc;
    }

    fontDrawFunction(fnc) {
        this.customFontDraw = fnc;
    }

    backgroundDrawFunction(fnc) {
        this.customBackgroundDraw = fnc;
    }

    defaultOptions() {
        return {
            fontSize: 48,
            fontFamily: "Arial",
            textAlign: "center",
            lineWidth: 4,
            backgroundFillStyle: "rgba(255,255,255,0.5)",
            backgroundStrokeStyle: null,
            textFillStyle: "white",
            textStrokeStyle: null,
        };
    }

    draw(ctx, scaledCanvas) {
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        
        if(this.customDraw) {
            this.customDraw(ctx, scaledCanvas);
        } else {
            if(this.customBackgroundDraw) {
                this.customBackgroundDraw(ctx, scaledCanvas, this.options);
            } else {
                ctx.beginPath();
                ctx.rect(-this.bounds.width / 2, -this.bounds.height / 2, this.bounds.width, this.bounds.height);
                ctx.closePath();
                ctx.fillStyle = this.options.backgroundFillStyle;
                ctx.strokeStyle = this.options.backgroundStrokeStyle;
                if(this.isHovered) {
                    document.body.style.cursor = "pointer";
                    this.whenHovered(ctx, scaledCanvas);
                }

                if(this.options.backgroundFillStyle) {
                    ctx.fill();
                }
                
                if(this.options.backgroundStrokeStyle) {
                    ctx.stroke();
                }
            }

            if(this.customFontDraw) {
                this.customFontDraw(ctx, scaledCanvas, this.options);
            } else {
                ctx.font = `${this.options.fontSize}px ${this.options.fontFamily}`;
                ctx.textAlign = this.options.textAlign;
                ctx.lineWidth = this.options.lineWidth;
                if(this.options.textFillStyle) {
                    ctx.fillStyle = this.options.textFillStyle;
                    ctx.fillText(this.text, 0, this.options.fontSize * 0.375);
                }
                if(this.options.textStrokeStyle) {
                    ctx.strokeStyle = this.options.textStrokeStyle;
                    ctx.strokeText(this.text, 0, this.options.fontSize * 0.375);
                }
            }
        }
        ctx.restore();
    }

    mouseMove(event) {
        this.isHovered = false;
        let mousePoint = new Point(event.clientX, event.clientY);
        if(this.bounds.pointWithin(mousePoint)) {
            this.isHovered = true;
        }
    }

    mouseDown(event) {
        if(this.customClick) {
            let mousePoint = new Point(event.clientX, event.clientY);
            if(this.bounds.pointWithin(mousePoint)) {
                this.customClick(event);    
            }
            return;
        }
    }
}