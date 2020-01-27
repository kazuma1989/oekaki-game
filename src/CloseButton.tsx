import css from 'https://unpkg.com/csz'

export default function CloseButton({
  floating,
  disabled,
  onClick,
  class: className = '',
}: {
  floating?: boolean
  disabled?: boolean
  onClick?(): void
  class?: string
}) {
  return (
    <button
      class={`${style} ${floating ? styleFloating : ''} ${className}`}
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

const styleFloating = css`
  position: fixed;
  top: 2vw;
  right: 2vw;
  z-index: 10;
`
