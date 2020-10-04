// Logic for the popup that appears when clicked in the navbar

import { browser } from 'webextension-polyfill-ts';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Job, matchJob } from '../lib/job';
import { FinishedJob, RunningJob, ErroredJob } from '../lib/job';
import itiriri from 'itiriri';
import { deleteJob } from '../lib/message-sender';

const FinishedJob = ({ job }: { job: FinishedJob }) => {
    const handleClick = async () => {
        await deleteJob({ tag: job.tag });
    };
    return (
        <div className="job job-finished">
            <i onClick={handleClick} className="gg-close-o close" />
            <a className="job-url" href={job.tag}>
                {job.tag}
            </a>
            <p className="status">finished</p>
        </div>
    );
};

const RunningJob = ({ job }: { job: RunningJob }) => {
    return (
        <div className="job job-running">
            <a className="job-url" href={job.tag}>
                {job.tag}
            </a>
            <div className="job-number">job #{job.id}</div>
            <p className="status">running</p>
        </div>
    );
};

const ErroredJob = ({ job }: { job: ErroredJob }) => {
    return (
        <div className="job job-errored">
            <a className="job-url" href={job.tag}>
                {job.tag}
            </a>
            <p className="status">errored</p>
        </div>
    );
};

const Job = ({ job }: { job: Job }) => (
    <>
        {matchJob({
            /* eslint-disable-next-line react/display-name */
            onFinished: (job) => <FinishedJob job={job} />,
            /* eslint-disable-next-line react/display-name */
            onRunning: (job) => <RunningJob job={job} />,
            /* eslint-disable-next-line react/display-name */
            onErrored: (job) => <ErroredJob job={job} />,
        })(job)}
        <hr />
    </>
);

const App = () => {
    const [jobs, setJobs] = useState<Map<string, Job>>(new Map());

    const handleClick = async () => {
        console.log('button clicked!');
        try {
            return void (await browser.tabs.executeScript(undefined, {
                file: '/dist/content.js',
            }));
        } catch (e) {
            console.error('failed to execute download', e);
        }
        return;
    };

    const updateJobs = async () => {
        const { jobs } = await browser.storage.local.get('jobs');
        console.log('got jobs', jobs);
        setJobs(jobs || new Map());
    };

    useEffect(() => {
        void updateJobs();
        browser.storage.onChanged.addListener(updateJobs);
        return () => {
            browser.storage.onChanged.removeListener(updateJobs);
        };
    }, []);

    return (
        <div id="popup-content">
            {jobs.size > 0 &&
                Array.from(
                    itiriri(jobs.values()).map((job) => (
                        <Job key={`${job.id}-${job.tag}`} job={job} />
                    )),
                )}
            <div className="centering">
                <button
                    className="download"
                    onClick={() => handleClick()}
                >
                    Download
                </button>
            </div>
        </div>
    );
};

window.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<App />, document.getElementById('app'));
});
