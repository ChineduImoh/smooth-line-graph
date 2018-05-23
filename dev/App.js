import React from 'react';
import PropTypes from 'prop-types';

import { LineGraphArrows } from '../examples/arrows';
import { LineGraphMulti } from '../examples/multi';
import { LineGraphRandomWalk } from '../examples/randomwalk';
import { LineGraphSmooth } from '../examples/smooth';
import { LineGraphStraight } from '../examples/straight';
import { LineGraphTime } from '../examples/time';

import './style.scss';

function GraphExample({ Graph, title }) {
    const titleShort = title.toLowerCase()
        .replace(/\s+/g, '-');

    const titleWithPrefix = `Graph example: ${title}`;

    const className = `graph-example graph-example-${titleShort}`;

    return (
        <div className={className}>
            <h2 className="title">{titleWithPrefix}</h2>
            <div className="graph">
                <h2 className="hover-title">{titleWithPrefix}</h2>
                <Graph />
            </div>
        </div>
    );
}

GraphExample.propTypes = {
    Graph: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
};

export default function App() {
    return (
        <div className="smooth-line-graph-examples">
            <GraphExample Graph={LineGraphArrows} title="Arrows" />
            <GraphExample Graph={LineGraphMulti} title="Multi" />
            <GraphExample Graph={LineGraphRandomWalk} title="Random walk" />
            <GraphExample Graph={LineGraphSmooth} title="Smooth" />
            <GraphExample Graph={LineGraphStraight} title="Straight" />
            <GraphExample Graph={LineGraphTime} title="Time series" />
        </div>
    );
}

