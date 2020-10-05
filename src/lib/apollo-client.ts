import { JobStatus } from './job-status';
import { DEFAULT_APOLLO_BASE_URL } from './constants';

export const API_VERSION = 'v1';
export const ADD_TRACKS_ROUTE = '/tracks/add/youtube-dl/async';
export const PLAYLIST_ROUTE = '/playlist'

export interface AddTrack {
    jobId: number;
    query: string;
}

export default class ApolloClient {
    baseUrl: string;

    constructor(baseUrl = DEFAULT_APOLLO_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    async addTrack(
        urlToDownload: string,
        path: string,
    ): Promise<AddTrack> {
        const request: { url: string; path: string } = {
            url: urlToDownload,
            path: path,
        };
        const response = await this.sendJSON(
            ADD_TRACKS_ROUTE,
            request,
        );
        return await response.json();
    }

    /* Checks the status for a job. Pass in the `queryUrl` obtained from adding the track. */
    async checkJob(queryUrl: string): Promise<JobStatus> {
        const response = await fetch(queryUrl);
        return await response.json();
    }

    /* Enqueues tracks at the end of the current playlist.
       Pass in an array of track paths (a track path is the result of a download job finishing).
       Returns the playlist positions of the added tracks, in the same order that the track paths were specified.
     */
    async enqueueTrack(trackPaths: string[]): Promise<number[]> {
        const response = await this.sendJSON(
            `${PLAYLIST_ROUTE}?end_1`,
            trackPaths,
            'PUT',
        );
        if(!response.ok)
            throw new Error(`failed to enqueue track(s) ${trackPaths.join(', ')}`);
        return await response.json();
    }

    private sendJSON = async (route: string, body: unknown, method = 'POST') =>
        fetch(this.apolloUrl(route), {
            method,
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        });

    private apolloUrl = (route: string) => {
        const sep = '/' === route.charAt(route.length - 1) ? '' : '/';
        return `${this.baseUrl}${sep}${API_VERSION}${route}`;
    };
}
