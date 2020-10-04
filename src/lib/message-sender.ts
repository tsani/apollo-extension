import { browser } from 'webextension-polyfill-ts';
import {
    DELETE_JOB,
    DeleteJob,
    DOWNLOAD_ERROR,
    DOWNLOAD_FINISHED,
    DOWNLOAD_PROGRESS,
    DOWNLOAD_STARTED,
    DownloadError,
    DownloadFinished,
    DownloadProgress,
    DownloadStarted,
    SUBMIT_DOWNLOAD,
    SubmitDownload
} from './message';

const sender = <T>(type: string) => async (msg: T) => browser.runtime.sendMessage(undefined, {type, ...msg});

type Sender<T> = (msg: T) => Promise<void>;

export const submitDownload: Sender<SubmitDownload> = sender(SUBMIT_DOWNLOAD);
export const downloadFinished: Sender<DownloadFinished> = sender(DOWNLOAD_FINISHED);
export const downloadProgress: Sender<DownloadProgress> = sender(DOWNLOAD_PROGRESS);
export const downloadError: Sender<DownloadError> = sender(DOWNLOAD_ERROR);
export const downloadStarted: Sender<DownloadStarted> = sender(DOWNLOAD_STARTED);
export const deleteJob: Sender<DeleteJob> = sender(DELETE_JOB);