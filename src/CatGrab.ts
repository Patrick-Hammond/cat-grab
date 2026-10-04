import Game from "@logic-incubator/lib/game/Game";
import { AssetLoadError, AssetsDestroyedError } from "@logic-incubator/lib/assets/AssetErrors";
import LoadingScreen from "@logic-incubator/lib/assets/LoadingScreen";
import { GameHeight, GameWidth, GlobalBundle, ManifestUrl, Scenes } from "./Constants";
import CatGrabMain from "./game/CatGrabMain";
import TitlePage from "./game/components/scenes/TitlePage";

/**
 * Starts the game on the page. Returns what takes it down again (its scenes, input, asset bundles
 * and canvas), so the page, or a test, can start another. Nothing calls it in the shipped build: the
 * game lives as long as the page. It can be called while the game is still loading - the load is
 * abandoned and nothing is added to the game that's gone.
 */
export function CatGrab(): () => void {
    const game = new Game({width: GameWidth, height: GameHeight, fullscreen: true});

    Boot(game).catch(error => {
        // The game being taken down mid-load isn't a failure.
        if (!(error instanceof AssetsDestroyedError)) {
            console.error(error);
        }
    });

    return () => game.destroy();
}

/** Loads the global bundle behind a loading screen, then builds and shows the game's scenes. */
async function Boot(game: Game): Promise<void> {
    // What a failed load waits on: the loading screen's Retry.
    let retry: (() => void) | undefined;
    game.sceneManager.AddScene(Scenes.LOADING, new LoadingScreen({ width: GameWidth, height: GameHeight, onRetry: () => retry && retry() }));
    game.sceneManager.ShowScene(Scenes.LOADING);

    await game.assets.Init(ManifestUrl);
    for (;;) {
        try {
            await game.assets.LoadBundle(GlobalBundle);
            break;
        } catch (error) {
            if (!(error instanceof AssetLoadError) || game.Destroyed) {
                throw error;
            }
            await new Promise<void>(resolve => (retry = resolve));
        }
    }
    if (game.Destroyed) {
        return;
    }

    game.sceneManager.AddScene(Scenes.TITLE, new TitlePage());
    game.sceneManager.AddScene(Scenes.GAME, new CatGrabMain());

    game.sceneManager.ShowScene(Scenes.TITLE);
    game.sceneManager.RemoveScene(Scenes.LOADING);
}
