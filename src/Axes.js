import React from 'react';
import PropTypes from 'prop-types';
import * as constants from './constants';
import { getTimeScale } from './helpers/time';
import { defaultFormatValue } from './helpers/format';

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

    return {
        tickSize,
        numTicks: Math.floor((max - min) / tickSize)
    };
}

function calculateTicksY({ numTicksY = 10, log, minY, maxY, pixY }) {
    // calculate tick range
    if (log) {
        const pixPos = value => Math.floor(pixY(value)) + 0.5;

        const startExp = Math.floor(Math.log10(Math.max(constants.MIN_LOG_VALUE, minY)));
        const endExp = Math.ceil(Math.log10(Math.max(1, maxY)));

        if (startExp > endExp) {
            return [];
        }

        return new Array(endExp + 1 - startExp).fill(0)
            .reduce((items, item, index) => {
                const value = 10 ** (startExp + index);
                const value2 = 2 * value;
                const value5 = 5 * value;

                return items.concat([
                    { value, pos: pixPos(value), major: 1 },
                    { value: value2, pos: pixPos(value2), major: 0 },
                    { value: value5, pos: pixPos(value5), major: 0 }
                ]);

            }, []);
    }

    const { tickSize, numTicks } = getRoundTick({ numTicks: numTicksY, min: minY, max: maxY });

    if (!numTicks) {
        return [];
    }

    return new Array(numTicks)
        .fill(0)
        .map((item, key) => {
            const value = minY + (key + 1) * tickSize;
            const pos = Math.floor(pixY(value)) + 0.5;

            return { value, pos };
        });
}

const tickColors = [
    constants.DEFAULT_TICK_COLOR_MINOR,
    constants.DEFAULT_TICK_COLOR_MAJOR
];

function TimeAxis(props) {
    const { startTime, minY, maxY, pixY, axisColor, fontFamily, fontSize } = props;

    const y0 = pixY(minY);
    const yMax = pixY(maxY);

    const tickSize = 10;
    const tickAngle = -30;
    const transformText = (xPix, yPix) => `rotate(${tickAngle} ${xPix} ${yPix})`;

    const getColor = major => tickColors[(major > 0) >> 0];
    const getTickSize = major => tickSize * 0.5 * (major + 1);

    const timeTicks = getTimeScale(props)(startTime);

    const timeTicksSmall = timeTicks.map(({ pix, major }, key) => (
        <line key={key} x1={pix} y1={y0} x2={pix} y2={y0 - getTickSize(major)}
            stroke={getColor(major)} strokeWidth={1} />
    ));

    const timeTicksMajor = timeTicks.filter(({ major }) => major > 1)
        .map(({ pix, major }, key) => (
            <line key={key} x1={pix} y1={y0 - getTickSize(major)} x2={pix} y2={yMax}
                stroke={axisColor} strokeWidth={1} />
        ));

    const timeTickFontSize = major => {
        if (major) {
            return fontSize;
        }

        return fontSize - 3;
    };

    const timeTicksText = timeTicks.filter(({ text }) => text)
        .map(({ text, pix, major }) => (
            <text key={pix} x={pix} y={y0 - getTickSize(major)}
                fontFamily={fontFamily} fontSize={timeTickFontSize(major)}
                alignmentBaseline="baseline"
                transform={transformText(pix, y0 - getTickSize(major))}
            >{text}</text>
        ));

    return (
        <g className="time-axis">
            <g>{timeTicksSmall}</g>
            <g>{timeTicksMajor}</g>
            <g>{timeTicksText}</g>
        </g>
    );
}

TimeAxis.propTypes = {
    startTime: PropTypes.number.isRequired,
    maxX: PropTypes.number.isRequired,
    minY: PropTypes.number.isRequired,
    maxY: PropTypes.number.isRequired,
    pixX: PropTypes.func.isRequired,
    pixY: PropTypes.func.isRequired,
    axisColor: PropTypes.string.isRequired,
    fontFamily: PropTypes.string.isRequired,
    fontSize: PropTypes.number.isRequired
};

function TickY({
    pos, value, major, log, axisColor, textColor, fontSize, fontFamily, formatValue, pixX, minX, maxX
}) {
    const lineColor = major
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

export default function Axes(props) {
    const graphProps = {
        axisColor: constants.DEFAULT_AXIS_COLOR,
        textColor: constants.DEFAULT_TEXT_COLOR,
        fontSize: constants.DEFAULT_FONT_SIZE,
        fontFamily: constants.DEFAULT_FONT_FAMILY,
        formatValue: defaultFormatValue,
        ...props
    };

    const ticksY = calculateTicksY(props).map(tick => (
        <TickY key={tick.value} {...tick} {...graphProps} />
    ));

    let ticksX = null;

    if (typeof props.startTime !== 'undefined') {
        ticksX = (<TimeAxis {...graphProps} />);
    }

    return (
        <g className="axes">
            <g className="x-axis">{ticksX}</g>
            <g className="y-axis">{ticksY}</g>
        </g>
    );
}

Axes.propTypes = {
    startTime: PropTypes.number,
    log: PropTypes.bool,
    tickSizeY: PropTypes.number,
    minY: PropTypes.number.isRequired,
    maxY: PropTypes.number.isRequired,
    minX: PropTypes.number.isRequired,
    maxX: PropTypes.number.isRequired,
    pixX: PropTypes.func.isRequired,
    pixY: PropTypes.func.isRequired
};

