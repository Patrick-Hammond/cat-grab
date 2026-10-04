## Cat Grab

Built on the `lib` package from [logic-incubator](../logic-incubator), which must be checked out beside
this repo (`../logic-incubator`) with its own `npm install` done. It's compiled from source as
part of this build: import it as `@logic-incubator/lib/...`.

- `npm start` - dev server on http://localhost:4200
- `npm run build` - development build to `dist/`
- `npm run deploy` - production build to `dist/`
- `npm run assets` - builds just the assets (webpack does this itself before every build, and when art
  changes under `npm start`); `npm run assets:check` fails if `src/generated/assets.d.ts` is out of date
- `npm run lint`

## Assets

`assets/` is the source: each folder in it is a **bundle** - here just `global`, loaded at boot behind a
loading screen (see `src/CatGrab.ts`). The sprite sheet in `assets/global/sprites/` is already packed
(`spritesheet.json` + `.png`), the score font is in `fonts/`. Every asset has an id,
`<bundle>.<file name without extension>` (`global.numbers_export`), and the build writes them to
`src/generated/assets.d.ts` (committed), so `game.assets.FontName("global.numbers_export")` is checked by the
compiler. Sprites are still made by their bare names (`assetFactory.CreateSprite("cat_sit")`) - those resolve
through the bundles that are loaded.
