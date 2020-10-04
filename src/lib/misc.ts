export type AsyncSetter<T> = (x: T | ((prev: T) => T)) => Promise<void>;
export type Setter<T> = (x: T | ((prev: T) => T)) => void;