import css from '/app/web_modules/csz.js'
import { useEffect } from '/app/web_modules/preact/hooks.js'
import { useDispatch, useStore } from './reducer.js'

export default function Timer({ className }: { className?: string }) {
  return <div className={className}>5:00</div>
}
