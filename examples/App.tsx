import React from 'react';
import Simple from './Simple';
import WithHeightProp from './WithHeightProp';

export const App = () => (
    <div>
        <h1>Scrollfade Examples</h1>

        <h1>Simple</h1>
        <Simple />

        <h1>With height prop</h1>
        <WithHeightProp />
    </div>
);
