import React, { ReactElement } from 'react';
import { Setter } from '../lib/misc';

export const TextField = ({
    value,
    setValue,
    ...props
}: {
    value: string;
    setValue: Setter<string>;
}): ReactElement => {
    const handleChange = (e: React.FormEvent<HTMLInputElement>) =>
        setValue(e?.currentTarget?.value);
    return (
        <input
            type="text"
            value={value}
            onChange={handleChange}
            {...props}
        />
    );
};
