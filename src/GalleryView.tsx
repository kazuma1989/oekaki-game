import css from '/app/web_modules/csz.js'
import { useSelector, useDispatch } from './reducer.js'
import Button from './Button.js'
import IconButton from './IconButton.js'

export default function GalleryView() {
  const dispatch = useDispatch()
  const close = () => dispatch({ type: 'closeGallery' })

  const gallery = useSelector(state => state.gallery)

  return (
    <div className={style}>
      <IconButton className={styleFloating} label="&times;" onClick={close} />

      {gallery.map(({ title, status, dataURL }) => (
        <div key={title}>
          {title}
          <span className={styleLabel}>
            (
            {
              {
                correct: '正解',
                passed: 'パス',
              }[status]
            }
            )
          </span>

          <img className={styleImage} alt={title} src={dataURL} />
        </div>
      ))}
    </div>
  )
}

const style = css`
  width: 100%;
  height: 100%;

  overflow: scroll;
`

const styleFloating = css`
  position: fixed;
  top: 2vw;
  right: 2vw;
  z-index: 10;
`

const styleLabel = css`
  font-size: 6vmin;
`

const styleImage = css`
  display: block;
  margin-bottom: 3%;
`
