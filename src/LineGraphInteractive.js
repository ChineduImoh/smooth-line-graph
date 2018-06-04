import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debounce from 'debounce';
import { genPixelProps, getClosest } from './helpers/calc';
import { getHlColor } from './helpers/format';
import LineGraphDumb from './LineGraphDumb';

export default class LineGraphInteractive extends PureComponent {
    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        padding: PropTypes.array.isRequired,
        lines: PropTypes.array.isRequired,
        log: PropTypes.bool,
        outerProperties: PropTypes.object
    };
    constructor(props) {
        super(props);

        this.state = {
            hlPoint: null,
            outerProperties: this.props.outerProperties || {},
            calc: null
        };
    }
    updatePixelProps() {
        this.setState({
            calc: genPixelProps({
                padding: this.props.padding,
                width: this.props.width,
                height: this.props.height,
                lines: this.props.lines,
                log: this.props.log
            })
        });
    }
    onHover(position, mvt) {
        if (!this.props.lines) {
            return;
        }

        const closest = getClosest(this.props.lines, position, mvt);
        if (!closest) {
            this.setState({ hlPoint: null });

            return;
        }

        const { lineIndex, point, index } = closest;
        const color = getHlColor(this.props.lines[lineIndex].color, point, index);

        this.setState({
            hlPoint: {
                valX: point[0],
                valY: point[1],
                color
            }
        });
    }
    getOnMouseMove() {
        return subProps => {
            const handler = debounce((pageX, pageY, currentTarget) => {
                const { left, top } = currentTarget.getBoundingClientRect();

                this.onHover({
                    posX: pageX - left,
                    posY: pageY - top
                }, subProps);

            }, 10, true);

            return evt => {
                const { pageX, pageY, currentTarget } = evt;

                return handler(pageX, pageY, currentTarget);
            };
        };
    }
    getOnMouseLeave() {
        return () => () => this.onHover(null);
    }
    getMouseEffects() {
        return {
            onMouseMove: this.getOnMouseMove(),
            onMouseLeave: this.getOnMouseLeave()
        };
    }
    updateMouseEffects() {
        this.setState({
            outerProperties: { ...(this.props.outerProperties || {}), ...this.getMouseEffects() }
        });
    }
    componentDidMount() {
        this.updateMouseEffects();
        this.updatePixelProps();
    }
    componentWillUpdate(nextProps, nextState) {
        if (!(this.state.width === nextState.width &&
            this.state.height === nextState.height)) {

            this.updateMouseEffects();
        }
    }
    render() {
        if (!this.state.calc) {
            return null;
        }

        return (
            <LineGraphDumb
                {...this.props}
                calc={this.state.calc}
                hlPoint={this.state.hlPoint}
                outerProperties={this.state.outerProperties}
            />
        );
    }
}

