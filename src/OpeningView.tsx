import css from 'https://unpkg.com/csz'
import Button from './Button.js'

export default function OpeningView({
  loading,
  onReload,
  onStartTutorial,
  onStartGame,
}: {
  loading?: boolean
  onReload?(): void
  onStartTutorial?(): void
  onStartGame?(): void
}) {
  return (
    <div class={style}>
      <div class="title">お絵かき お題当て</div>

      <Button
        label={loading ? 'ロード中...' : 'お題リロード'}
        disabled={loading}
        onClick={onReload}
      />
      <Button
        label="チュートリアル"
        disabled={loading}
        onClick={onStartTutorial}
      />

      <Button
        class="button"
        theme="primary"
        label="ゲーム開始!"
        disabled={loading}
        onClick={onStartGame}
      />
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

  > .title {
    align-self: start;
  }

  > .button {
    padding: 4vw;
  }
`
