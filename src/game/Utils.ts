import {Vec2Like} from "@logic-incubator/lib/math/Geometry";
import {TileSize} from "../Constants";

export function TileToPixel(tileXY: Vec2Like): Vec2Like {
    return {x: tileXY.x * TileSize, y: tileXY.y * TileSize};
}
