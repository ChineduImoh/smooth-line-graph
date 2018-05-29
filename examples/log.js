import { renderToString } from 'react-dom/server';
import React from 'react';
import LineGraph from '../src';

export function LineGraphLog() {
    const series = [
        [0, 0.0001],
        [1, 0.0002],
        [2, 0.0003],
        [3, 0.0056],
        [4, 1938129],
        [5, 867],
        [6, 19],
        [7, 19.35],
        [8, 983144],
        [9, 11302],
        [10, 7.6]
    ];

    const props = {
        name: 'graph-log',
        width: 500,
        height: 300,
        log: true,
        lines: [
            {
                key: 'logdata',
                data: series,
                smooth: true,
                color: '#222'
            }
        ]
    };

    return (
        <LineGraph {...props} />
    );
}

function render() {
    return renderToString(<LineGraphLog />);
}

if (require.main === module) {
    const output = render();

    process.stdout.write(output);
}


