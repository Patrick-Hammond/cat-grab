import GameComponent from "@logic-incubator/lib/game/GameComponent";
import { Sprite, BitmapText, Rectangle } from "pixi.js";
import { ROUND_FINISHED, NEXT_ROUND } from "../../Events";
import { CenterScreen, CenterOn } from "@logic-incubator/lib/game/display/Utils";

/** The round's result, over the game: part of `CatGrabMain` rather than a scene of its own, and out of sight between rounds. */
export default class Summary extends GameComponent {

    private player: Sprite;
    private playerText: BitmapText;
    private viking: Sprite;
    private vikingText: BitmapText;

    private background : Sprite;

    protected OnInitialise(): void {
        this.background = this.assetFactory.CreateSprite("victory");
        this.background.hitArea = new Rectangle(171, 447, 178, 96);
        this.background.interactive = true;
        this.background.buttonMode = true;
        CenterScreen(this.background);

        this.player = this.assetFactory.CreateSprite("player_1");
        this.player.scale.set(2.5);
        CenterOn(this.player, this.background).y = 46;

        this.playerText = this.assetFactory.CreateBitmapText(this.game.assets.FontName("global.numbers_export"), 46);
        this.playerText.anchor = 0.5;
        this.playerText.text = "34";
        this.playerText.position.set(136, 380);


        this.viking = this.assetFactory.CreateSprite("viking");
        this.viking.scale.set(4.5);
        CenterOn(this.viking, this.background).y = 46;

        this.vikingText = this.assetFactory.CreateBitmapText(this.game.assets.FontName("global.numbers_export"), 46);
        this.vikingText.anchor = 0.5;
        this.vikingText.text = "67";
        this.vikingText.position.set(379, 380);

        this.background.addChild(this.player, this.viking, this.playerText, this.vikingText);
        this.root.addChild(this.background);
        this.root.visible = false;

        this.Listen(this.game.dispatcher, ROUND_FINISHED, this.OnRoundFinished);
    }

    protected OnHide(): void {
        // Closed with the game, not by a click: no click is left waiting for the next time.
        this.background.off("pointerup", this.OnClicked, this);
        this.root.visible = false;
    }

    private OnRoundFinished(playerWon: boolean, playerRoundsWon: string, vikingRoundsWon: string): void {
        this.player.visible = playerWon;
        this.viking.visible = !playerWon;

        this.playerText.text = playerRoundsWon;
        this.vikingText.text = vikingRoundsWon;

        this.root.visible = true;
        this.background.once("pointerup", this.OnClicked, this);
    }

    private OnClicked(): void {
        this.root.visible = false;
        this.game.dispatcher.emit(NEXT_ROUND);
    }
}
