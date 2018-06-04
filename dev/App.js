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

function GraphExample({ Graph, title, active, onToggleActive }) {
    const titleShort = title.toLowerCase()
        .replace(/\s+/g, '-');

    const titleWithPrefix = `Graph example: ${title}`;

    const className = classNames('graph-example', `graph-example-${titleShort}`, { active });

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

GraphExample.propTypes = {
    active: PropTypes.bool,
    onToggleActive: PropTypes.func.isRequired,
    Graph: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
};

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = { active: '' };
    }
    render() {
        const onActivate = evt => this.setState({ active: evt.target.value });
        const onToggleActive = key => () => this.setState({
            active: this.state.active === key
                ? ''
                : key
        });

        const keys = [
            { key: 'Arrows', Graph: LineGraphArrows },
            { key: 'Multi', Graph: LineGraphMulti },
            { key: 'Random walk', Graph: LineGraphRandomWalk },
            { key: 'Smooth', Graph: LineGraphSmooth },
            { key: 'Straight', Graph: LineGraphStraight },
            { key: 'Time series', Graph: LineGraphTime },
            { key: 'Log scale', Graph: LineGraphLog }
        ];

        const activeOptions = keys.map(({ key }) => (
            <option key={key} value={key}>{key}</option>
        ));

        const examples = keys.map(({ key, Graph }) => (
            <GraphExample key={key}
                title={key}
                Graph={Graph}
                active={this.state.active === key}
                onToggleActive={onToggleActive(key)}
            />
        ));

        return (
            <div className="smooth-line-graph-examples">
                <div className="meta">
                    <span>{'Active: '}</span>
                    <select onChange={onActivate} value={this.state.active}>
                        <option value={''}>{'None'}</option>
                        {activeOptions}
                    </select>
                </div>
                <div className="examples">
                    {examples}
                </div>
            </div>
        );
    }
}

