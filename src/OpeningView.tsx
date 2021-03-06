import css from '/app/web_modules/csz.js'
import { useSelector, useDispatch } from './reducer.js'
import Button from './Button.js'
import IconButton from './IconButton.js'

export default function OpeningView() {
  const dispatch = useDispatch()
  const reload = () => dispatch({ type: 'APIGetSheetValues.Reload' })
  const startTutorial = () =>
    dispatch({ type: 'startTutorial', payload: { timestamp: Date.now() } })
  const startGame = () =>
    dispatch({ type: 'startGame', payload: { timestamp: Date.now() } })
  const showConfig = () => dispatch({ type: 'openConfig' })

  const loading = useSelector(state => state.loadingState === 'loading')

  return (
    <div className={style}>
      <div className={styleTitle}>お絵かき お題当て</div>

      <Button
        label={loading ? 'ロード中...' : 'お題リロード'}
        disabled={loading}
        onClick={reload}
      />
      <Button label="チュートリアル" onClick={startTutorial} />

      <Button
        className={styleButton}
        theme="primary"
        label="ゲーム開始!"
        disabled={loading}
        onClick={startGame}
      />

      <IconButton className={styleFloating} label="⚙️" onClick={showConfig} />
    </div>
  )
}

const style = css`
  width: 100%;
  height: 100%;

  display: grid;
  grid-template:
    'title' 20%
    'button_1' auto
    'button_2' auto
    'button_primary' 25%
    / auto;
  gap: 5vw 0;
  justify-content: center;
  align-content: center;
  align-items: end;
`

const styleTitle = css`
  align-self: start;
`

const styleButton = css`
  padding: 4vw;
`

const styleFloating = css`
  position: fixed;
  top: 2vw;
  right: 2vw;
  z-index: 10;
`
