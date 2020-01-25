import { render } from '/web_modules/preact.js'
import { useState } from '/web_modules/preact/hooks.js'
import css from 'https://unpkg.com/csz'
import Button from './Button.js'
import OpeningView from './OpeningView.js'
import ResultView from './ResultView.js'
import GameView from './GameView.js'

function SomePreactComponent() {
  const [active, setActive] = useState(false)
  const toggle = () => setActive(v => !v)

  return (
    <GameView
      questions={[{ mainText: 'xx', subText: 'xxxx' }]}
      questionState="drawing"
      correctCount={0}
      passCount={0}
    />
  )
}

render(<SomePreactComponent />, document.getElementById('root')!)
