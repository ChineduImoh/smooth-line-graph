import React, { PureComponent } from 'react';
import * as constants from '../constants';
import { defaultFormatValue } from '../helpers/format';
import AxisX from './AxisX';
import AxisY from './AxisY';

export default class Axes extends PureComponent {
    render() {
        const graphProps = {
            axisColor: constants.DEFAULT_AXIS_COLOR,
            textColor: constants.DEFAULT_TEXT_COLOR,
            fontSize: constants.DEFAULT_FONT_SIZE,
            fontFamily: constants.DEFAULT_FONT_FAMILY,
            formatValue: defaultFormatValue,
            ...this.props
        };

        return (
            <g className="axes">
                <AxisY {...graphProps} />
                <AxisX {...graphProps} />
            </g>
        );
    }
}

