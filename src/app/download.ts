import {submitDownload} from "../lib/message-sender";

declare global {
    interface Window {
        hasRun: boolean;
    }
}

(async () => {
    return void await submitDownload({
        url: window.location.toString(),
        tag: window.location.toString(),
        path: window.location.hostname,
    });
})();
