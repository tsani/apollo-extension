// Entrypoint for the background task

import { MessageHandler } from '../lib/message-handler';
import {
    DeleteJob,
    DownloadError,
    DownloadFinished,
    DownloadStarted,
    SubmitDownload,
} from '../lib/message';
import ApolloClient from '../lib/apollo-client';
import { JobManager } from '../lib/job-manager';
import { injectRunning } from '../lib/job';
import { browser } from 'webextension-polyfill-ts';
import { DEFAULT_SETTINGS, getSettings, Settings } from '../lib/settings';

const notifyError = async (downloadError: DownloadError) => {
    console.info('notifier: error');
    await browser.notifications.create({
        type: 'basic',
        title: 'Apollo Download Error',
        message: `Downloading ${downloadError.tag} failed: ${downloadError.message}`,
    });
};

interface NotifyFinished extends DownloadFinished {
    playlistName?: string
}

const notifyFinished = async (msg: NotifyFinished) => {
    console.info('notifier: finished');
    const lines = [`Finished downloading: ${msg.tag}`];
    if (msg.playlistName) {
        lines.push(`Saved playlist: ${msg.playlistName}`);
    }
    await browser.notifications.create({
        type: 'basic',
        title: 'Apollo Download Finished',
        message: lines.join('\n'),
    });
};

const notifyStarted = async (downloadStarted: DownloadStarted) => {
    console.info('notifier: started');
    await browser.notifications.create({
        type: 'basic',
        title: 'Apollo Download Started',
        message: `Started downloading: ${downloadStarted.tag}`,
    });
};

class Background {
    private readonly jobManager: JobManager;
    private readonly apolloClient: ApolloClient;
    private readonly messageHandler: MessageHandler;
    private settings: Settings;

    constructor() {
        this.settings = DEFAULT_SETTINGS;
        this.apolloClient = new ApolloClient(this.settings.apolloBaseUrl);
        this.jobManager = new JobManager(this.apolloClient);
        this.messageHandler = new MessageHandler()
            .onSubmitDownload((x) => this.handleSubmitDownload(x))
            .onDeleteJob((x) => this.handleDeleteJob(x));
    }

    async install() {
        this.jobManager.onJobFinished = async (job) => {
            if (this.settings.enqueueOnFinish)
                await this.apolloClient.enqueueTrack(job.result);

            let playlistName: undefined | string = undefined;
            if (this.settings.saveOnFinish) {
                playlistName = await this.apolloClient.savePlaylist(this.settings.playlistTag);
            }

            await notifyFinished({ tag: job.tag, id: job.id, playlistName });
        };

        this.jobManager.onJobErrored = async (job) => {
            await notifyError({ tag: job.tag, message: job.error.message });
        };

        this.messageHandler.registerInBrowser();
        browser.storage.onChanged.addListener(() =>
            this.handleSettingsChanged(),
        );
        // Call this once to load the settings from local storage,
        // without needing the user to produce a dummy change.
        await this.handleSettingsChanged();
    }

    handleSettingsChanged = async (): Promise<void> => {
        this.settings = (await getSettings()) ?? DEFAULT_SETTINGS;
        this.apolloClient.baseUrl = this.settings.apolloBaseUrl;
    };

    handleSubmitDownload = async (msg: SubmitDownload): Promise<void> => {
        try {
            const track = await this.apolloClient.addTrack(msg.url, msg.path);

            await this.jobManager.addJob(
                injectRunning({
                    progress: makeInitialProgress(),
                    queryUrl: track.query,
                    id: track.jobId,
                    tag: msg.tag,
                }),
            );

            console.info('sending downloadStarted');
            await notifyStarted({
                tag: msg.tag,
                id: track.jobId,
            });
        } catch (e) {
            console.error(`handleSubmitDownload: ${e}`);
            await notifyError({ tag: msg.tag, message: e.toString() });
            return;
        }
    };

    handleDeleteJob = async ({ tag }: DeleteJob) => {
        await this.jobManager.deleteJob(tag);
    };
}

const makeInitialProgress = () => ({
    done: 0,
    outOf: 1,
});

window.addEventListener('DOMContentLoaded', () => {
    void (async function () {
        await new Background().install();
    })();
});
