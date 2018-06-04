import { MIN_LOG_VALUE } from '../constants';

function getRoundTickSize(minimum, magnitude) {
    const res = minimum / magnitude;

    if (res > 5) {
        return 10 * magnitude;
    }

    if (res > 2) {
        return 5 * magnitude;
    }

    if (res > 1) {
        return 2 * magnitude;
    }

    return magnitude;
}

function getRoundTick({ numTicks, min, max }) {
    const minimum = (max - min) / numTicks;
    const magnitude = 10 ** Math.floor(Math.log10(minimum));

    const tickSize = getRoundTickSize(minimum, magnitude);

    const start = Math.ceil(min / tickSize) * tickSize;

    return {
        start,
        tickSize,
        numTicks: Math.ceil((max - min) / tickSize)
    };
}

function getTicks(numTicksInitial, min, max, pix) {
    const { start, tickSize, numTicks } = getRoundTick({ numTicks: numTicksInitial, min, max });

    if (!numTicks) {
        return [];
    }

    return new Array(numTicks)
        .fill(0)
        .map((item, key) => {
            const value = start + key * tickSize;
            const pos = Math.floor(pix(value)) + 0.5;

            return { value, pos, major: 2 };
        });
}

export function calculateTicksY({ numTicksY = 10, log, minY, maxY, pixY, height, padding }) {
    // calculate tick range
    if (log) {
        const pixPos = value => Math.floor(pixY(value)) + 0.5;

        const startExp = Math.floor(Math.log10(Math.max(MIN_LOG_VALUE, minY)));
        const endExp = Math.ceil(Math.log10(Math.max(1, maxY)));

        if (startExp > endExp) {
            return [];
        }

        const y0 = height - padding[2];
        const y1 = padding[0];

        return new Array(endExp + 1 - startExp).fill(0)
            .reduce((items, item, index) => {
                const value = 10 ** (startExp + index);
                const value2 = 2 * value;
                const value5 = 5 * value;

                return items.concat([
                    { value, pos: pixPos(value), major: 2 },
                    { value: value2, pos: pixPos(value2), major: 0 },
                    { value: value5, pos: pixPos(value5), major: 0 }
                ]
                    .filter(({ pos }) => pos >= y1 && pos <= y0));

            }, []);
    }

    return getTicks(numTicksY, minY, maxY, pixY);
}

export function calculateTicksX({ numTicksX = 10, minX, maxX, pixX }) {
    return getTicks(numTicksX, minX, maxX, pixX);
}

