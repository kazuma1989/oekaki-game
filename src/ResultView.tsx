import css from 'https://unpkg.com/csz'
import Button from './Button.js'
import CloseButton from './CloseButton.js'

export default function ResultView({
  passCount,
  correctCount,
  onClose,
  onReset,
}: {
  passCount: number
  correctCount: number
  onClose?(): void
  onReset?(): void
}) {
  return (
    <div class={style}>
      <CloseButton class={styleCloseButton} onClick={onClose} />

      <div class={styleLabel}>結果</div>

      <div class={styleCount}>正解 {correctCount} 回!</div>
      <div class={styleCount}>パス {passCount} 回!</div>

      <Button theme="danger" label="リセット" onClick={onReset} />
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

const styleCloseButton = css`
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
