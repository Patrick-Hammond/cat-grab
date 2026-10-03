import GameComponent from "@logic-incubator/lib/game/GameComponent";
import { Sprite, Rectangle } from "pixi.js";
import { TITLE_SCREEN_CLOSED } from "../../Events";
import { CenterScreen } from "@logic-incubator/lib/game/display/Utils";

export default class TitlePage extends GameComponent {

    private background : Sprite;

    protected OnInitialise(): void {
        this.background = this.assetFactory.CreateSprite("title");
        this.background.hitArea = new Rectangle(574, 508, 188, 121);
        this.background.interactive = true;
        this.background.buttonMode = true;
        CenterScreen(this.background);

        this.root.addChild(this.background);
    }

    protected OnShow(): void {
        this.background.once("pointerup", this.OnClicked, this);
    }

    protected OnHide(): void {
        this.background.off("pointerup", this.OnClicked, this);
    }

    /** The title only says it's done: `CatGrabMain` answers by taking the stage, which is what takes this off it. */
    private OnClicked(): void {
        this.game.dispatcher.emit(TITLE_SCREEN_CLOSED);
    }
}
