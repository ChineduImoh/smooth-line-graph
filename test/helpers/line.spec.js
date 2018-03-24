import { expect } from 'chai';
import * as line from '../../lib/helpers/line';

describe('Line helper functions', () => {
    const linePathSimple = [
        {
            args: [[52.6, 365]],
            start: [0, 380],
            type: 'L'
        },
        {
            args: [[78.9, 430]],
            start: [52.6, 365],
            type: 'L'
        },
        {
            args: [[236.8, 500]],
            start: [78.9, 430],
            type: 'L'
        },
        {
            args: [[342.1, 10]],
            start: [236.8, 500],
            type: 'L'
        },
        {
            args: [[355.3, 0]],
            start: [342.1, 10],
            type: 'L'
        },
        {
            args: [[394.7, 20]],
            start: [355.3, 0],
            type: 'L'
        },
        {
            args: [[500, 380]],
            start: [394.7, 20],
            type: 'L'
        }
    ];

    const linePathSimpleFilled = [
        ...linePathSimple,
        {
            args: [500, 500],
            start: [500, 380],
            type: 'L'
        }
    ];

    const linePathSmooth = [
        {
            type: 'Q',
            start: [0, 380],
            args: [[41, 358], [52.6, 365]]
        },
        {
            type: 'C',
            start: [52.6, 365],
            args: [[67, 374], [61, 417], [78.9, 430]]
        },
        {
            type: 'C',
            start: [78.9, 430],
            args: [[122, 462], [215, 536], [236.8, 500]]
        },
        {
            type: 'C',
            start: [236.8, 500],
            args: [[301, 397], [304, 170], [342.1, 10]]
        },
        {
            type: 'C',
            start: [342.1, 10],
            args: [[343, 5], [351, -1], [355.3, 0]]
        },
        {
            type: 'C',
            start: [355.3, 0],
            args: [[368, 2], [390, 7], [394.7, 20]]
        },
        {
            type: 'Q',
            start: [394.7, 20],
            args: [[437, 132], [500, 380]]
        }
    ];

    const baseProps = {
        width: 500,
        height: 500,
        data: [
            [-10, 3],
            [-8, 4.5],
            [-7, -2],
            [-1, -9],
            [3, 40],
            [3.5, 41],
            [5, 39],
            [9, 3]
        ],
        minX: -10,
        maxX: 9,
        minY: -9,
        maxY: 41,
        pixX: xVal => 500 * (xVal + 10) / 19,
        pixY: yVal => 500 * (1 - (yVal + 9) / 50)
    };

    const propsSimple = baseProps;

    const propsSmooth = { ...baseProps, smooth: true };

    const pathSimple = 'M0,380 L52.6,365 L78.9,430 L236.8,500 L342.1,10 L355.3,0 L394.7,20 L500,380';

    const pathSmooth = 'M0,380 Q41,358 52.6,365 C67,374 61,417 78.9,430 C122,462 215,536 236.8,500 C301,397 304,170 342.1,10 C343,5 351,-1 355.3,0 C368,2 390,7 394.7,20 Q437,132 500,380';

    describe('getLinePath', () => {
        describe('simple dot-to-dot line', () => {
            it('should render', () => {
                expect(line.getLinePath(propsSimple))
                    .to.deep.equal(linePathSimple);
            });

            it('should add an end point for a filled path', () => {
                expect(line.getLinePath({ ...propsSimple, fill: true }))
                    .to.deep.equal(linePathSimpleFilled);
            });
        });

        describe('Smooth line', () => {
            it('should be rendered as a bezier curve in SVG format', () => {
                expect(line.getLinePath(propsSmooth)).to.deep.equal(linePathSmooth);
            });

            it('should render a sipmle dot to dot line if there are less than three points', () => {
                expect(line.getLinePath({
                    ...propsSmooth,
                    data: [
                        [10, 13],
                        [11, 9]
                    ]
                }))
                    .to.deep.equal([
                        { start: [526.3, 280], args: [[552.6, 320]], type: 'L' }
                    ]);
            });
        });
    });

    describe('getLinePathPart', () => {
        it('should return nothing for an empty array', () => {
            expect(line.getLinePathPart([])).to.equal('');
        });

        it('should join a line path into a format usable in an SVG <path /> element', () => {
            expect(line.getLinePathPart(linePathSimple))
                .to.equal(pathSimple);
        });

        it('should join a smooth line', () => {
            expect(line.getLinePathPart(linePathSmooth))
                .to.equal(pathSmooth);
        });
    });

    describe('getSingleLinePath', () => {
        it('should get a line path part for the props given', () => {
            expect(line.getSingleLinePath(propsSimple)).to.equal(pathSimple);
            expect(line.getSingleLinePath(propsSmooth)).to.equal(pathSmooth);
        });
    });

    describe('getDynamicLinePaths', () => {
        it('should get a dynamically coloured line path', () => {
            const propsDynamic = {
                ...propsSimple,
                color: ([valX, valY], index) => {
                    if (valX > 0) {
                        if (index > 5) {
                            return 'red';
                        }

                        return 'blue';
                    }

                    if (valY < 0) {
                        return 'green';
                    }

                    return 'yellow';
                }
            };

            expect(line.getDynamicLinePaths(propsDynamic)).to.deep.equal([
                { path: 'M0,380 L52.6,365 L78.9,430', stroke: 'yellow' },
                { path: 'M78.9,430 L236.8,500 L342.1,10', stroke: 'green' },
                { path: 'M342.1,10 L355.3,0 L394.7,20', stroke: 'blue' },
                { path: 'M394.7,20 L500,380', stroke: 'red' }
            ]);
        });
    });
});

