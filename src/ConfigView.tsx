import css from '/app/web_modules/csz.js'
import { useDispatch, useSelector } from './reducer.js'
import Button from './Button.js'
import IconButton from './IconButton.js'

export default function ConfigView() {
  const dispatch = useDispatch()
  const close = () => dispatch({ type: 'closeConfig' })
  const clearCache = () => dispatch({ type: 'clearCache' })

  const running = useSelector(state => state.cacheClearingState === 'loading')

  return (
    <div className={style}>
      <IconButton className={styleFloating} label="&times;" onClick={close} />

      <Button
        theme="danger"
        label="キャッシュクリア"
        disabled={running}
        onClick={clearCache}
      />
    </div>
  )
}

const style = css`
  width: 100%;
  height: 100%;

  display: grid;
  grid-template:
    'button_primary' auto
    / auto;
  gap: 5vw 0;
  justify-content: center;
  align-content: center;
`

const styleFloating = css`
  position: fixed;
  top: 2vw;
  right: 2vw;
  z-index: 10;
`
