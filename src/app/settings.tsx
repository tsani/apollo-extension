import React from 'react';
import ReactDOM from 'react-dom';
import { AsyncSetter } from "../lib/misc";
import { TextField } from "../components/TextField";
import { useSettings } from "../hooks/settings";

function asyncLens<T, TKey extends keyof T>(
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
    }
    return [subValue, subSetter];
}

const App = () => {
    const [ settings, setSettings ] = useSettings();
    const [ apolloBaseUrl, setApolloBaseUrl ] = asyncLens('apolloBaseUrl', settings, setSettings);

    console.log('settings page!');
    return (
        <>
            <h1>Settings</h1>
            <div id="settings-content">
                <label>
                    Apollo base URL
                    <TextField value={apolloBaseUrl} setValue={setApolloBaseUrl} />
                </label>
            </div>
        </>
    );
};

window.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<App/>, document.getElementById('app'));
})