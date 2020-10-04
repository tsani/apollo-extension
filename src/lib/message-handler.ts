import {
    DELETE_JOB, DeleteJob,
    DOWNLOAD_ERROR,
    DOWNLOAD_FINISHED, DOWNLOAD_PROGRESS, DOWNLOAD_STARTED,
    DownloadError,
    DownloadFinished,
    DownloadProgress,
    DownloadStarted,
    Message, SUBMIT_DOWNLOAD,
    SubmitDownload
} from './message';
import {browser} from 'webextension-polyfill-ts';

export type Handler<T> = (msg: T) => Promise<void>;

async function noopHandler<T>(_msg: T): Promise<void> { return; }

export class MessageHandler {
    private handleSubmitDownload: Handler<SubmitDownload>;
    private handleDownloadStarted: Handler<DownloadStarted>
    private handleDownloadProgress: Handler<DownloadProgress>;
    private handleDownloadFinished: Handler<DownloadFinished>;
    private handleDownloadError: Handler<DownloadError>;
    private handleDeleteJob: Handler<DeleteJob>;

    constructor() {
        this.handleDownloadError = noopHandler;
        this.handleDownloadFinished = noopHandler;
        this.handleDownloadStarted = noopHandler;
        this.handleSubmitDownload = noopHandler;
        this.handleDownloadProgress = noopHandler;
        this.handleDeleteJob = noopHandler;
    }

    private selfly<T>(_: T) { return this; }

    onDownloadError = (handler: Handler<DownloadError>): MessageHandler =>
        this.selfly(this.handleDownloadError = handler);
    onDownloadFinished = (handler: Handler<DownloadFinished>): MessageHandler =>
        this.selfly(this.handleDownloadFinished = handler);
    onDownloadStarted = (handler: Handler<DownloadStarted>): MessageHandler =>
        this.selfly(this.handleDownloadStarted = handler);
    onDownloadProgress = (handler: Handler<DownloadProgress>): MessageHandler =>
        this.selfly(this.handleDownloadProgress = handler);
    onSubmitDownload = (handler: Handler<SubmitDownload>): MessageHandler =>
        this.selfly(this.handleSubmitDownload = handler);
    onDeleteJob = (handler: Handler<DeleteJob>): MessageHandler =>
        this.selfly(this.handleDeleteJob = handler);

    handle(msg: Message): Promise<void> {
        switch(msg.type) {
        case DOWNLOAD_FINISHED: return this.handleDownloadFinished(msg);
        case DOWNLOAD_STARTED: return this.handleDownloadStarted(msg);
        case DOWNLOAD_ERROR: return this.handleDownloadError(msg);
        case DOWNLOAD_PROGRESS: return this.handleDownloadProgress(msg);
        case SUBMIT_DOWNLOAD: return this.handleSubmitDownload(msg);
        case DELETE_JOB: return this.handleDeleteJob(msg);
        }
        throw new Error('unreachable');
    }

    registerInBrowser(): void {
        browser.runtime.onMessage.addListener(async (msg, _sender) => {
            console.log('handling message');
            await this.handle(msg as Message);
        });
    }
}
