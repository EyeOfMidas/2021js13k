import { GameView } from './viewer/GameView.js';
import { CanvasRenderer } from './libraries/CanvasRenderer.js';
document.body.style.backgroundColor = "black"
document.addEventListener("DOMContentLoaded", () => {
    let viewer = document.getElementById('viewer');
    let renderer = new CanvasRenderer();
    let view = new GameView(viewer);
    view.init().then(() => {
        renderer.init(viewer, view);
        renderer.start();
        setInterval(() => { view.update(1000 / 60); }, Math.floor(1000 / 60));
        setInterval(() => { view.tick(); }, Math.floor(1000 / 60));
    });
});
