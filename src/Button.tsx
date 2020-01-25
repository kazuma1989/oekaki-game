import css from 'https://unpkg.com/csz'

export default function Button({
  theme,
  label,
  disabled,
  onClick,
  class: className = '',
}: {
  theme?: 'default' | 'primary' | 'danger'
  label?: string
  disabled?: boolean
  onClick?(): void
  class?: string
}) {
  return (
    <button
      class={`${style} ${theme} ${className}`}
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

  &.primary {
    background-color: var(--cyanBlue10);
    color: var(--white);
  }

  &.danger {
    background-color: var(--red10);
    color: var(--white);
  }
`
