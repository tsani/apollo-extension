import { JobStatus } from './job-status';
import { DEFAULT_APOLLO_BASE_URL } from "./constants";

export const API_VERSION = 'v1';
export const ADD_TRACKS_ROUTE = '/tracks/add/youtube-dl/async';

export interface AddTrack {
    jobId: number;
    query: string;
}

export default class ApolloClient {
    baseUrl: string;

    constructor(baseUrl = DEFAULT_APOLLO_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    async addTrack(urlToDownload: string, path: string): Promise<AddTrack> {
        const request: { url: string; path: string } = {
            url: urlToDownload,
            path: path,
        };
        const response = await this.postJSON(ADD_TRACKS_ROUTE, request);
        return await response.json() as AddTrack;
    }

    async checkJob(queryUrl: string): Promise<JobStatus> {
        const response = await fetch(queryUrl);
        return await response.json();
    }

    private postJSON = async (route: string, body: object) =>
        fetch(this.apolloUrl(route), {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        });

    private apolloUrl = (route: string) => {
        const sep = '/' === route.charAt(route.length - 1) ? '' : '/';
        return `${this.baseUrl}${sep}${API_VERSION}${route}`;
    }
}

