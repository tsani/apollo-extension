import { useEffect, useState } from 'react';
import { browser, Storage } from 'webextension-polyfill-ts';
import StorageArea = Storage.StorageArea;
import { AsyncSetter } from '../lib/misc';

export function useStorage<T>(storage: StorageArea, key: string, initialValue: T): [T, AsyncSetter<T>] {
    const loadValue = async (): Promise<T> => {
        const result = await storage.get(key);
        return result[key];
    };
    const putValue = async (x: T): Promise<T> => {
        await storage.set({ [key]: x });
        return x;
    };

    const [value, setter] = useState(initialValue);
    const updateValue = async () => {
        setter(await loadValue() ?? initialValue);
    };
    useEffect(() => {
        void async function() {
            await updateValue();
            browser.storage.onChanged.addListener(updateValue);
        } ();
        return () => {
            browser.storage.onChanged.removeListener(updateValue);
        };
    }, []);

    const put = async (x: T | ((prev: T) => T)): Promise<void> => {
        if('function' === typeof x) {
            return setter(await putValue((x as (p: T) => T)(value)));
        }
    };

    return [value, put];
}

