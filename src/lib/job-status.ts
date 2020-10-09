export type JOB_STATUS_RUNNING = 'running';
export const JOB_STATUS_RUNNING = 'running';
export interface JobRunning {
    progress: {
        done: number;
        outOf: number;
    },
}
export interface JobRunningCase extends JobRunning {
    status: JOB_STATUS_RUNNING;
}

export type JOB_STATUS_ERROR = 'failed';
export const JOB_STATUS_ERROR = 'failed';
export interface JobError {
    error: {
        type: string;
        message: string;
    };
}
export interface JobErrorCase extends JobError {
    status: JOB_STATUS_ERROR;
}

export type JOB_STATUS_FINISHED = 'complete';
export const JOB_STATUS_FINISHED = 'complete';
export interface JobFinished {
    result: string[];
}
export interface JobFinishedCase extends JobFinished{
    status: JOB_STATUS_FINISHED;
}

export type JOB_STATUS = JOB_STATUS_RUNNING | JOB_STATUS_ERROR | JOB_STATUS_FINISHED;
export type JobStatus = JobRunningCase | JobErrorCase | JobFinishedCase;

interface JobStatusMatcher<T> {
    onFinished: (status: JobFinished) => T;
    onRunning: (status: JobRunning) => T;
    onError: (status: JobError) => T;
}

export const matchJobStatus = <T>(matcher: JobStatusMatcher<T>) => (status: JobStatus): T => {
    switch(status.status) {
    case JOB_STATUS_ERROR: return matcher.onError(status);
    case JOB_STATUS_FINISHED: return matcher.onFinished(status);
    case JOB_STATUS_RUNNING: return matcher.onRunning(status);
    }
    throw new Error('unreachable');
};