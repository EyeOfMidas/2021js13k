import { ScaledCanvas } from './ScaledCanvas.js';

export class CanvasRenderer {
    constructor() {
        this.context = null;
    }

    init(container, scene) {
        this.scaledCanvas = new ScaledCanvas(container);
        this.scaledCanvas.init();
        this.scaledCanvas.setImageSmoothing(false)
        this.context = this.scaledCanvas.getContext();
        this.setScene(scene);
    }

    animate() {
        this.scaledCanvas.clearFrame();
        this.scene.draw(this.scaledCanvas.getContext(), this.scaledCanvas);
        requestAnimationFrame(this.animate.bind(this));
    }

    setScene(scene) {
        this.scene = scene;
    }

    start() {
        this.animate();
    }
}