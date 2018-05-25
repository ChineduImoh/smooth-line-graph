import { renderToString } from 'react-dom/server';
import React from 'react';
import { LineGraph } from '../src';

export function LineGraphMulti() {
    const series1 = [
        [0, 0],
        [0.1, 0.4],
        [1, -5],
        [1.2, -6],
        [1.3, -3.7],
        [2.9, 9],
        [4, 9.1],
        [7.3, 8.7],
        [8, 6.5],
        [9, 5],
        [4, 3]
    ];

    const series2 = [
        [-3, 4.2],
        [-2, 7],
        [0, 4.1],
        [1, 9],
        [0.5, 2],
        [0.6, -1],
        [8, 9],
        [7.3, 5]
    ];

    const props = {
        name: 'graph-multi',
        width: 500,
        height: 500,
        padding: [40, 40, 100, 40],
        lines: [
            {
                key: 'series1',
                data: series1,
                color: '#03c',
                smooth: false
            },
            {
                key: 'series2',
                data: series2,
                color: '#c03',
                smooth: true
            }
        ]
    };

    return (
        <LineGraph {...props} />
    );
}

function render() {
    return renderToString(<LineGraphMulti />);
}

if (require.main === module) {
    const output = render();

    process.stdout.write(output);
}

