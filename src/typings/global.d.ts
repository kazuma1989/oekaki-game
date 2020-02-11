// For omitting `import * as React from "preact"`
// https://github.com/microsoft/TypeScript/issues/3180#issuecomment-102523512
/// <reference types="preact"/>
import React = preact

interface Window {
  // https://github.com/zalmoxisus/redux-devtools-extension
  __REDUX_DEVTOOLS_EXTENSION__?(): any
}
