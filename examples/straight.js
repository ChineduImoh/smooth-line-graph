import { renderToString } from 'react-dom/server';
import React from 'react';
import LineGraph from '../lib/LineGraph';

export function LineGraphStraight() {
    const series = [
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

    const props = {
        name: 'graph-straight',
        width: 500,
        height: 500,
        padding: [40, 40, 100, 40],
        lines: [
            {
                key: 'series1',
                data: series,
                color: '#c30',
                smooth: false
            }
        ]
    };

    return (
        <LineGraph {...props} />
    );
}

function render() {
    return renderToString(<LineGraphStraight />);
}

if (require.main === module) {
    const output = render();

    console.log(output);
}

