import React from 'react';
import PropTypes from 'prop-types';
import { getTimeScale } from './helpers/time';
import { TICK_COLORS } from './constants';

export default function TimeAxis(props) {
    const { startTime, minY, maxY, pixY, axisColor, fontFamily, fontSize } = props;

    const y0 = pixY(minY);
    const yMax = pixY(maxY);

    const tickSize = 10;
    const tickAngle = -30;
    const transformText = (xPix, yPix) => `rotate(${tickAngle} ${xPix} ${yPix})`;

    const getColor = major => TICK_COLORS[(major > 0) >> 0];
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

