import React, { ReactElement } from 'react';
import { Setter } from '../lib/misc';

const Checkbox = ({
    value,
    setValue,
    ...props
}: {
    value: boolean;
    setValue: Setter<boolean>;
}): ReactElement => (
    <input
        type="checkbox"
        checked={value}
        onChange={(e) => setValue(e.currentTarget.checked)}
        {...props}
    />
);

export default Checkbox;
