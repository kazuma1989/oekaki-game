/**
 * @example
 * <div className={css('/style.css')} />
 */
export default function css(path: string): string

/**
 * @example
 * <p
 *   class={css`
 *     color: red;
 *     font-size: large;
 *   `}
 * >
 *   Red large text
 * </p>
 */
export default function css(
  templates: TemplateStringsArray,
  ...values: (string | number | boolean | null | undefined)[]
): string
