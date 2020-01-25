import { render } from '/web_modules/preact.js'
import { useState } from '/web_modules/preact/hooks.js'
import css from 'https://unpkg.com/csz'

function SomePreactComponent() {
  const [active, setActive] = useState(false)
  const toggle = () => setActive(v => !v)

  return (
    <h1
      class={css`
        color: ${active ? 'var(--red)' : 'var(--black)'};
      `}
      onClick={toggle}
    >
      Hello, World!
    </h1>
  )
}

render(<SomePreactComponent />, document.getElementById('root')!)
