import css from 'https://unpkg.com/csz'

export default function Button({
  label,
  disabled,
  onClick,
  class: className = '',
}: {
  label?: string
  disabled?: boolean
  onClick?(): void
  class?: string
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      class={`${button} ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

const button = css`
  border-radius: 2vw;
  padding: 2vw 5vw;

  background-color: var(--gray50);

  user-select: none;
`
