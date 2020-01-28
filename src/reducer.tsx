import produce from '/web_modules/immer.js'
import { createStore, Store } from '/web_modules/redux.js'
import { createContext } from '/web_modules/preact.js'
import { useReducer, useEffect, useContext } from '/web_modules/preact/hooks.js'

type State = {
  viewMode: 'opening' | 'game' | 'canvas' | 'result'
  tutorial: boolean

  questionState: 'drawing' | 'passed' | 'correct'
  passCount: number
  correctCount: number

  loading: boolean
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
      type: 'loadStart.sheetValues'
    }
  | {
      type: 'loadEnd.sheetValues'
      payload: {
        sheetValues: (string | boolean)[][]
      }
    }

const reducer: (state: State, action: Action) => State = produce(
  (state: State | undefined, action: Action): void | State => {
    if (!state) {
      return {
        viewMode: 'opening',
        tutorial: false,
        questionState: 'drawing',
        passCount: 0,
        correctCount: 0,
        loading: false,
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

      case 'loadStart.sheetValues':
        state.loading = true
        break

      case 'loadEnd.sheetValues':
        const { sheetValues } = action.payload

        state.loading = false

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

const initialState = reducer(undefined as any, {} as any)
export function useRootReducer() {
  return useReducer<State, Action>(reducer, initialState)
}

// -----
// Redux
// Experimental
const storeContext = createContext<Store<State, Action>>(createStore(reducer))

export function useStore() {
  return useContext(storeContext)
}

export function useDispatch() {
  const store = useStore()

  return store.dispatch
}

export function useSelector<TSlice>(
  selector: (state: State) => TSlice,
  equalityFn: (a: TSlice, b: TSlice) => boolean = refEquality,
): TSlice {
  const [, forceRender] = useReducer(s => s + 1, 0)

  const store = useStore()
  useEffect(() => store.subscribe(() => forceRender({})), [store])

  return selector(store.getState())
}

const refEquality = (a: any, b: any) => a === b

// https://github.com/reduxjs/react-redux/blob/77a204412190e825aa35696fd88adf2f1d8bca02/src/utils/shallowEqual.js
export function shallowEqual<T>(objA: T, objB: any) {
  if (is(objA, objB)) return true

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) return false

  for (let i = 0; i < keysA.length; i++) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
      !is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false
    }
  }

  return true
}

function is(x: any, y: any) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y
  } else {
    return x !== x && y !== y
  }
}
