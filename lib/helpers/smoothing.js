import { DEFAULT_CURVINESS } from '../constants';

function getControlPointsAtPoint(curviness) {
    return ([x0, y0], [x1, y1], [x2, y2]) => {
        const distLeft = ((x1 - x0) ** 2 + (y1 - y0) ** 2) ** 0.5;
        const distRight = ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5;

        const controlFactor0 = curviness * distLeft / (distLeft + distRight);
        const controlFactor1 = curviness - controlFactor0;

        const controlX0 = Math.round(x1 - controlFactor0 * (x2 - x0));
        const controlY0 = Math.round(y1 - controlFactor0 * (y2 - y0));

        const controlX1 = Math.round(x1 + controlFactor1 * (x2 - x0));
        const controlY1 = Math.round(y1 + controlFactor1 * (y2 - y0));

        return [[controlX0, controlY0], [controlX1, controlY1]];
    };
}

export function getControlPoints(data, curviness = DEFAULT_CURVINESS) {
    const atPoint = getControlPointsAtPoint(curviness);

    return data.map((point, index) => {
        if (index === 0 || index === data.length - 1) {
            return null;
        }

        return atPoint(data[index - 1], point, data[index + 1]);
    });
}

