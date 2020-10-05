import React from 'react';
import ReactDOM from 'react-dom';
import TextField from '../components/TextField';
import { useSettings } from '../hooks/settings';
import Checkbox from '../components/Checkbox';
import { asyncLens } from '../lib/misc';

const App = () => {
    const [settings, setSettings] = useSettings();
    const [apolloBaseUrl, setApolloBaseUrl] = asyncLens(
        'apolloBaseUrl',
        settings,
        setSettings,
    );
    const [enqueueOnFinish, setEnqueueOnFinish] = asyncLens(
        'enqueueOnFinish',
        settings,
        setSettings,
    );

    console.log('settings page!');
    return (
        <>
            <h1>Settings</h1>
            <div id="settings-content">
                <div>
                    <label>
                        <div className="settings-label">
                            Apollo base URL
                        </div>
                        <div>
                            <TextField
                                value={apolloBaseUrl}
                                setValue={setApolloBaseUrl}
                            />
                        </div>
                    </label>
                </div>
                <div>
                    <label>
                        Automatically enqueue finished downloads
                        <span className="inline-option-sep" />
                        <Checkbox
                            value={enqueueOnFinish}
                            setValue={setEnqueueOnFinish}
                        />
                    </label>
                </div>
            </div>
        </>
    );
};

window.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<App />, document.getElementById('app'));
});
