// For omitting `import * as React from "preact"`
// https://github.com/microsoft/TypeScript/issues/3180#issuecomment-102523512
/// <reference types="preact"/>
import React = preact

declare module 'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-window.prod.mjs' {
  export * from 'workbox-window'
}

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
