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
  ...expressions: (TemplateStringsArray | string | boolean | null | undefined)[]
): string
