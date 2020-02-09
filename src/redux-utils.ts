import { createContext } from '/app/web_modules/preact.js'
import {
  useReducer,
  useContext,
  useRef,
  useLayoutEffect,
} from '/app/web_modules/preact/hooks.js'
import { Store, Dispatch } from '/app/web_modules/redux.js'

type StateOf<TStore> = TStore extends Store<infer S, any> ? S : unknown
type ActionOf<TStore> = TStore extends Store<any, infer A> ? A : unknown

export function createReduxHooks<TStore extends Store>() {
  type S = StateOf<TStore>
  type A = ActionOf<TStore>

  const context = createContext<Store<S, A> | null>(null)
  const { Provider } = context

  function useStore(): Store<S, A> {
    const store = useContext(context)
    if (!store) {
      throw new Error('no store provided')
    }

    return store
  }

  function useDispatch(): Dispatch<A> {
    const store = useStore()

    return store.dispatch
  }

  function useSelector<TSelectedState>(
    selector: (state: S) => TSelectedState,
    equalityFn: (a: TSelectedState, b: any) => boolean = refEquality,
  ): TSelectedState {
    const [, forceRender] = useReducer(s => s + 1, 0)

    const store = useStore()
    const latestSelector = useRef(selector)
    const latestSelectedState = useRef<TSelectedState | null>(null)

    let selectedState: TSelectedState
    if (latestSelectedState.current && selector === latestSelector.current) {
      selectedState = latestSelectedState.current
    } else {
      selectedState = selector(store.getState())
    }

    useLayoutEffect(() => {
      latestSelector.current = selector
      latestSelectedState.current = selectedState
    })

    useLayoutEffect(
      () =>
        store.subscribe(() => {
          const newSelectedState = latestSelector.current(store.getState())

          const changed = !equalityFn(
            newSelectedState,
            latestSelectedState.current,
          )
          if (changed) {
            latestSelectedState.current = newSelectedState
            forceRender({})
          }
        }),
      [store, equalityFn],
    )

    return selectedState
  }

  return {
    Provider,
    useStore,
    useDispatch,
    useSelector,
  }
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
