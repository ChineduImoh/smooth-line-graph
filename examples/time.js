import { renderToString } from 'react-dom/server';
import React from 'react';
import TimeGraph from '../lib/TimeGraph';

export function LineGraphTime() {
    const series = [
        [150000000, 5014],
        [151000000, 4982],
        [152500000, 6391],
        [154000000, 9540],
        [155300000, 9893]
    ];

    const props = {
        name: 'graph-time',
        width: 500,
        height: 300,
        startTime: 150000000,
        padding: [20, 0, 20, 0],
        lines: [
            {
                key: 'rwdata',
                data: series,
                smooth: true,
                color: ([valX]) => {
                    if (valX < 153000000) {
                        return '#000';
                    }

                    return '#900';
                }
            }
        ]
    };

    return (
        <TimeGraph {...props} />
    );
}

function render() {
    return renderToString(<LineGraphTime />);
}

if (require.main === module) {
    const output = render();

    console.log(output);
}

