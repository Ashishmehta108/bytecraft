// utils/debounce.ts
export function debouncePerItem<T extends (arg: any) => void>(
  func: T,
  delay: number
) {
  const timers = new Map<string, ReturnType<typeof setTimeout>>();

  return (arg: { id: string; quantity: number }) => {
    const key = arg.id;

    if (timers.has(key)) {
      clearTimeout(timers.get(key)!);
    }

    timers.set(
      key,
      setTimeout(() => {
        func(arg);
        timers.delete(key);
      }, delay)
    );
  };
}
