import React from 'react';
import PropTypes from 'prop-types';
import { calculateTicksY } from '../helpers/ticks';

function TickY(props) {
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
        pixX,
        minX,
        maxX
    } = props;

    const lineColor = major > 1
        ? axisColor
        : '#ccc';

    let text = null;
    if (major > 0) {
        text = (
            <text x={pixX(maxX)} y={pos - 2} color={textColor}
                fontSize={fontSize} fontFamily={fontFamily}
                alignmentBaseline="baseline" textAnchor="end">{formatValue(value, log)}</text>
        );
    }

    return (
        <g key={value}>
            <line x1={pixX(minX)} y1={pos} x2={pixX(maxX)} y2={pos}
                stroke={lineColor} strokeWidth={1} />
            {text}
        </g>
    );
}

TickY.propTypes = {
    pos: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    major: PropTypes.number,
    log: PropTypes.bool,
    axisColor: PropTypes.string.isRequired,
    textColor: PropTypes.string.isRequired,
    fontFamily: PropTypes.string.isRequired,
    fontSize: PropTypes.number.isRequired,
    formatValue: PropTypes.func.isRequired,
    pixX: PropTypes.func.isRequired,
    minX: PropTypes.number.isRequired,
    maxX: PropTypes.number.isRequired
};

export default function AxisY(props) {
    const ticksY = calculateTicksY(props).map(tick => (
        <TickY key={tick.value} {...tick} {...props} />
    ));

    return (
        <g className="y-axis">{ticksY}</g>
    );
}

