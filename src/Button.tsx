import css from '/web_modules/csz.js'

type Theme = 'default' | 'primary' | 'danger'

export default function Button({
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
    <button
      className={`${style} ${themes[theme]} ${className}`}
      type="button"
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

const style = css`
  border-radius: 2vw;
  padding: 2vw 5vw;
  background-color: var(--gray50);

  user-select: none;

  &:disabled {
    filter: opacity(0.5);
  }
`

const themes: Record<Theme, string> = {
  default: '',
  primary: css`
    background-color: var(--cyanBlue10);
    color: var(--white);
  `,
  danger: css`
    background-color: var(--red10);
    color: var(--white);
  `,
}
