export type AsyncSetter<T> = (x: T | ((prev: T) => T)) => Promise<void>;
export type Setter<T> = (x: T | ((prev: T) => T)) => void;

/* Indexes and object with a key and constructs a setter for that key that rebuilds the object. */
export function asyncLens<T, TKey extends keyof T>(
    key: TKey,
    value: T,
    setter: (f: (x: T) => T) => Promise<void>,
) : [T[TKey], AsyncSetter<T[TKey]>] {
    const subValue = value[key];
    const subSetter = async (x: T[TKey] | ((p: T[TKey]) => T[TKey])): Promise<void> => {
        if('function' === typeof x) {
            const f = x as (p: T[TKey]) => T[TKey];
            return await setter((obj) => ({ ...obj, [key]: f(subValue)}));
        }
        return await setter((obj) => ({ ...obj, [key]: x }));
    };
    return [subValue, subSetter];
}
