// tslint:disable
export const GameWidth = 1024;
export const GameHeight = 768;
export const TileSize = 64;
export const MapWidth = 16;
export const MapHeight = 12;
export const PlayerHomeLocation = {x:1, y:2};
export const VikingHomeLocation = {x:14, y:2};
// Relative to the page, so the build runs from whatever path it's hosted under.
export const AssetPath = "assets/";

export const enum Scenes {
    TITLE = "title", GAME = "game", SUMMARY = "summary"
}
