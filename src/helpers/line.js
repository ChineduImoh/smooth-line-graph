import { getControlPoints } from './smoothing';

export function getLinePath({ data, smooth, fill, pixX, pixY, maxX, minY }) {
    const getPixPoint = ([valX, valY]) => ([pixX(valX), pixY(valY)]);

    const pixelsNumeric = data.map(point => getPixPoint(point));
    const pixels = pixelsNumeric.map(point => point.map(
        value => Math.round(value * 10) / 10));

    let line = null;

    if (smooth && pixels.length > 2) {
        const controlPoints = getControlPoints(pixelsNumeric);

        line = pixels.slice(0, pixels.length - 1)
            .map((point, index) => {
                if (index === 0) {
                    return {
                        start: point,
                        type: 'Q',
                        args: [controlPoints[index + 1][0], pixels[index + 1]]
                    };
                }
                if (index === pixels.length - 2) {
                    return {
                        start: point,
                        type: 'Q',
                        args: [
                            controlPoints[index][1],
                            pixels[index + 1]
                        ]
                    };
                }

                return {
                    start: point,
                    type: 'C',
                    args: [
                        controlPoints[index][1],
                        controlPoints[index + 1][0],
                        pixels[index + 1]
                    ]
                };

            });
    }
    else {
        line = pixels.slice(1)
            .map((point, index) => ({
                start: pixels[index],
                type: 'L',
                args: [point]
            }));
    }

    if (fill) {
        return line.concat({
            start: pixels[pixels.length - 1],
            type: 'L',
            args: [[pixX(maxX), pixY(minY)]]
        });
    }

    return line;
}

export function getLinePathPart(linePath) {
    if (linePath.length < 1) {
        return '';
    }

    const parts = linePath.map(({ type, args }) =>
        `${type}${args.map(point => point.join(',')).join(' ')}`);

    const start = linePath[0].start;

    return `M${start.join(',')} ${parts.join(' ')}`;
}

export function getSingleLinePath(props) {
    return getLinePathPart(getLinePath(props));
}

export function getDynamicLinePaths({ data, color, smooth, pixX, pixY }) {
    if (data.length < 2) {
        return null;
    }

    const linePath = getLinePath({ data, smooth, pixX, pixY });

    const colors = data.map((point, index) => color(point, index));
    const ends = colors.reduce((indexes, value, index) => {
        const next = index === colors.length - 1 ||
            (index > 0 && colors[index - 1] !== value);

        if (next) {
            return [...indexes, index];
        }

        return indexes;

    }, [0]);

    return ends.slice(1)
        .map((end, endIndex) => ({
            path: getLinePathPart(linePath.slice(ends[endIndex], end)),
            stroke: colors[ends[endIndex]]
        }))
        .filter(({ path }) => path.length);
}

