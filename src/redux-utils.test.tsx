import {
  store,
  Provider,
  useDispatch,
  useStore,
  useSelector,
} from './reducer.js'

function TypingsTest() {
  const dispatch = useDispatch()
  dispatch({
    type: 'closeResult',
  })

  const _store = useStore()
  _store.getState().loading

  const state = useSelector(state => state.correctCount)

  return (
    <Provider value={store}>
      <div></div>
    </Provider>
  )
}
