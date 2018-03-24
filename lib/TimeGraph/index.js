import React from 'react';
import PropTypes from 'prop-types';
import LineGraph from '../LineGraph';
import Axes from './Axes';

export default function TimeGraph(props) {
    const graphProps = {
        ...props,
        beforeLines: Axes
    };

    return <LineGraph {...graphProps} />;
}

TimeGraph.propTypes = {
    startTime: PropTypes.number.isRequired
};

