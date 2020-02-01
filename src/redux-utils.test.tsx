import { Provider, useDispatch, useStore, useSelector } from './reducer.js'

function TypingsTest() {
  const dispatch = useDispatch()
  dispatch({
    type: 'closeResult',
  })

  const store = useStore()
  store.getState().loadingState === 'complete'

  const state = useSelector(state => state.loadingState)
  state === 'initial'

  return (
    <Provider value={store}>
      <div></div>
    </Provider>
  )
}
