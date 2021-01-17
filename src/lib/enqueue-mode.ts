export type EnqueueMode = {
    type: 'end' | 'start' | 'playing';
    distance: number;
};

export const ENQUEUE_AT_START: EnqueueMode = {
    type: 'start',
    distance: -1,
};

export const ENQUEUE_AT_END: EnqueueMode = {
    type: 'end',
    distance: 1,
};

export const ENQUEUE_NEXT: EnqueueMode = {
    type: 'playing',
    distance: 1,
};

/**
 * Converts and enqueue mode into a value acceptable by Apollo as a
 * 'position' string parameter.
 * @param type
 * @param distance
 */
export const formatEnqueueMode = ({ type, distance }: EnqueueMode): string =>
    `${type}_${distance}`;

const ENQUEUE_MODES: Array<{ label: string; mode: EnqueueMode }> = [
    { label: 'at playlist start', mode: ENQUEUE_AT_START },
    { label: 'at playlist end', mode: ENQUEUE_AT_END },
    { label: 'as next song', mode: ENQUEUE_NEXT },
];

export default ENQUEUE_MODES;
