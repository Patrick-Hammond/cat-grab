// tslint:disable
export const GameWidth = 1024;
export const GameHeight = 768;
export const TileSize = 64;
export const MapWidth = 16;
export const MapHeight = 12;
export const PlayerHomeLocation = {x:1, y:2};
export const VikingHomeLocation = {x:14, y:2};
// Where the asset build's output is served - relative to the page, so the build runs from whatever path it's hosted under.
export const ManifestUrl = "assets/manifest.json";
/** Loaded at boot and kept for the life of the game: the sprite sheet and the score font. */
export const GlobalBundle = "global";

export const enum Scenes {
    LOADING = "loading", TITLE = "title", GAME = "game"
}
