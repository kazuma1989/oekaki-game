import css from '/app/web_modules/csz.js'
import { useSelector, useDispatch } from './reducer.js'
import Button from './Button.js'
import CloseButton from './CloseButton.js'

export default function ResultView() {
  const dispatch = useDispatch()
  const close = () => dispatch({ type: 'closeResult' })
  const reset = () => dispatch({ type: 'resetGame' })

  const [passCount, correctCount] = useSelector(state => [
    state.passCount,
    state.correctCount,
  ])

  return (
    <div className={style}>
      <CloseButton floating onClick={close} />

      <div className={styleLabel}>結果</div>

      <div className={styleCount}>正解 {correctCount} 回!</div>
      <div className={styleCount}>パス {passCount} 回!</div>

      <Button theme="danger" label="リセット" onClick={reset} />
    </div>
  )
}

const style = css`
  width: 100%;
  height: 100%;

  display: grid;
  grid-template:
    'label' auto
    'count_1' auto
    'count_1' auto
    'button_primary' 25%
    / auto;
  gap: 5vw 0;
  justify-content: center;
  align-content: center;
  align-items: end;
`

const styleLabel = css`
  font-size: 18vw;
  text-align: center;
`

const styleCount = css`
  text-align: right;
`
