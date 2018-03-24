import { renderToString } from 'react-dom/server';
import React from 'react';
import LineGraph from '../lib/LineGraph';
import randomNumbers from './randomNumbers.json';

const testableRandom = () => {
    if (process.env.NODE_ENV === 'test') {
        let index = 543;

        return () => randomNumbers[(index++) % randomNumbers.length];
    }

    return () => 2 * Math.random() - 0.99;
};

export function LineGraphRandomWalk() {
    const limit = 100;
    const random = testableRandom(limit);

    const series = new Array(limit).fill(0)
        .reduce(last => ([
            ...last,
            last[last.length - 1] + random()
        ]), [0])
        .map((value, index) => ([index, value]));

    const props = {
        name: 'graph-random-walk',
        width: 500,
        height: 400,
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

