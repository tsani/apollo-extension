import { useStorage } from "./storage";
import {DEFAULT_SETTINGS, Settings, SETTINGS_KEY, SETTINGS_STORAGE} from "../lib/settings";
import {AsyncSetter} from "../lib/misc";

export const useSettings = (): [Settings, AsyncSetter<Settings>] => {
    return useStorage(SETTINGS_STORAGE, SETTINGS_KEY, DEFAULT_SETTINGS)
}