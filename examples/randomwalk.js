import { renderToString } from 'react-dom/server';
import React from 'react';
import LineGraph from '../lib/LineGraph';

export function LineGraphRandomWalk() {
    const series = new Array(200).fill(0)
        .reduce(last => ([
            ...last,
            last[last.length - 1] + (-1) ** (Math.floor(Math.random() * 2))
        ]), [0])
        .map((value, index) => ([index, value]));

    const props = {
        name: 'graph-random-walk',
        width: 500,
        height: 500,
        lines: [
            {
                key: 'rwdata',
                data: series,
                color: '#000'
            }
        ]
    };

    return (
        <LineGraph {...props} />
    );
}

function render() {
    return renderToString(<LineGraphRandomWalk />);
}

if (require.main === module) {
    const output = render();

    console.log(output);
}

