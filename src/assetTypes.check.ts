import type { AssetId } from "@logic-incubator/lib/assets/AssetIds";

/**
 * Compile-time guard: fails the build if the generated asset id declarations (generated/assets.d.ts)
 * didn't merge into lib's registry. `skipLibCheck` is on, which would otherwise hide a declaration
 * file that quietly did nothing - every id type would then be a plain `string` and a mistyped id
 * would compile. With them merged, `AssetId` is a union of literals and `string` isn't assignable to it.
 */
export const AssetIdsAreTyped: string extends AssetId ? never : true = true;
