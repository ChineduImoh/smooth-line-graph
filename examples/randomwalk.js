import { renderToString } from 'react-dom/server';
import React from 'react';
import { LineGraph } from '../src';
import randomNumbers from './randomNumbers.json';

const testableRandom = (bias = 0) => {
    if (process.env.NODE_ENV === 'test') {
        let index = 543;

        return () => randomNumbers[(index++) % randomNumbers.length];
    }

    return () => 2 * Math.random() - 1 + bias;
};

export function LineGraphRandomWalk() {
    const limit = 101;
    const bias = -0.01;

    const random = testableRandom(bias);

    const series = new Array(limit);
    let index = 0;
    let value = 0;
    while (index < limit) {
        series[index] = [index, value];

        value += random();

        index++;
    }

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

    process.stdout.write(output);
}

