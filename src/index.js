/**
 * React component to display a line graph (e.g. time series)
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { MIN_LOG_VALUE } from './constants';
import RenderedLine from './RenderedLine';
import Axes from './Axes.js';

const coalesce = (arg1, arg2) => {
    if (arg1 || arg1 === 0) {
        return arg1;
    }

    return arg2;
};

const genPixelProps = props => {
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
    let maxY = coalesce(props.maxY,
        pointReducer((last, [, valY]) => Math.max(last, valY), -Infinity));

    if (log) {
        maxY = Math.E ** Math.ceil(Math.log(maxY));
    }

    const minYLog = Math.log(Math.max(MIN_LOG_VALUE, minY));
    const maxYLog = Math.log(Math.max(1, maxY));

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
};

export default function LineGraph({
    name, outerProperties, svgProperties, svgClasses, lines, displayAxes, ...props
}) {
    const {
        width,
        height,
        beforeGraph,
        afterGraph,
        beforeLines,
        afterLines
    } = props;

    const pixelProps = genPixelProps({
        padding: [0, 0, 0, 0],
        width,
        height,
        lines,
        ...props
    });

    const subProps = {
        width,
        height,
        lines,
        ...pixelProps,
        ...props
    };

    const renderedLines = lines.map(({ key, ...line }) => (
        <RenderedLine
            key={key}
            width={width}
            height={height}
            {...line}
            {...pixelProps}
            {...props}
        />
    ));

    const className = classNames('graph-container', `graph-${name}`);

    const attachProps = (propsObject = {}) => Object.keys(propsObject)
        .reduce((proc, key) => ({ ...proc, [key]: propsObject[key](props) }), {});

    const svgProps = {
        className: svgClasses || '',
        width,
        height,
        ...attachProps(svgProperties)
    };

    let axes = null;
    if (typeof displayAxes === 'undefined' || displayAxes) {
        axes = (<Axes {...subProps} />);
    }

    return (
        <div className={className} {...attachProps(outerProperties)}>
            {beforeGraph && beforeGraph(subProps)}
            <svg {...svgProps}>
                {beforeLines && beforeLines(subProps)}
                {axes}
                {renderedLines}
                {afterLines && afterLines(subProps)}
            </svg>
            {afterGraph && afterGraph(subProps)}
        </div>
    );
}

LineGraph.propTypes = {
    name: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    log: PropTypes.bool,
    displayAxes: PropTypes.bool,
    lines: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.any.isRequired,
        data: PropTypes.array.isRequired,
        color: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func
        ]).isRequired,
        strokeWidth: PropTypes.number,
        fill: PropTypes.bool,
        smooth: PropTypes.bool,
        arrows: PropTypes.bool
    })).isRequired,
    beforeLines: PropTypes.func,
    afterLines: PropTypes.func,
    beforeGraph: PropTypes.func,
    afterGraph: PropTypes.func,
    minX: PropTypes.number,
    maxX: PropTypes.number,
    minY: PropTypes.number,
    maxY: PropTypes.number,
    outerProperties: PropTypes.object,
    svgProperties: PropTypes.object,
    svgClasses: PropTypes.string
};

