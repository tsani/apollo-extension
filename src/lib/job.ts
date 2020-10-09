import {JOB_STATUS_ERROR, JOB_STATUS_FINISHED, JOB_STATUS_RUNNING} from './job-status';

export type Job = RunningJobCase | FinishedJobCase | ErroredJobCase;

export interface RunningJob extends BasicJob {
    progress: {
        done: number;
        outOf: number;
    };
    queryUrl: string;
}
export interface RunningJobCase extends RunningJob {
    status: JOB_STATUS_RUNNING;
}
export const injectRunning = (job: RunningJob): RunningJobCase => ({ status: JOB_STATUS_RUNNING, ...job });

export interface FinishedJob extends BasicJob {
    result: string[];
}
export interface FinishedJobCase extends FinishedJob {
    status: JOB_STATUS_FINISHED;
}
export const injectFinished = (job: FinishedJob): FinishedJobCase => ({ status: JOB_STATUS_FINISHED, ...job });

export interface ErroredJob extends BasicJob {
    error: {
        type: string;
        message: string;
    };
}
export interface ErroredJobCase extends ErroredJob {
    status: JOB_STATUS_ERROR;
}
export const injectErrored = (job: ErroredJob): ErroredJobCase => ({ status: JOB_STATUS_ERROR, ...job });

interface BasicJob {
    id: number;
    tag: string;
}

export interface JobMatcher<T> {
    onRunning: (job: RunningJob) => T;
    onFinished: (job: FinishedJob) => T;
    onErrored: (job: ErroredJob) => T;
}

export const matchJob = <T>(matcher: JobMatcher<T>) => (job: Job): T => {
    switch (job.status) {
    case JOB_STATUS_RUNNING: return matcher.onRunning(job);
    case JOB_STATUS_ERROR: return matcher.onErrored(job);
    case JOB_STATUS_FINISHED: return matcher.onFinished(job);
    }
    throw new Error('unreachable');
};

