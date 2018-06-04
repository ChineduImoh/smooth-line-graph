/**
 * React component to display a line graph (e.g. time series)
 */

import React from 'react';
import PropTypes from 'prop-types';
import { genPixelProps } from './helpers/calc';
import LineGraphInteractive from './LineGraphInteractive';
import LineGraphDumb from './LineGraphDumb';

export default function LineGraph({ interactive, ...props }) {
    const padding = props.padding || [0, 0, 0, 0];

    if (interactive) {
        return (<LineGraphInteractive padding={padding} {...props} />);
    }

    const graphProps = {
        padding,
        calc: genPixelProps({
            padding,
            width: props.width,
            height: props.height,
            lines: props.lines,
            log: props.log
        }),
        ...props
    };

    return (<LineGraphDumb {...graphProps} />);
}

LineGraph.propTypes = {
    interactive: PropTypes.bool,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    padding: PropTypes.array,
    lines: PropTypes.array.isRequired,
    log: PropTypes.bool,
    outerProperties: PropTypes.object
};

