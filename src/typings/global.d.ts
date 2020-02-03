// For omitting `import * as React from "preact"`
// https://github.com/microsoft/TypeScript/issues/3180#issuecomment-102523512
/// <reference types="preact"/>
import React = preact

declare module 'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-window.prod.mjs' {
  export * from 'workbox-window'
}
