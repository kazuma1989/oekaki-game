import produce from '/web_modules/immer.js'
import { Store } from '/web_modules/redux.js'
import { createReduxHooks } from './redux-utils.js'

type State = {
  viewMode: 'opening' | 'game' | 'canvas' | 'result'
  tutorial: boolean

  questionState: 'drawing' | 'passed' | 'correct'
  passCount: number
  correctCount: number

  loadingState: 'initial' | 'waiting' | 'loading' | 'complete' | 'error'
  questions: {
    mainText: string
    subText: string
  }[]
  tutorialQuestions: {
    mainText: string
    subText: string
  }[]
}

type Action =
  | {
      type: 'showResult'
    }
  | {
      type: 'closeResult'
    }
  | {
      type: 'startDrawing'
    }
  | {
      type: 'startGame'
    }
  | {
      type: 'startTutorial'
    }
  | {
      type: 'passQuestion'
    }
  | {
      type: 'correctQuestion'
    }
  | {
      type: 'goToNextQuestion'
    }
  | {
      type: 'resetGame'
    }
  | {
      type: 'APIGetSheetValues.Start'
    }
  | {
      type: 'APIGetSheetValues.Reload'
    }
  | {
      type: 'APIGetSheetValues.Complete'
      payload: {
        sheetValues: (string | boolean)[][]
      }
    }

const { Provider, useDispatch, useSelector, useStore } = createReduxHooks<
  Store<State, Action>
>()

export { Provider, useDispatch, useSelector, useStore }

export const reducer: (state: State, action: Action) => State = produce(
  (state: State | undefined, action: Action): void | State => {
    if (!state) {
      return {
        viewMode: 'opening',
        tutorial: false,
        questionState: 'drawing',
        passCount: 0,
        correctCount: 0,
        loadingState: 'initial',
        questions: [],
        tutorialQuestions: [],
      }
    }

    switch (action.type) {
      case 'showResult':
        state.viewMode = 'result'
        break

      case 'closeResult':
        state.viewMode = 'game'
        break

      case 'startDrawing':
        state.viewMode = 'canvas'
        break

      case 'startGame':
        state.tutorial = false
        state.viewMode = 'game'
        break

      case 'startTutorial':
        state.tutorial = true
        state.viewMode = 'game'
        break

      case 'passQuestion':
        state.viewMode = 'game'
        state.questionState = 'passed'
        state.passCount += 1
        break

      case 'correctQuestion':
        state.viewMode = 'game'
        state.questionState = 'correct'
        state.correctCount += 1
        break

      case 'goToNextQuestion':
        state.questionState = 'drawing'
        break

      case 'resetGame':
        state.viewMode = 'opening'
        state.questionState = 'drawing'
        state.passCount = 0
        state.correctCount = 0
        break

      case 'APIGetSheetValues.Start':
        state.loadingState = 'loading'
        break

      case 'APIGetSheetValues.Reload':
        state.loadingState = 'waiting'
        break

      case 'APIGetSheetValues.Complete':
        const { sheetValues } = action.payload

        state.loadingState = 'complete'

        const parsed = sheetValues
          .slice(1)
          .map(([mainText, subText, forTutorial, disabled]) => {
            if (disabled || (!mainText && !subText)) {
              return null
            }

            return {
              mainText: mainText as string,
              subText: subText as string,
              forTutorial: Boolean(forTutorial),
            }
          })
          .filter(nonNull)

        state.questions = shuffle(parsed.filter(q => !q.forTutorial))
        state.tutorialQuestions = shuffle(parsed.filter(q => q.forTutorial))
        break

      default:
        const _: never = action
    }
  },
)

// https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
function shuffle<T>(array: T[]): T[] {
  const target = [...array]

  for (let i = target.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = target[i]
    target[i] = target[j]
    target[j] = temp
  }

  return target
}

function nonNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}
