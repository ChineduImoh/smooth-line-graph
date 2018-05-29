import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { LineGraphArrows } from '../examples/arrows';
import { LineGraphMulti } from '../examples/multi';
import { LineGraphRandomWalk } from '../examples/randomwalk';
import { LineGraphSmooth } from '../examples/smooth';
import { LineGraphStraight } from '../examples/straight';
import { LineGraphTime } from '../examples/time';
import { LineGraphLog } from '../examples/log';

import './style.scss';

class GraphExample extends Component {
    constructor(props) {
        super(props);

        this.state = { active: false };
    }
    render() {
        const { Graph, title } = this.props;

        const titleShort = title.toLowerCase()
            .replace(/\s+/g, '-');

        const titleWithPrefix = `Graph example: ${title}`;

        const className = classNames('graph-example', `graph-example-${titleShort}`, {
            active: this.state.active
        });

        const onToggleActive = () => this.setState({ active: !this.state.active });

        return (
            <div className={className} onClick={onToggleActive}>
                <div className="inner">
                    <h2 className="title">{titleWithPrefix}</h2>
                    <div className="graph">
                        <Graph />
                    </div>
                </div>
            </div>
        );
    }
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
            <GraphExample Graph={LineGraphLog} title="Log scale" />
        </div>
    );
}

