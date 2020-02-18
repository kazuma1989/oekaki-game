import css from '/app/web_modules/csz.js'
import { useSelector, useDispatch } from './reducer.js'
import Button from './Button.js'
import IconButton from './IconButton.js'

export default function ResultView() {
  const dispatch = useDispatch()
  const close = () => dispatch({ type: 'closeResult' })
  const reset = () => dispatch({ type: 'resetGame' })
  const showGallery = () => dispatch({ type: 'showGallery' })

  const [passCount, correctCount] = useSelector(state => [
    state.passCount,
    state.correctCount,
  ])

  return (
    <div className={style}>
      <IconButton className={styleFloating} label="&times;" onClick={close} />

      <div className={styleLabel}>結果</div>

      <div className={styleCount}>正解 {correctCount} 回!</div>
      <div className={styleCount}>パス {passCount} 回!</div>

      <Button theme="default" label="感想戦" onClick={showGallery} />
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

const styleFloating = css`
  position: fixed;
  top: 2vw;
  right: 2vw;
  z-index: 10;
`

const styleLabel = css`
  font-size: 18vw;
  text-align: center;
`

const styleCount = css`
  text-align: right;
`
