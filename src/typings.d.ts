// For omitting `import { h } from "preact"`
// https://github.com/microsoft/TypeScript/issues/3180#issuecomment-102523512
/// <reference path="../node_modules/preact/src/index.d.ts"/>
import h = preact.h

declare module 'https://unpkg.com/csz' {
  /**
   * @example
   * <p
   *   class={css`
   *     color: red;
   *     font-size: large;
   *   `}
   * >
   *   Red large text
   * </p>
   */
  export default function css(
    ...expressions: (
      | TemplateStringsArray
      | string
      | boolean
      | null
      | undefined
    )[]
  ): string
}
