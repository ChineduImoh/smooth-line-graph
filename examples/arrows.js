import { renderToString } from 'react-dom/server';
import React from 'react';
import { TimeGraph } from '../src';

export function LineGraphArrows() {
    const series = [
        [150000000, 5014],
        [150330000, 4982],
        [150470000, -400],
        [150920400, 9540],
        [151100000, -1320]
    ];

    const props = {
        name: 'graph-time',
        width: 500,
        height: 300,
        startTime: 150000000,
        padding: [20, 30, 20, 30],
        lines: [
            {
                key: 'rwdata',
                data: series,
                arrows: true,
                color: ([, valY]) => {
                    if (valY > 0) {
                        return '#009';
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
    return renderToString(<LineGraphArrows />);
}

if (require.main === module) {
    const output = render();

    console.log(output);
}

