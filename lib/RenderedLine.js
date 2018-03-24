import React from 'react';
import PropTypes from 'prop-types';
import ArrowLine from './ArrowLine';
import { getDynamicLinePaths, getSingleLinePath } from './helpers/line';

export default function RenderedLine({ data, smooth, arrows, color, fill, ...props }) {
    if (!data.length) {
        return null;
    }

    if (arrows) {
        return <ArrowLine data={data} color={color} {...props} />;
    }

    if (typeof color === 'function') {
        if (fill) {
            throw new Error('Dynamically coloured, filled graph not implemented');
        }

        const linePaths = getDynamicLinePaths({ data, smooth, color, ...props });

        const paths = linePaths.map(({ path, stroke }, key) => (
            <path key={key} d={path} stroke={stroke} strokeWidth={props.strokeWidth || 2} fill="none" />
        ));

        return <g className="lines">{paths}</g>;
    }

    const linePath = getSingleLinePath({ data, smooth, fill, ...props });

    const fillStyle = fill
        ? color
        : 'none';

    const strokeStyle = fill
        ? 'none'
        : color;

    return <g className="line">
        <path d={linePath} stroke={strokeStyle} strokeWidth={props.strokeWidth || 2} fill={fillStyle} />
    </g>;
}

RenderedLine.propTypes = {
    data: PropTypes.array.isRequired,
    color: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
    ]).isRequired,
    strokeWidth: PropTypes.number,
    fill: PropTypes.bool,
    smooth: PropTypes.bool,
    arrows: PropTypes.bool,
    pixX: PropTypes.func.isRequired,
    pixY: PropTypes.func.isRequired,
    valX: PropTypes.func.isRequired,
    valY: PropTypes.func.isRequired
};

