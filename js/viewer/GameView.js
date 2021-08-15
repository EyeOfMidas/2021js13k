import { FiniteStateMachine } from "../libraries/FiniteStateMachine.js";
import { MainMenuState } from "./states/MainMenuState.js";
import { OverworldState } from "./states/OverworldState.js";

export class GameView {
    constructor(viewElement) {
        this.element = viewElement
        this.stateMachine = new FiniteStateMachine();
        this.stateMachine.registerState("mainmenu", new MainMenuState(this))
        this.stateMachine.registerState("play", new OverworldState(this))
    }
    async init() {
        this.stateMachine.setCurrentState("mainmenu");
        this.stateMachine.getCurrentState().enter();
    }

    draw(ctx, scaledCanvas) {
        this.stateMachine.getCurrentState().draw(ctx, scaledCanvas);
    }

    update(delta) {
        this.stateMachine.getCurrentState().update(delta);
    }

    tick() {
        this.stateMachine.getCurrentState().tick();
    }
}
