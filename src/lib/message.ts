// All message types that can be sent around

export type SUBMIT_DOWNLOAD = 'submit-download';
export const SUBMIT_DOWNLOAD = 'submit-download';
export interface SubmitDownload {
    tag: string;
    url: string;
    path: string;
}
export interface SubmitDownloadCase extends SubmitDownload {
    type: SUBMIT_DOWNLOAD
}

export type DOWNLOAD_STARTED = 'download-started';
export const DOWNLOAD_STARTED = 'download-started';
export interface DownloadStarted {
    tag: string;
    id: number;
}
export interface DownloadStartedCase extends DownloadStarted {
    type: DOWNLOAD_STARTED;
}

export type DOWNLOAD_PROGRESS = 'download-progress';
export const DOWNLOAD_PROGRESS = 'download-progress';
export interface DownloadProgress {
    tag: string;
    id: number;
    progress: {
        done: number;
        outOf: number;
    };
}
export interface DownloadProgressCase extends DownloadProgress {
    type: DOWNLOAD_PROGRESS;
}

export type DOWNLOAD_FINISHED = 'download-finished';
export const DOWNLOAD_FINISHED = 'download-finished';
export interface DownloadFinished {
    tag: string;
    id: number;
}
export interface DownloadFinishedCase extends DownloadFinished {
    type: DOWNLOAD_FINISHED;
}

export type DOWNLOAD_ERROR = 'download-error';
export const DOWNLOAD_ERROR = 'download-error';
export interface DownloadError {
    tag: string;
    message: string;
}
export interface DownloadErrorCase extends DownloadError {
    type: DOWNLOAD_ERROR;
}

export type DELETE_JOB = 'delete-job';
export const DELETE_JOB = 'delete-job';
export interface DeleteJob {
    tag: string;
}
export interface DeleteJobCase extends DeleteJob {
    type: DELETE_JOB;
}

export type Message =
    | SubmitDownloadCase
    | DownloadStartedCase
    | DownloadProgressCase
    | DownloadFinishedCase
    | DownloadErrorCase
    | DeleteJobCase;

