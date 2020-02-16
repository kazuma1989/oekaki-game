import produce from '/app/web_modules/immer.js'
import { Store } from '/app/web_modules/redux.js'
import { createReduxHooks } from './redux-utils.js'

export type State = {
  viewMode: 'opening' | 'config' | 'game' | 'canvas' | 'result'
  tutorial: boolean

  questionState: 'drawing' | 'passed' | 'correct'
  passCount: number
  correctCount: number

  loadingState: 'initial' | 'waiting' | 'loading' | 'complete' | 'error'
  questions: {
    mainText: string
    subText?: string
  }[]
  tutorialQuestions: {
    mainText: string
    subText?: string
  }[]

  drawingHistory: (['start' | 'draw', number, number] | ['clear'])[]

  cacheClearingState: 'initial' | 'waiting' | 'loading' | 'complete' | 'error'
}

type Action =
  | {
      type: 'openConfig'
    }
  | {
      type: 'closeConfig'
    }
  | {
      type: 'clearCache'
    }
  | {
      type: 'clearCache.Start'
    }
  | {
      type: 'clearCache.Complete'
    }
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
        sheetValues: {
          mainText: string
          subText?: string
        }[]
      }
    }
  | {
      type: 'draw.start'
      payload: {
        x: number
        y: number
      }
    }
  | {
      type: 'draw.draw'
      payload: {
        x: number
        y: number
      }
    }
  | {
      type: 'draw.clear'
    }
  | {
      type: 'draw.undo'
    }

const { Provider, useDispatch, useSelector, useStore } = createReduxHooks<
  Store<State, Action>
>()

export { Provider, useDispatch, useSelector, useStore }

const initialState: State = {
  viewMode: 'opening',
  tutorial: false,
  questionState: 'drawing',
  passCount: 0,
  correctCount: 0,
  loadingState: 'initial',
  questions: [],
  tutorialQuestions: [
    { mainText: '太陽' },
    { mainText: '山' },
    { mainText: '川' },
  ],
  drawingHistory: [],
  cacheClearingState: 'initial',
}

export const reducer: (state: State, action: Action) => State = produce(
  (state: State | undefined, action: Action): void | State => {
    if (!state) {
      return initialState
    }

    switch (action.type) {
      case 'openConfig': {
        state.viewMode = 'config'
        break
      }

      case 'closeConfig': {
        state.viewMode = 'opening'
        break
      }

      case 'clearCache': {
        state.cacheClearingState = 'waiting'
        break
      }

      case 'clearCache.Start': {
        state.cacheClearingState = 'loading'
        break
      }

      case 'clearCache.Complete': {
        return {
          ...initialState,
          cacheClearingState: 'complete',
        }
      }

      case 'showResult': {
        state.viewMode = 'result'
        break
      }

      case 'closeResult': {
        state.viewMode = 'game'
        break
      }

      case 'startDrawing': {
        state.viewMode = 'canvas'
        break
      }

      case 'startGame': {
        state.tutorial = false
        state.viewMode = 'game'
        break
      }

      case 'startTutorial': {
        state.tutorial = true
        state.viewMode = 'game'
        break
      }

      case 'passQuestion': {
        state.viewMode = 'game'
        state.questionState = 'passed'
        state.passCount += 1
        state.drawingHistory = []
        break
      }

      case 'correctQuestion': {
        state.viewMode = 'game'
        state.questionState = 'correct'
        state.correctCount += 1
        state.drawingHistory = []
        break
      }

      case 'goToNextQuestion': {
        state.questionState = 'drawing'
        break
      }

      case 'resetGame': {
        state.viewMode = 'opening'
        state.questionState = 'drawing'
        state.passCount = 0
        state.correctCount = 0
        state.loadingState = 'waiting'
        break
      }

      case 'APIGetSheetValues.Start': {
        state.loadingState = 'loading'
        break
      }

      case 'APIGetSheetValues.Reload': {
        state.loadingState = 'waiting'
        break
      }

      case 'APIGetSheetValues.Complete': {
        const { sheetValues } = action.payload

        state.loadingState = 'complete'
        state.questions = sheetValues
        break
      }

      case 'draw.start': {
        const { x, y } = action.payload

        state.drawingHistory.push(['start', x, y])
        break
      }

      case 'draw.draw': {
        const { x, y } = action.payload

        state.drawingHistory.push(['draw', x, y])
        break
      }

      case 'draw.clear': {
        state.drawingHistory.push(['clear'])
        break
      }

      case 'draw.undo': {
        const targetIndex =
          state.drawingHistory.length -
          1 -
          [...state.drawingHistory]
            .reverse()
            .findIndex(([type]) => type === 'start' || type === 'clear')

        state.drawingHistory.splice(targetIndex)
        break
      }

      default: {
        const _: never = action
      }
    }
  },
)
