import { JOB_STATUS_RUNNING, matchJobStatus } from "./job-status";
import ApolloClient from "./apollo-client";
import { ErroredJob, FinishedJob, injectErrored, injectFinished, injectRunning, Job, matchJob, RunningJob } from "./job";
import { CHECK_DOWNLOAD_PERIOD_MS } from "./constants";
import {browser} from "webextension-polyfill-ts";

/* A job manager maintains a list of jobs and periodically checks in on them with the remote service.
 * Just call addJob() to add new jobs, and checks are automatically scheduled.
 */
export class JobManager {
    private jobs: Map<string, Job>;
    private isUpdateJobsScheduled: boolean;
    private readonly checkPeriod: number;
    private readonly apolloClient: ApolloClient;

    onJobErrored: (job: ErroredJob) => Promise<void>;
    onJobFinished: (job: FinishedJob) => Promise<void>;

    constructor(apolloClient: ApolloClient, checkPeriod = CHECK_DOWNLOAD_PERIOD_MS) {
        this.apolloClient = apolloClient;
        this.jobs = new Map();
        this.isUpdateJobsScheduled = false;
        this.checkPeriod = checkPeriod;
        this.onJobErrored = noop;
        this.onJobFinished = noop;
    }

    async addJob(job: RunningJob) {
        this.jobs.set(job.tag, { status: JOB_STATUS_RUNNING, ...job });
        await storeJobs(this.jobs);
        this.scheduleUpdateJobs();
    }

    async deleteJob(tag: string) {
        this.jobs.delete(tag);
        await storeJobs(this.jobs);
    }

    /* Saves a list of jobs into webextension storage. */
    private scheduleUpdateJobs() {
        if(this.isUpdateJobsScheduled) return;
        this.isUpdateJobsScheduled = true;
        setTimeout(() => {
            this.isUpdateJobsScheduled = false;
            void this.updateJobs()
        }, this.checkPeriod);
    }

    /* Updates all jobs in the manager.
     * Returns whether there are any running jobs left.
     */
    private async updateJobs(): Promise<void> {
        // new map of jobs that results from the current map
        const jobs = new Map<string, Job>();
        let isActive = false;
        for(const [tag, job] of this.jobs) {
            const updatedJob = await this.updateJob(job);
            isActive ||= updatedJob.status === JOB_STATUS_RUNNING;
            jobs.set(tag, updatedJob);
        }
        await storeJobs(this.jobs = jobs);

        // if there is still at least one running job, schedule another check later
        if(isActive)
            this.scheduleUpdateJobs();
    }

    private updateJob = async (job: Job): Promise<Job> =>
        await matchJob<Promise<Job>>({
            onFinished: async (job) => injectFinished(job),
            onErrored: async (job) => injectErrored(job),
            onRunning: async (job) =>
                matchJobStatus<Promise<Job>>({
                    onFinished: async (status) => {
                        const finishedJob = { ...job, ...status };
                        await this.onJobFinished(finishedJob);
                        return injectFinished(finishedJob);
                    },
                    onError: async (status) => {
                        const erroredJob = { ...job, ...status };
                        await this.onJobErrored(erroredJob);
                        return injectErrored(erroredJob);
                    },
                    onRunning: async (status) => injectRunning({ ...job, ...status })
                })(await this.apolloClient.checkJob(job.queryUrl))
        })(job);
}

const noop = async <T>(_: T): Promise<void> => {};

const storeJobs = async (jobs: Map<string, Job>) => {
    await browser.storage.local.set({'jobs': jobs});
}

