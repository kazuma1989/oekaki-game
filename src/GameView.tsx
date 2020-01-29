import css from 'https://unpkg.com/csz'
import { useState } from '/web_modules/preact/hooks.js'
import Button from './Button.js'
import Timer from './Timer.js'

export default function GameView({
  questions = [],
  questionState,
  passCount,
  correctCount,
  onStartDrawing,
  onNextQuestion,
  onShowResult,
}: {
  questions?: { mainText?: string; subText?: string }[]
  questionState: 'drawing' | 'passed' | 'correct'
  passCount: number
  correctCount: number
  onStartDrawing?(): void
  onNextQuestion?(): void
  onShowResult?(): void
}) {
  const [timerFinished, setTimerFinished] = useState(false)
  const finishTimer = () => setTimerFinished(true)

  const index =
    questionState === 'drawing'
      ? passCount + correctCount
      : passCount + correctCount - 1

  const questionsLeft = questions.length > index
  const finished = !questionsLeft || timerFinished

  let { mainText = '', subText = '' } = questions[index] || {}
  // お題をマスクして隠す
  if (questionState === 'passed') {
    mainText = '＊'.repeat(mainText.length)
    subText = '＊'.repeat(subText.length)
  }

  return (
    <div class={style}>
      <div class={styleHeader}>
        <Timer limitSecond={300} onFinish={finishTimer} />
        <Button class={styleHeaderButton} label="結果" onClick={onShowResult} />
      </div>

      {questionsLeft ? (
        <div class={styleQuestion}>
          <span class={styleQuestionMain}>{mainText}</span>
          <span class={styleQuestionSub}>{subText}</span>

          {questionState === 'passed' && (
            <span class={styleQuestionResult}>パス</span>
          )}
          {questionState === 'correct' && (
            <span
              class={`${styleQuestionResult} ${styleQuestionResultCorrect}`}
            >
              正解!
            </span>
          )}
        </div>
      ) : (
        <div class={styleQuestion}>
          <span class={styleQuestionSub}>お題がありません!</span>
        </div>
      )}

      {questionState === 'drawing' ? (
        <Button
          class={styleButton}
          theme="primary"
          label="絵を描く"
          disabled={finished}
          onClick={onStartDrawing}
        />
      ) : (
        <Button
          class={styleButton}
          theme="primary"
          label="次のお題を表示"
          disabled={finished}
          onClick={onNextQuestion}
        />
      )}
    </div>
  )
}

const style = css`
  width: 100%;
  height: 100%;

  display: grid;
  grid-template:
    'header header' 13%
    'question question' auto
    'button button' 15%
    / 50% 50%;
`

const styleHeader = css`
  grid-area: header;

  margin: 2vw 2vw 0 4vw;

  display: flex;
  justify-content: space-between;
  align-items: center;
`

const styleHeaderButton = css`
  padding: 0 5vw;
`

const styleQuestion = css`
  grid-area: question;

  margin: 2vw 0;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
`

const styleQuestionMain = css`
  text-align: center;
  font-size: 15vw;
  color: rgba(0, 0, 0, 0.8);
`

const styleQuestionSub = css`
  text-align: center;
  font-size: 7vw;
  color: rgba(0, 0, 0, 0.5);
`

const styleQuestionResult = css`
  position: absolute;
  z-index: -1;

  border: solid 3vw;
  width: 90vw;
  height: 90vw;

  border-radius: 50%;
  transform: rotate(-25deg);

  font-size: 25vw;
  display: flex;
  justify-content: center;
  align-items: center;
`

const styleQuestionResultCorrect = css`
  color: crimson;
  filter: opacity(0.5);
`

const styleButton = css`
  grid-area: button;

  margin: 0 2vw 2vw 2vw;
  padding: 0;
`
