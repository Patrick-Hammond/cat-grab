import GameComponent from "@logic-incubator/lib/game/GameComponent";
import { CAT_HOME_PLAYER, CAT_HOME_VIKING, NEXT_ROUND, ROUND_FINISHED } from "../Events";
import Cat from "./cat/Cat";

export default class ScoreKeeper extends GameComponent {

    private catsHomePlayer: number;
    private catsHomeViking: number;
    private playerRoundsWon: number;
    private vikingRoundsWon: number;

    constructor() {
        super();

        this.playerRoundsWon = this.vikingRoundsWon = 0;
        this.catsHomePlayer  = this.catsHomeViking = 0;
    }

    protected OnInitialise(): void {
        this.Listen(this.game.dispatcher, NEXT_ROUND, this.OnRoundStart);
        this.Listen(this.game.dispatcher, CAT_HOME_PLAYER, (tint, cat) => this.OnCatHome("player", cat));
        this.Listen(this.game.dispatcher, CAT_HOME_VIKING, (tint, cat) => this.OnCatHome("viking", cat));
    }

    private OnRoundStart(): void {
        this.catsHomePlayer  = this.catsHomeViking = 0;
    }

    private OnCatHome(home: "player" | "viking", cat: Cat) : void {
        home === "player" ? this.catsHomePlayer++ : this.catsHomeViking++;

        if(this.catsHomePlayer + this.catsHomeViking === 5) {

            const playerWon = this.catsHomePlayer > this.catsHomeViking;

            playerWon ? this.playerRoundsWon++ : this.vikingRoundsWon++;

            this.game.dispatcher.emit(ROUND_FINISHED, playerWon, this.playerRoundsWon.toString(), this.vikingRoundsWon.toString());
        }
    }
}