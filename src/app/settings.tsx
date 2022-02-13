import React from 'react';
import ReactDOM from 'react-dom';
import TextField from '../components/TextField';
import { useSettings } from '../hooks/settings';
import Checkbox from '../components/Checkbox';
import { asyncLens } from '../lib/misc';

const App = () => {
    const [settings, setSettings] = useSettings();
    function settingsLens<TKey extends keyof typeof settings>(key: TKey) {
        return asyncLens(key, settings, setSettings);
    }
    const [apolloBaseUrl, setApolloBaseUrl] = settingsLens('apolloBaseUrl');
    const [enqueueOnFinish, setEnqueueOnFinish] = settingsLens('enqueueOnFinish');
    const [saveOnFinish, setSaveOnFinish] = settingsLens('saveOnFinish');
    const [playlistTag, setPlaylistTag] = settingsLens('playlistTag');

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
                <div>
                    <label>
                        Automatically save the playlist on download finish
                        <span className="inline-option-set" />
                        <Checkbox
                            value={saveOnFinish}
                            setValue={setSaveOnFinish}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        <div className="settings-label">
                            Tag to add to the saved playlist
                        </div>
                        <div>
                            <TextField
                                value={playlistTag}
                                setValue={setPlaylistTag}
                            />
                        </div>
                    </label>
                </div>
            </div>
        </>
    );
};

window.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<App />, document.getElementById('app'));
});
