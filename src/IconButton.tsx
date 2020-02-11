import css from '/app/web_modules/csz.js'
import Button, { Theme } from './Button.js'

export default function IconButton({
  theme = 'default',
  label,
  disabled,
  onClick,
  className = '',
}: {
  theme?: Theme
  label?: string
  disabled?: boolean
  onClick?(): void
  className?: string
}) {
  return (
    <Button
      className={`${style} ${className}`}
      theme={theme}
      label={label}
      disabled={disabled}
      onClick={onClick}
    />
  )
}

const style = css`
  line-height: 1;
  width: 1.5em;
  height: 1.5em;
  padding: 0;
`
