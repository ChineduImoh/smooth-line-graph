import React from 'react';
import PropTypes from 'prop-types';

function getLabelPosX(posX, width, labelWidthX) {
    let anchorLabelX = 'middle';
    let labelPosX = posX;
    let rectPosX = posX - labelWidthX / 2;

    if (posX >= width - labelWidthX / 2) {
        anchorLabelX = 'end';
        labelPosX = width;
        rectPosX = width - labelWidthX;
    }
    else if (posX < labelWidthX / 2) {
        anchorLabelX = 'start';
        labelPosX = 0;
        rectPosX = 0;
    }

    return { anchorLabelX, labelPosX, rectPosX };
}

function getLabelPosY(posY, height, labelHeight) {
    let labelPosY = posY;
    let rectPosY = labelPosY - labelHeight / 2;

    if (posY >= height - labelHeight / 2) {
        labelPosY = height - labelHeight / 2 + 2;
        rectPosY = height - labelHeight;
    }
    else if (posY < labelHeight / 2) {
        labelPosY = labelHeight / 2;
        rectPosY = 0;
    }

    return { labelPosY, rectPosY };
}

function formatLabelX(valX, startTime) {
    if (startTime) {
        return new Date(1000 * (valX + startTime)).toISOString();
    }

    return String(valX);
}

export default function HighlightPoint({ pixX, pixY, width, height, hlPoint, startTime }) {
    if (!hlPoint) {
        return null;
    }

    const labelWidthX = 180;
    const labelWidthY = 64;

    const fontSize = 14.5;
    const fontFamily = 'sans-serif';
    const labelHeight = fontSize + 2;

    const { valX, valY, color } = hlPoint;

    const posX = Math.floor(pixX(valX)) + 0.5;
    const posY = Math.floor(pixY(valY)) + 0.5;

    const { anchorLabelX, labelPosX, rectPosX } = getLabelPosX(posX, width, labelWidthX);
    const { labelPosY, rectPosY } = getLabelPosY(posY, height, labelHeight);

    const labelTextX = formatLabelX(valX, startTime);
    const labelTextY = String(valY);

    const pathVertical = `M${posX},0 L${posX},${height}`;
    const pathHorizontal = `M0,${posY} L${width},${posY}`;

    const lineProps = { stroke: color, strokeDasharray: '3,2' };

    const textProps = { fontSize, fontFamily, color: 'black' };
    const textPropsX = {
        'x': labelPosX,
        'y': height - 2,
        textAnchor: anchorLabelX,
        alignmentBaseline: 'baseline'
    };
    const textPropsY = {
        'x': width,
        'y': labelPosY,
        textAnchor: 'end',
        alignmentBaseline: 'middle'
    };

    const labelBgColor = 'rgba(255, 255, 255, 0.8)';

    return <g className="hl-point">
        <path d={pathVertical} {...lineProps} />
        <path d={pathHorizontal} {...lineProps} />
        <rect x={rectPosX} y={height - labelHeight} width={labelWidthX} height={labelHeight}
            fill={labelBgColor} />
        <text {...textProps} {...textPropsX}>{labelTextX}</text>
        <rect x={width - labelWidthY} y={rectPosY} width={labelWidthY} height={labelHeight}
            fill={labelBgColor} />
        <text {...textProps} {...textPropsY}>{labelTextY}</text>
    </g>;
}

HighlightPoint.propTypes = {
    hlPoint: PropTypes.shape({
        valX: PropTypes.number.isRequired,
        valY: PropTypes.number.isRequired,
        color: PropTypes.string.isRequired
    }),
    startTime: PropTypes.number,
    pixX: PropTypes.func.isRequired,
    pixY: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
};

