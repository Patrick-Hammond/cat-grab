import GameComponent from "@logic-incubator/lib/game/GameComponent";
import Camera from "./components/Camera";
import HomePlayer from "./components/player/HomePlayer";
import HomeViking from "./components/viking/HomeViking";
import Map from "./components/Map";
import Player from "./components/player/Player";
import Viking from "./components/viking/Viking";
import Collisions from "./components/Collisions";
import Cats from "./components/cat/Cats";
import {PlayerHomeLocation, VikingHomeLocation, Scenes} from "../Constants";
import ScoreKeeper from "./components/ScoreKeeper";
import Summary from "./components/scenes/Summary";
import { TITLE_SCREEN_CLOSED } from "./Events";

export default class CatGrabMain extends GameComponent {

    private camera: Camera;
    private map: Map;
    private player: Player;
    private playerHome: HomePlayer;
    private viking: Viking;
    private vikingHome: HomeViking;
    private cats: Cats;

    protected OnInitialise(): void {

        this.camera = this.Attach(new Camera());

        this.map = new Map();

        this.player = new Player(this.map, this.camera);
        this.playerHome = new HomePlayer();

        this.viking = new Viking(this.map);
        this.vikingHome = new HomeViking();

        this.cats = new Cats(this.map);

        // The world, in the camera and drawn back to front in the order it's attached.
        const world = this.camera;
        world.root.addChild(this.map.background);
        world.Attach(this.player.Springs);
        world.Attach(this.viking.Springs);
        world.Attach(this.cats);
        world.Attach(this.viking);
        world.Attach(this.player);
        world.Attach(this.playerHome);
        world.Attach(this.vikingHome);
        world.root.addChild(this.map.foreground);

        // The rules - nothing to draw.
        this.Attach(new Collisions(this.player, this.viking, this.cats));
        this.Attach(new ScoreKeeper());

        // After the camera, so a round's result is drawn over the world.
        this.Attach(new Summary());

        this.Listen(this.game.dispatcher, TITLE_SCREEN_CLOSED, this.OnTitleClosed);
    }

    protected OnShow(): void {
        this.player.Start(PlayerHomeLocation);
        this.viking.Start(VikingHomeLocation);
        this.cats.Start();
    }

    private OnTitleClosed(): void {
        this.game.sceneManager.ShowScene(Scenes.GAME);
    }
}
