import React from 'react';
import PropTypes from 'prop-types';
import { calculateTicksX } from '../helpers/ticks';
import TimeAxis from '../TimeAxis';

function TickX(props) {
    const {
        pos,
        value,
        major,
        log,
        axisColor,
        textColor,
        fontSize,
        fontFamily,
        formatValue,
        pixY,
        maxY,
        height,
        padding
    } = props;

    const y0 = height - Math.max(padding[2], fontSize);

    const y1 = log
        ? padding[0]
        : pixY(maxY);

    const lineColor = major > 1
        ? axisColor
        : '#ccc';

    let text = null;
    if (major > 0) {
        text = (
            <text x={pos} y={y0} color={textColor}
                fontSize={fontSize} fontFamily={fontFamily}
                alignmentBaseline="hanging" textAnchor="middle">{formatValue(value)}</text>
        );
    }

    return (
        <g key={value}>
            <line x1={pos} y1={y0} x2={pos} y2={y1}
                stroke={lineColor} strokeWidth={1} />
            {text}
        </g>
    );
}

TickX.propTypes = {
    pos: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    major: PropTypes.number.isRequired,
    log: PropTypes.bool,
    axisColor: PropTypes.string.isRequired,
    textColor: PropTypes.string.isRequired,
    fontFamily: PropTypes.string.isRequired,
    fontSize: PropTypes.number.isRequired,
    formatValue: PropTypes.func.isRequired,
    pixY: PropTypes.func.isRequired,
    minY: PropTypes.number.isRequired,
    maxY: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    padding: PropTypes.array.isRequired
};

export default function AxisX(props) {
    const ticksX = typeof props.startTime === 'undefined'
        ? calculateTicksX(props).map(tick => (
            <TickX key={tick.value} {...tick} {...props} />
        ))
        : (<TimeAxis {...props} />);

    return (
        <g className="x-axis">{ticksX}</g>
    );
}

AxisX.propTypes = {
    startTime: PropTypes.number
};

