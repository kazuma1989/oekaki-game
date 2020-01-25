import css from 'https://unpkg.com/csz'

export default function CloseButton({
  disabled,
  onClick,
  class: className = '',
}: {
  disabled?: boolean
  onClick?(): void
  class?: string
}) {
  return (
    <button
      class={`${style} ${className}`}
      type="button"
      disabled={disabled}
      onClick={onClick}
    >
      &times;
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

  line-height: 1;
  width: 16vw;
  height: 16vw;
`
