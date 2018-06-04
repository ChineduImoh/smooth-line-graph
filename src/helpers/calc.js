import { MIN_LOG_VALUE } from '../constants';

const coalesce = (arg1, arg2) => {
    if (arg1 || arg1 === 0) {
        return arg1;
    }

    return arg2;
};

export function genPixelProps(props) {
    const {
        width,
        height,
        padding: [padTop, padRight, padBottom, padLeft],
        log,
        lines
    } = props;

    const pointReducer = (compare, initial) => lines.reduce((last, { data }) =>
        data.reduce((lastValue, point) => compare(lastValue, point), last), initial);

    const minX = coalesce(props.minX,
        pointReducer((last, [valX]) => Math.min(last, valX), Infinity));

    const maxX = coalesce(props.maxX,
        pointReducer((last, [valX]) => Math.max(last, valX), -Infinity));

    const minY = coalesce(props.minY,
        pointReducer((last, [, valY]) => Math.min(last, valY), Infinity));
    const maxY = coalesce(props.maxY,
        pointReducer((last, [, valY]) => Math.max(last, valY), -Infinity));

    const minYLog = Math.log(Math.E ** Math.floor(Math.log(Math.max(MIN_LOG_VALUE, minY))));
    const maxYLog = Math.log(Math.E ** Math.ceil(Math.log(Math.max(1, maxY))));

    const withLog = handler => {
        if (log) {
            return value => handler(Math.log(Math.max(MIN_LOG_VALUE, value)), minYLog, maxYLog);
        }

        return value => handler(value, minY, maxY);
    };

    const withLogInverse = handler => {
        if (log) {
            return value => Math.E ** handler(value, minYLog, maxYLog);
        }

        return value => handler(value, minY, maxY);
    };

    return {
        pixX: value =>
            padLeft + (value - minX) / (maxX - minX) * (width - padLeft - padRight),
        pixY: withLog((value, y0, y1) =>
            height - padBottom - (value - y0) / (y1 - y0) * (height - padTop - padBottom)),
        valX: pix =>
            (pix - padLeft) * (maxX - minX) / (width - padLeft - padRight) + minX,
        valY: withLogInverse((pix, y0, y1) =>
            (height - padBottom - pix) * (y1 - y0) / (height - padTop - padBottom) + y0),

        minX,
        maxX,
        minY,
        maxY
    };
}

export function getClosest(lines, position, mvt) {
    if (!position) {
        return null;
    }

    const { posX, posY } = position;

    return lines.reduce((red, line, lineIndex) => {
        return line.data.reduce((last, point, index) => {
            const dist = (((mvt.pixX(point[0]) - posX) ** 2) + ((mvt.pixY(point[1]) - posY) ** 2)) ** 0.5;

            if (last && dist > last.dist) {
                return last;
            }

            return { dist, lineIndex, point, index };
        }, red);
    }, null);
}

