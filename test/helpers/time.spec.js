import { expect } from 'chai';
import * as time from '../../src/helpers/time';

describe('Time functions', () => {
    describe('getTimeSeriesTicks', () => {
        it('should handle small ranges (less than 10 minutes)', () => {
            const result = time.timeSeriesTicks(1497871283, 1497871283 + 167);
            const expectedResult = [
                { label: '12:21', major: 1, time: 1497871260 },
                { label: false, major: 0, time: 1497871290 },
                { label: '12:22', major: 1, time: 1497871320 },
                { label: false, major: 0, time: 1497871350 },
                { label: '12:23', major: 1, time: 1497871380 },
                { label: false, major: 0, time: 1497871410 }
            ];

            expect(result).to.deep.equal(expectedResult);
        });
        it('should handle ranges of between 10 minutes and one hour', () => {
            const result = time.timeSeriesTicks(1497871283, 1497871283 + 795);

            const expectedResult = [
                { label: false, major: 0, time: 1497871260 },
                { label: false, major: 0, time: 1497871320 },
                { label: false, major: 0, time: 1497871380 },
                { label: false, major: 0, time: 1497871440 },
                { label: false, major: 0, time: 1497871500 },
                { label: false, major: 0, time: 1497871560 },
                { label: false, major: 0, time: 1497871620 },
                { label: false, major: 0, time: 1497871680 },
                { label: false, major: 0, time: 1497871740 },
                { label: '12:30', major: 1, time: 1497871800 },
                { label: false, major: 0, time: 1497871860 },
                { label: false, major: 0, time: 1497871920 },
                { label: false, major: 0, time: 1497871980 },
                { label: false, major: 0, time: 1497872040 }
            ];

            expect(result).to.deep.equal(expectedResult);
        });
        it('should handle ranges of between one hour and 0.6 days', () => {
            const result = time.timeSeriesTicks(1497871283, 1497871283 + 51320);

            const expectedResult = [
                { label: '12:00', major: 1, time: 1497870000 },
                { label: false, major: 0, time: 1497871800 },
                { label: '13:00', major: 1, time: 1497873600 },
                { label: false, major: 0, time: 1497875400 },
                { label: '14:00', major: 1, time: 1497877200 },
                { label: false, major: 0, time: 1497879000 },
                { label: '15:00', major: 1, time: 1497880800 },
                { label: false, major: 0, time: 1497882600 },
                { label: '16:00', major: 1, time: 1497884400 },
                { label: false, major: 0, time: 1497886200 },
                { label: '17:00', major: 1, time: 1497888000 },
                { label: false, major: 0, time: 1497889800 },
                { label: '18:00', major: 1, time: 1497891600 },
                { label: false, major: 0, time: 1497893400 },
                { label: '19:00', major: 1, time: 1497895200 },
                { label: false, major: 0, time: 1497897000 },
                { label: '20:00', major: 1, time: 1497898800 },
                { label: false, major: 0, time: 1497900600 },
                { label: '21:00', major: 1, time: 1497902400 },
                { label: false, major: 0, time: 1497904200 },
                { label: '22:00', major: 1, time: 1497906000 },
                { label: false, major: 0, time: 1497907800 },
                { label: '23:00', major: 1, time: 1497909600 },
                { label: false, major: 0, time: 1497911400 },
                { label: 'Tue', major: 2, time: 1497913200 },
                { label: false, major: 0, time: 1497915000 },
                { label: '01:00', major: 1, time: 1497916800 },
                { label: false, major: 0, time: 1497918600 },
                { label: '02:00', major: 1, time: 1497920400 }
            ];

            expect(result).to.deep.equal(expectedResult);
        });
        it('should handle ranges of between 0.6 days and eight days', () => {
            const result = time.timeSeriesTicks(1497871283, 1497871283 + 86400 * 3.32, { width: 500 });

            const expectedResult = [
                { time: 1497870000, major: 0, label: '12' },
                { time: 1497880800, major: 0, label: '15' },
                { time: 1497891600, major: 0, label: '18' },
                { time: 1497902400, major: 0, label: '21' },
                { time: 1497913200, major: 1, label: 'Tue' },
                { time: 1497924000, major: 0, label: '3' },
                { time: 1497934800, major: 0, label: '6' },
                { time: 1497945600, major: 0, label: '9' },
                { time: 1497956400, major: 0, label: '12' },
                { time: 1497967200, major: 0, label: '15' },
                { time: 1497978000, major: 0, label: '18' },
                { time: 1497988800, major: 0, label: '21' },
                { time: 1497999600, major: 1, label: 'Wed' },
                { time: 1498010400, major: 0, label: '3' },
                { time: 1498021200, major: 0, label: '6' },
                { time: 1498032000, major: 0, label: '9' },
                { time: 1498042800, major: 0, label: '12' },
                { time: 1498053600, major: 0, label: '15' },
                { time: 1498064400, major: 0, label: '18' },
                { time: 1498075200, major: 0, label: '21' },
                { time: 1498086000, major: 1, label: 'Thu' },
                { time: 1498096800, major: 0, label: '3' },
                { time: 1498107600, major: 0, label: '6' },
                { time: 1498118400, major: 0, label: '9' },
                { time: 1498129200, major: 0, label: '12' },
                { time: 1498140000, major: 0, label: '15' },
                { time: 1498150800, major: 0, label: '18' }
            ];

            expect(result).to.deep.equal(expectedResult);
        });
        it('should handle ranges of between eight and 35 days', () => {
            const result = time.timeSeriesTicks(1497871283, 1497871283 + 86400 * 11.4);

            const expectedResult = [
                { time: 1497826800, major: 0, label: 'M' },
                { time: 1497913200, major: 0, label: 'T' },
                { time: 1497999600, major: 0, label: 'W' },
                { time: 1498086000, major: 0, label: 'T' },
                { time: 1498172400, major: 0, label: 'F' },
                { time: 1498258800, major: 0, label: 'S' },
                { time: 1498345200, major: 1, label: '25 Jun' },
                { time: 1498431600, major: 0, label: 'M' },
                { time: 1498518000, major: 0, label: 'T' },
                { time: 1498604400, major: 0, label: 'W' },
                { time: 1498690800, major: 0, label: 'T' },
                { time: 1498777200, major: 0, label: 'F' }
            ];

            expect(result).to.deep.equal(expectedResult);
        });
        it('should handle ranges of between 35 days and a year', () => {
            const result = time.timeSeriesTicks(1497871283, 1497871283 + 86400 * 35 * 1.5);

            const expectedResult = [
                { time: 1497826800, major: 0, label: '19 Jun' },
                { time: 1498431600, major: 0, label: '26 Jun' },
                { time: 1498863601, major: 2, label: 'Jul' },
                { time: 1499036400, major: 0, label: '3 Jul' },
                { time: 1499641200, major: 0, label: '10 Jul' },
                { time: 1500246000, major: 0, label: '17 Jul' },
                { time: 1500850800, major: 0, label: '24 Jul' },
                { time: 1501455600, major: 0, label: '31 Jul' },
                { time: 1501542001, major: 2, label: 'Aug' },
                { time: 1502060400, major: 0, label: '7 Aug' }
            ];

            expect(result).to.deep.equal(expectedResult);
        });
        it('should handle ranges of years', () => {
            const result = time.timeSeriesTicks(1456790400, 1494073200);

            const expectedResult = [
                { label: false, major: 0, time: 1456790400 },
                { label: false, major: 0, time: 1459465200 },
                { label: false, major: 0, time: 1462057200 },
                { label: false, major: 0, time: 1464735600 },
                { label: 'H2', major: 1, time: 1467327600 },
                { label: false, major: 0, time: 1470006000 },
                { label: false, major: 0, time: 1472684400 },
                { label: false, major: 0, time: 1475276400 },
                { label: false, major: 0, time: 1477958400 },
                { label: false, major: 0, time: 1480550400 },
                { label: '2017', major: 2, time: 1483228800 },
                { label: false, major: 0, time: 1485907200 },
                { label: false, major: 0, time: 1488326400 },
                { label: false, major: 0, time: 1491001200 },
                { label: false, major: 0, time: 1493593200 }
            ];

            expect(result).to.deep.equal(expectedResult);
        });
    });

    describe('getTimeScale', () => {
        it('should return a time scale', () => {
            const minX = 1456790400;
            const maxX = 1493593200;
            const pixX = xVal => 500 * (xVal - minX) / (maxX - minX);

            const scale = time.getTimeScale({ minX, maxX, pixX });

            const expectedResult = [
                { text: null, major: 0, pix: 0.5 },
                { text: null, major: 0, pix: 36.5 },
                { text: null, major: 0, pix: 71.5 },
                { text: null, major: 0, pix: 107.5 },
                { text: 'H2', major: 1, pix: 143.5 },
                { text: null, major: 0, pix: 179.5 },
                { text: null, major: 0, pix: 215.5 },
                { text: null, major: 0, pix: 251.5 },
                { text: null, major: 0, pix: 287.5 },
                { text: null, major: 0, pix: 322.5 },
                { text: '2017', major: 2, pix: 359.5 },
                { text: null, major: 0, pix: 395.5 },
                { text: null, major: 0, pix: 428.5 },
                { text: null, major: 0, pix: 464.5 }
            ];

            expect(scale(0)).to.deep.equal(expectedResult);
        });
    });
});

