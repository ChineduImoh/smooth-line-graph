import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import RenderedLine from './RenderedLine';
import Axes from './Axes';
import HighlightPoint from './HighlightPoint';

export default function LineGraphDumb(mainProps) {
    const {
        name,
        outerProperties,
        svgProperties,
        svgClasses,
        lines,
        calc,
        displayAxes,
        hlPoint,
        ...props
    } = mainProps;

    const {
        width,
        height,
        padding,
        beforeGraph,
        afterGraph,
        beforeLines,
        afterLines
    } = props;

    const subProps = {
        width,
        height,
        lines,
        padding,
        ...calc,
        ...props
    };

    const renderedLines = lines.map(({ key, ...line }) => (
        <RenderedLine
            key={key}
            width={width}
            height={height}
            {...line}
            {...calc}
            {...props}
        />
    ));

    const className = classNames('graph-container', `graph-${name}`);

    const attachProps = (propsObject = {}) => Object.keys(propsObject)
        .reduce((proc, key) => ({ ...proc, [key]: propsObject[key](subProps) }), {});

    const svgProps = {
        className: svgClasses || '',
        width,
        height,
        ...attachProps(svgProperties)
    };

    let highlightPoint = null;
    if (hlPoint) {
        highlightPoint = (<HighlightPoint {...subProps} hlPoint={hlPoint} />);
    }

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
                {highlightPoint}
                {afterLines && afterLines(subProps)}
            </svg>
            {afterGraph && afterGraph(subProps)}
        </div>
    );
}

LineGraphDumb.propTypes = {
    name: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    padding: PropTypes.array.isRequired,
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
    outerProperties: PropTypes.object,
    svgProperties: PropTypes.object,
    svgClasses: PropTypes.string,
    calc: PropTypes.object.isRequired,
    hlPoint: PropTypes.object
};


