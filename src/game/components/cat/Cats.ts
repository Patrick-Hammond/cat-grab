import GameComponent from "@logic-incubator/lib/game/GameComponent";
import ObjectPool from "@logic-incubator/lib/patterns/ObjectPool";
import Cat from "./Cat";
import Map from "../Map";
import {CAT_POSITIONS, CAT_HOME_PLAYER, CAT_HOME_VIKING, NEXT_ROUND} from "../../Events";
import { Cancel, GetInterval, Wait } from "@logic-incubator/lib/game/Timing";
import { Vec2Like } from "@logic-incubator/lib/math/Geometry";

export default class Cats extends GameComponent {

    private cats: ObjectPool<Cat>;
    private catDispatched: number;
    /** What `Start` set going, for as long as the game is showing. */
    private timers: Cancel[] = [];

    constructor(private map: Map) {
        super();
    }

    protected OnInitialise(): void {
        this.cats = new ObjectPool<Cat>(6, () => new Cat(this.root, this.map), cat => cat.Recall());

        this.Listen(this.game.dispatcher, CAT_HOME_PLAYER, (tint, cat) => this.OnCatHome(cat));
        this.Listen(this.game.dispatcher, CAT_HOME_VIKING, (tint, cat) => this.OnCatHome(cat));
        this.Listen(this.game.dispatcher, NEXT_ROUND, this.OnRoundStart);
    }

    protected OnHide(): void {
        this.StopTimers();
    }

    protected OnDestroy(): void {
        this.StopTimers();
        this.cats.RestoreAll();
    }

    Start(): void {
        this.catDispatched = 0;

        this.StopTimers();
        this.timers.push(
            GetInterval(5000, this.DispatchNext, this),
            Wait(500, this.DispatchNext, this),
            GetInterval(5000, this.BroadcastPositions, this)
        );
    }

    CheckCollision(position: Vec2Like): Cat[] {
        return this.cats.Popped.filter(cat => cat.CheckCollision(position));
    }

    private DispatchNext(): void {
        if(this.catDispatched < 6) {
            this.cats.Get().Start();
            this.catDispatched++;
        }
    }

    private BroadcastPositions(): void {
        this.game.dispatcher.emit(CAT_POSITIONS, this.cats.Popped);
    }

    private OnCatHome(cat: Cat) : void {
        this.cats.Put(cat);
    }

    private OnRoundStart(): void {
        this.catDispatched = 0;
        this.cats.RestoreAll();
    }

    private StopTimers(): void {
        this.timers.forEach(cancel => cancel());
        this.timers = [];
    }
}
