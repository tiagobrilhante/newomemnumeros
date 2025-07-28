export function debounce<A extends unknown[], U = unknown>(
  fn: (this: U, ...args: A) => void,
  delay: number,
): (this: U, ...args: A) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return function(this: U, ...args: A): void {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}
