import css from '/app/web_modules/csz.js'
import { useSelector, useDispatch } from './reducer.js'
import Button from './Button.js'

export default function GameView() {
  const dispatch = useDispatch()
  const startDrawing = () => dispatch({ type: 'startDrawing' })
  const nextQuestion = () => dispatch({ type: 'goToNextQuestion' })
  const showResult = () => dispatch({ type: 'showResult' })

  const [
    questions,
    questionState,
    passCount,
    correctCount,
  ] = useSelector(state => [
    state.tutorial ? state.tutorialQuestions : state.questions,
    state.questionState,
    state.passCount,
    state.correctCount,
  ])

  const index =
    questionState === 'drawing'
      ? passCount + correctCount
      : passCount + correctCount - 1

  const questionsLeft = questions.length - index
  const finished = questionsLeft === 0

  let { mainText = '', subText = '' } = questions[index] || {}
  // お題をマスクして隠す
  if (questionState === 'passed') {
    mainText = '＊'.repeat(mainText.length)
    subText = '＊'.repeat(subText.length)
  }

  return (
    <div className={style}>
      <div className={styleHeader}>
        残り {questionsLeft} 問
        <Button
          className={styleHeaderButton}
          label="結果"
          onClick={showResult}
        />
      </div>

      {!finished ? (
        <div className={styleQuestion}>
          <span className={styleQuestionMain}>{mainText}</span>
          <span className={styleQuestionSub}>{subText}</span>

          {questionState === 'passed' && (
            <span className={styleQuestionResult}>パス</span>
          )}
          {questionState === 'correct' && (
            <span
              className={`${styleQuestionResult} ${styleQuestionResultCorrect}`}
            >
              正解!
            </span>
          )}
        </div>
      ) : (
        <div className={styleQuestion}>
          <span className={styleQuestionSub}>お題がありません!</span>
        </div>
      )}

      {questionState === 'drawing' ? (
        <Button
          className={styleButton}
          theme="primary"
          label="絵を描く"
          disabled={finished}
          onClick={startDrawing}
        />
      ) : (
        <Button
          className={styleButton}
          theme="primary"
          label="次のお題を表示"
          disabled={finished}
          onClick={nextQuestion}
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
