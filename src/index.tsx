import { render } from '/web_modules/preact.js'
import { useState } from '/web_modules/preact/hooks.js'
import css from 'https://unpkg.com/csz'
import Button from './Button.js'
import OpeningView from './OpeningView.js'

function SomePreactComponent() {
  const [active, setActive] = useState(false)
  const toggle = () => setActive(v => !v)

  return <OpeningView />
}

render(<SomePreactComponent />, document.getElementById('root')!)
