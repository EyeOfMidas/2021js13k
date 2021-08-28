import { FiniteStateMachine } from "../libraries/FiniteStateMachine.js";
import { DayReviewState } from "./states/DayReviewState.js";
import { GameOverState } from "./states/GameoverState.js";
import { MainMenuState } from "./states/MainMenuState.js";
import { MorningSetupState } from "./states/MorningSetupState.js";
import { OvernightState } from "./states/OvernightState.js";
import { StarhuntState } from "./states/StarhuntState.js";
import { StoreOpenState } from "./states/StoreOpenState.js";
import { StoryUpdateState } from "./states/StoryUpdateState.js";

export class GameView {
    constructor(viewElement) {
        this.element = viewElement
        this.stateMachine = new FiniteStateMachine();
        this.stateMachine.registerState("mainmenu", new MainMenuState(this))
        this.stateMachine.registerState("storyupdate", new StoryUpdateState(this))
        this.stateMachine.registerState("morningsetup", new MorningSetupState(this))
        this.stateMachine.registerState("storeopen", new StoreOpenState(this))
        this.stateMachine.registerState("dayreview", new DayReviewState(this))
        this.stateMachine.registerState("replenish", new StarhuntState(this))
        this.stateMachine.registerState("overnight", new OvernightState(this))
        this.stateMachine.registerState("gameover", new GameOverState(this))
    }
    async init(scaledCanvas) {
        this.stateMachine.getAllStates().forEach(state => { state.init(scaledCanvas) })
        this.stateMachine.setCurrentState("mainmenu");
        this.scaledCanvas = scaledCanvas
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
