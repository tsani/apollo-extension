import {browser, Storage} from 'webextension-polyfill-ts';
import StorageArea = Storage.StorageArea;
import { DEFAULT_APOLLO_BASE_URL } from './constants';

export const SETTINGS_KEY = 'settings';
export const SETTINGS_STORAGE: StorageArea = browser.storage.local;

export interface Settings {
    apolloBaseUrl: string;
    enqueueOnFinish: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
    apolloBaseUrl: DEFAULT_APOLLO_BASE_URL,
    enqueueOnFinish: true,
};

export const getSettings = async (): Promise<Settings | undefined> => {
    const { [SETTINGS_KEY]: settings } = await SETTINGS_STORAGE.get(SETTINGS_KEY);
    return settings;
};

export const putSettings = async (settings: Settings): Promise<void> => {
    await SETTINGS_STORAGE.set({ settings });
};
