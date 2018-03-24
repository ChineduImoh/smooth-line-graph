import { expect } from 'chai';
import * as smoothing from '../../src/helpers/smoothing';

describe('Smoothing functions', () => {
    describe('getControlPoints', () => {
        const data = [
            [3, 5],
            [-1, 10],
            [-1.8, 9],
            [6, -3],
            [7, 2]
        ];

        it('should return the control points for a cubic bezier-smoothed version of a dataset', () => {
            expect(smoothing.getControlPoints(data, 0.33)).to.deep.equal([
                null,
                [[0, 9], [-1, 10]],
                [[-2, 9], [0, 5]],
                [[4, -1], [7, -4]],
                null
            ]);
        });

        it('should handle different curviness values', () => {
            expect(smoothing.getControlPoints(data, 0)).to.deep.equal([
                null,
                [[-1, 10], [-1, 10]],
                [[-2, 9], [-2, 9]],
                [[6, -3], [6, -3]],
                null
            ]);

            expect(smoothing.getControlPoints(data, 0.5)).to.deep.equal([
                null,
                [[1, 8], [-1, 10]],
                [[-2, 10], [1, 3]],
                [[3, -0], [7, -4]],
                null
            ]);
        });
    });
});

