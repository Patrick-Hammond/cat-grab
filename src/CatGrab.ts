import Game from "@logic-incubator/lib/game/Game";
import Loader from "@logic-incubator/lib/loading/Loader";
import { AssetPath, GameHeight, GameWidth, Scenes } from "./Constants";
import CatGrabMain from "./game/CatGrabMain";
import TitlePage from "./game/components/scenes/TitlePage";

/**
 * Starts the game on the page. Returns what takes it down again (its scenes, input, loaders and
 * canvas), so the page, or a test, can start another. Nothing calls it in the shipped build: the
 * game lives as long as the page.
 */
export function CatGrab(): () => void {
    const game = new Game({width: GameWidth, height: GameHeight, fullscreen: true});

    Loader.inst.LoadSpriteSheet(AssetPath + "spritesheet.json", /^.+(?=_f)/, () => {
        game.loader.add(AssetPath + "numbers-export.fnt");
        game.loader.load(() => {
            game.sceneManager.AddScene(Scenes.TITLE, new TitlePage());
            game.sceneManager.AddScene(Scenes.GAME, new CatGrabMain());

            game.sceneManager.ShowScene(Scenes.TITLE);
        });
    });

    return () => game.destroy();
}
